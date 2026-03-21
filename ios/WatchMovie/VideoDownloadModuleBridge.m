#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(VideoDownloadModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startDownload:(NSString *)url taskId:(NSString *)taskId)
RCT_EXTERN_METHOD(cancelDownload:(NSString *)taskId)
RCT_EXTERN_METHOD(deleteFile:(NSString *)path)

@end
