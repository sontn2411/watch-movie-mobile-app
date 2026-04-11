import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'download-storage' });

const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

export type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'error' | 'paused';

export interface DownloadTask {
  id: string; // ep_slug or unique id
  movieName: string;
  movieSlug: string;
  episodeName: string;
  serverName?: string;
  thumbUrl: string;
  videoUrl: string;
  status: DownloadStatus;
  progress: number; // 0 to 1
  filePath?: string;
  fileSize?: number;
  error?: string;
  addedAt: number;
}

interface DownloadState {
  tasks: DownloadTask[];
  addTask: (task: Omit<DownloadTask, 'status' | 'progress' | 'addedAt'>) => void;
  updateTask: (id: string, updates: Partial<DownloadTask>) => void;
  removeTask: (id: string) => void;
  clearAllTasks: () => void;
}

export const useDownloadStore = create<DownloadState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (taskData) => {
        const existing = get().tasks.find((t) => t.id === taskData.id);
        if (existing) return;

        const newTask: DownloadTask = {
          ...taskData,
          status: 'pending',
          progress: 0,
          addedAt: Date.now(),
        };

        set({ tasks: [newTask, ...get().tasks] });
      },
      updateTask: (id, updates) => {
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        });
      },
      removeTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          // Import at top or demand from service to avoid circular dep if any
          // Using a dynamic requirement if needed, but here it's fine
          import('../services/DownloadService').then(({ downloadService }) => {
             downloadService.removeDownload(id, task.filePath);
          });
        }
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
      },
      clearAllTasks: () => {
        const tasks = get().tasks;
        import('../services/DownloadService').then(({ downloadService }) => {
          tasks.forEach(t => downloadService.removeDownload(t.id, t.filePath));
        });
        set({ tasks: [] });
      },
    }),
    {
      name: 'download-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
