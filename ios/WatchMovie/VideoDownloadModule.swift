import Foundation
import React

@objc(VideoDownloadModule)
class VideoDownloadModule: RCTEventEmitter {
    
    override init() {
        super.init()
        NotificationCenter.default.addObserver(self, selector: #selector(handleProgress), name: NSNotification.Name("onDownloadProgress"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handleFinished), name: NSNotification.Name("onDownloadFinished"), object: nil)
    }
    
    @objc func handleProgress(_ notification: Notification) {
        if let userInfo = notification.userInfo {
            print("VideoDownloadModule: Sending progress event to JS: \(userInfo)")
            sendEvent(withName: "onDownloadProgress", body: userInfo)
        }
    }
    
    @objc func handleFinished(_ notification: Notification) {
        if let userInfo = notification.userInfo {
            print("VideoDownloadModule: Sending finished event to JS: \(userInfo)")
            var body = userInfo
            body["status"] = "completed"
            sendEvent(withName: "onDownloadProgress", body: body)
        }
    }

    override func supportedEvents() -> [String]! {
        return ["onDownloadProgress"]
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func constantsToExport() -> [AnyHashable : Any]! {
        return ["homeDirectory": NSHomeDirectory()]
    }
    
    @objc
    func startDownload(_ url: String, taskId: String) {
        if let downloadUrl = URL(string: url) {
            VideoDownloadManager.shared.startDownload(url: downloadUrl, taskId: taskId)
        }
    }
    
    @objc
    func cancelDownload(_ taskId: String) {
        VideoDownloadManager.shared.cancelDownload(taskId: String(taskId))
    }
    
    @objc
    func deleteFile(_ path: String) {
        VideoDownloadManager.shared.deleteDownloadedFile(atPath: path)
    }
}
