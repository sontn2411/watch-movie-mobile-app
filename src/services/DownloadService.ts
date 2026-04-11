import { NativeModules, Platform, NativeEventEmitter, PermissionsAndroid } from 'react-native';
import { useDownloadStore, DownloadTask } from '../store/useDownloadStore';

const { VideoDownloadModule } = NativeModules;
const downloadEmitter = VideoDownloadModule ? new NativeEventEmitter(VideoDownloadModule) : null;

class DownloadService {
  constructor() {
    if (VideoDownloadModule && downloadEmitter) {
      this.setupListeners();
    }
  }

  private setupListeners() {
    if (VideoDownloadModule && downloadEmitter) {
      downloadEmitter.addListener('onDownloadProgress', (event: any) => {
        const { taskId, progress, status } = event;
        const updates: Partial<DownloadTask> = { progress };
        
        if (status) {
          updates.status = status as any;
        }

        useDownloadStore.getState().updateTask(taskId, {
          ...updates,
          // If completed on iOS, we might want to set a local path
          ...(status === 'completed' && Platform.OS === 'ios' ? { filePath: event.location } : {})
        });
      });
    }
  }

  resolveFilePath(path?: string): string | undefined {
    if (!path) return undefined;
    if (Platform.OS === 'ios') {
      if (path.startsWith('file://')) return path;

      const homeDir = VideoDownloadModule?.homeDirectory || '';

      // 1. If it already starts with the current homeDir, it's correct
      if (path.startsWith(homeDir)) return path;

      // 2. If it's a relative path starting with /Library or /Documents, prepend homeDir
      if (path.startsWith('/Library') || path.startsWith('/Documents')) {
        return `${homeDir}${path}`;
      }

      // 3. Recovery: If it's an old absolute path from a previous build/install
      // Check for the common sandbox pattern: /Containers/Data/Application/UUID/...
      if (path.includes('/Containers/Data/Application/')) {
        const parts = path.split('/Containers/Data/Application/');
        if (parts.length > 1) {
          // parts[1] is UUID/Library/... or UUID/Documents/...
          const subPathWithUUID = parts[1];
          const firstSlashIndex = subPathWithUUID.indexOf('/');
          if (firstSlashIndex !== -1) {
            const relativeSubPath = subPathWithUUID.substring(firstSlashIndex);
            return `${homeDir}${relativeSubPath}`;
          }
        }
      }
    }
    return path;
  }

  resolvePlaybackUrl(task: DownloadTask): string {
    const filePath = this.resolveFilePath(task.filePath);
    if (filePath) {
      // Ensure the path is URL-encoded so that native video players (like RCTVideo)
      // don't fail when parsing file:// URIs containing spaces or special characters.
      const safePath = encodeURI(filePath);
      return safePath.startsWith('file://') ? safePath : `file://${safePath}`;
    }
    return task.videoUrl;
  }

  async startDownload(taskId: string) {
    const task = useDownloadStore.getState().tasks.find((t) => t.id === taskId);
    if (!task || task.status === 'downloading' || task.status === 'completed') return;

    useDownloadStore.getState().updateTask(taskId, { status: 'downloading', progress: 0 });

    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Quyền thông báo',
            message: 'Ứng dụng cần quyền thông báo để hiển thị tiến trình tải phim.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Hủy',
            buttonPositive: 'Đồng ý',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('POST_NOTIFICATIONS permission denied');
          useDownloadStore.getState().updateTask(taskId, { status: 'error' });
          return;
        }
      }

      if (VideoDownloadModule) {
        VideoDownloadModule.startDownload(task.videoUrl, taskId);
      } else {
        console.warn('VideoDownloadModule is not available');
      }
    } catch (error) {
      console.error('Failed to start native download:', error);
      useDownloadStore.getState().updateTask(taskId, { status: 'error' });
    }
  }

  async pauseDownload(taskId: string) {
    try {
      if (VideoDownloadModule) {
        if (Platform.OS === 'android') {
          VideoDownloadModule.pauseDownload(taskId);
        } else {
          VideoDownloadModule.cancelDownload(taskId);
        }
        useDownloadStore.getState().updateTask(taskId, { status: 'paused' });
      }
    } catch (error) {
      console.error('Failed to pause native download:', error);
    }
  }

  async resumeDownload(taskId: string) {
    try {
      if (VideoDownloadModule) {
        if (Platform.OS === 'android') {
          VideoDownloadModule.resumeDownload(taskId);
        } else {
          await this.startDownload(taskId);
        }
      }
    } catch (error) {
      console.error('Failed to resume native download:', error);
    }
  }

  async cancelDownload(taskId: string) {
    try {
      if (VideoDownloadModule) {
        VideoDownloadModule.cancelDownload(taskId);
        useDownloadStore.getState().removeTask(taskId);
      }
    } catch (error) {
      console.error('Failed to cancel native download:', error);
    }
  }

  async removeDownload(taskId: string, filePath?: string) {
    try {
      if (VideoDownloadModule) {
        // 1. Cancel active download if any
        VideoDownloadModule.cancelDownload(taskId);
        
        // 2. Delete physical file if completed (iOS specifically needs this)
        if (Platform.OS === 'ios' && filePath) {
          VideoDownloadModule.deleteFile(filePath);
        }
        // Android's cancelDownload (sendRemoveDownload) already handles file deletion
      }
    } catch (error) {
      console.error('Failed to remove native download:', error);
    }
  }
}

export const downloadService = new DownloadService();
