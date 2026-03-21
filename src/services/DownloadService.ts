import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
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

  async startDownload(taskId: string) {
    const task = useDownloadStore.getState().tasks.find((t) => t.id === taskId);
    if (!task || task.status === 'downloading' || task.status === 'completed') return;

    useDownloadStore.getState().updateTask(taskId, { status: 'downloading', progress: 0 });

    try {
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
