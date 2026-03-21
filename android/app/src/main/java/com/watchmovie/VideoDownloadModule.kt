package com.watchmovie

import android.net.Uri
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.offline.DownloadRequest
import androidx.media3.exoplayer.offline.DownloadService
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import androidx.media3.exoplayer.offline.Download
import androidx.media3.exoplayer.offline.DownloadManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import androidx.media3.exoplayer.offline.DownloadHelper
import androidx.media3.common.TrackSelectionParameters
import androidx.media3.exoplayer.source.TrackGroupArray
import androidx.media3.exoplayer.trackselection.DefaultTrackSelector
import androidx.media3.common.C
import androidx.media3.common.MediaItem

@UnstableApi
class VideoDownloadModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "VideoDownloadModule"
    }

    private val downloadListener = object : DownloadManager.Listener {
        override fun onDownloadChanged(downloadManager: DownloadManager, download: Download, finalException: Exception?) {
            val params = Arguments.createMap()
            params.putString("taskId", download.request.id)
            params.putDouble("progress", download.percentDownloaded.toDouble() / 100.0)
            
            val stateString = when (download.state) {
                Download.STATE_DOWNLOADING -> "downloading"
                Download.STATE_COMPLETED -> "completed"
                Download.STATE_FAILED -> "error"
                Download.STATE_STOPPED -> "paused"
                else -> "pending"
            }
            params.putString("status", stateString)

            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onDownloadProgress", params)
        }
    }

    init {
        DownloadManagerSingleton.getDownloadManager(reactContext).addListener(downloadListener)
    }

    @ReactMethod
    fun startDownload(url: String, taskId: String) {
        val downloadHelper = DownloadHelper.forMediaItem(
            reactApplicationContext,
            MediaItem.fromUri(url),
            null,
            DownloadManagerSingleton.getHttpDataSourceFactory(reactApplicationContext)
        )

        downloadHelper.prepare(object : DownloadHelper.Callback {
            override fun onPrepared(helper: DownloadHelper) {
                // Configure parameters to prefer highest bitrate
                val trackSelectionParameters = TrackSelectionParameters.Builder(reactApplicationContext)
                    .setMaxVideoBitrate(Int.MAX_VALUE)
                    .build()
                
                // Clear default selections and apply our "highest quality" intent
                for (periodIndex in 0 until helper.periodCount) {
                    val mappedTrackInfo = helper.getMappedTrackInfo(periodIndex)
                    for (rendererIndex in 0 until mappedTrackInfo.rendererCount) {
                        if (mappedTrackInfo.getRendererType(rendererIndex) == C.TRACK_TYPE_VIDEO) {
                            helper.addTrackSelection(periodIndex, trackSelectionParameters)
                        }
                    }
                }

                val request = helper.getDownloadRequest(taskId, null)
                DownloadService.sendAddDownload(
                    reactApplicationContext,
                    VideoDownloadService::class.java,
                    request,
                    /* foreground= */ true
                )
                
                helper.release()
            }

            override fun onPrepareError(helper: DownloadHelper, e: java.io.IOException) {
                val params = Arguments.createMap()
                params.putString("taskId", taskId)
                params.putString("status", "error")
                params.putString("error", "Prepare failed: ${e.message}")
                reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onDownloadProgress", params)
                helper.release()
            }
        })
    }

    @ReactMethod
    fun pauseDownload(taskId: String) {
        DownloadService.sendSetStopReason(
            reactApplicationContext,
            VideoDownloadService::class.java,
            taskId,
            DownloadRequest.STOP_REASON_NONE,
            /* foreground= */ true
        )
    }

    @ReactMethod
    fun resumeDownload(taskId: String) {
        DownloadService.sendSetStopReason(
            reactApplicationContext,
            VideoDownloadService::class.java,
            taskId,
            0,
            /* foreground= */ true
        )
    }

    @ReactMethod
    fun cancelDownload(taskId: String) {
        DownloadService.sendRemoveDownload(
            reactApplicationContext,
            VideoDownloadService::class.java,
            taskId,
            /* foreground= */ true
        )
    }
}
