import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.remove(name);
  },
};

type ThemeMode = 'dark' | 'light' | 'system';
type Language = 'vi' | 'en';

interface AppState {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Auth
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  logout: () => void;
  
  // App State
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (seen: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      language: 'vi',
      setLanguage: (language) => set({ language }),
      
      userToken: storage.getString('user_token') || null,
      setUserToken: (userToken) => {
        if (userToken) storage.set('user_token', userToken);
        else storage.remove('user_token');
        set({ userToken });
      },
      logout: () => {
        storage.remove('user_token');
        set({ userToken: null });
      },
      
      hasSeenWelcome: storage.getBoolean('hasSeenWelcome') || false,
      setHasSeenWelcome: (hasSeenWelcome) => {
        storage.set('hasSeenWelcome', hasSeenWelcome);
        set({ hasSeenWelcome });
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
