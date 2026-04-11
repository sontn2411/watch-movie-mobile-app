import Foundation
import AVFoundation

@objc(VideoDownloadManager)
class VideoDownloadManager: NSObject, AVAssetDownloadDelegate {
    static let shared = VideoDownloadManager()
    
    private var downloadSession: AVAssetDownloadURLSession!
    private var downloadTasks = [AVAssetDownloadTask: String]() 
    
    override init() {
        super.init()
        let configuration = URLSessionConfiguration.background(withIdentifier: "com.watchmovie.download.session")
        downloadSession = AVAssetDownloadURLSession(configuration: configuration,
                                                    assetDownloadDelegate: self,
                                                    delegateQueue: OperationQueue.main)
    }
    
    func startDownload(url: URL, taskId: String) {
        print("VideoDownloadManager: Starting download for \(taskId) - URL: \(url)")
        let asset = AVURLAsset(url: url)
        
        // Prefer highest bitrate for offline content
        let options: [String: Any] = [
            AVAssetDownloadTaskMinimumRequiredMediaBitrateKey: 2_000_000 // 2Mbps+ prefer high quality variants
        ]
        
        guard let task = downloadSession.makeAssetDownloadTask(asset: asset,
                                                               assetTitle: taskId,
                                                               assetArtworkData: nil,
                                                               options: options) else { 
            print("VideoDownloadManager: Failed to create download task for \(taskId)")
            return 
        }
        downloadTasks[task] = taskId
        task.resume()
        print("VideoDownloadManager: Task resumed for \(taskId)")
    }
    
    func cancelDownload(taskId: String) {
        for (task, id) in downloadTasks {
            if id == taskId {
                task.cancel()
                downloadTasks.removeValue(forKey: task)
                break
            }
        }
    }
    
    func deleteDownloadedFile(atPath path: String) {
        let fileManager = FileManager.default
        
        // Resolve path if it's relative
        var fullPath = path
        if !path.hasPrefix("/") {
            fullPath = NSHomeDirectory() + (path.hasPrefix("/") ? "" : "/") + path
        }
        
        // Always standardize to handle /private/var vs /var
        fullPath = URL(fileURLWithPath: fullPath).standardized.path
        let url = URL(fileURLWithPath: fullPath)
        
        do {
            if fileManager.fileExists(atPath: fullPath) {
                try fileManager.removeItem(at: url)
                print("VideoDownloadManager: Successfully deleted file at \(fullPath)")
            } else {
                print("VideoDownloadManager: File does not exist at \(fullPath)")
            }
        } catch {
            print("VideoDownloadManager: Error deleting file at \(fullPath): \(error.localizedDescription)")
        }
    }
    
    // MARK: AVAssetDownloadDelegate
    
    func urlSession(_ session: URLSession, assetDownloadTask: AVAssetDownloadTask, didFinishDownloadingTo location: URL) {
        if let taskId = downloadTasks[assetDownloadTask] {
            let fullPath = location.path
            let homePath = NSHomeDirectory()
            
            // Standardize paths to ensure prefix matching works (handles /private/var vs /var)
            let standardizedFullPath = URL(fileURLWithPath: fullPath).standardized.path
            let standardizedHomePath = URL(fileURLWithPath: homePath).standardized.path
            
            var relativePath = fullPath
            if standardizedFullPath.hasPrefix(standardizedHomePath) {
                relativePath = String(standardizedFullPath.dropFirst(standardizedHomePath.count))
            }
            
            NotificationCenter.default.post(name: NSNotification.Name("onDownloadFinished"), 
                                            object: nil, 
                                            userInfo: ["taskId": taskId, "location": relativePath])
        }
    }
    
    func urlSession(_ session: URLSession, assetDownloadTask: AVAssetDownloadTask, didLoad timeRange: CMTimeRange, totalTimeRangesLoaded loadedTimeRanges: [NSValue], timeRangeExpectedToLoad: CMTimeRange) {
        let percentComplete = loadedTimeRanges.reduce(0.0) { (result, value) in
            let range = value.timeRangeValue
            return result + CMTimeGetSeconds(range.duration) / CMTimeGetSeconds(timeRangeExpectedToLoad.duration)
        }
        
        if let taskId = downloadTasks[assetDownloadTask] {
            print("VideoDownloadManager: Progress for \(taskId): \(percentComplete * 100)%")
            NotificationCenter.default.post(name: NSNotification.Name("onDownloadProgress"), 
                                            object: nil, 
                                            userInfo: ["taskId": taskId, "progress": percentComplete])
        }
    }
    
    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        if let assetTask = task as? AVAssetDownloadTask, let taskId = downloadTasks[assetTask] {
            if let error = error {
                print("VideoDownloadManager: Error for \(taskId): \(error.localizedDescription)")
                NotificationCenter.default.post(name: NSNotification.Name("onDownloadProgress"), 
                                                object: nil, 
                                                userInfo: ["taskId": taskId, "status": "error", "error": error.localizedDescription])
            } else {
                print("VideoDownloadManager: Download completed successfully for \(taskId)")
            }
            downloadTasks.removeValue(forKey: assetTask)
        }
    }
}
