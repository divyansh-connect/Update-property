import { create } from 'zustand';

// --- Theme Store ---
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark';
  let initialTheme: 'light' | 'dark' = 'light';
  if (saved) {
    initialTheme = saved;
  } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    initialTheme = 'dark';
  }
  return {
    theme: initialTheme,
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: newTheme };
    }),
    setTheme: (theme) => set(() => {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme };
    }),
  };
});

// Initialize theme on load
if (
  localStorage.getItem('theme') === 'dark' ||
  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}


// --- Auth Store ---
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('user'),
  login: async (email: string) => {
    // Mock login verification
    await new Promise((resolve) => setTimeout(resolve, 800));
    let role = 'Property Manager';
    let name = 'Sarah Davis';

    if (email.toLowerCase().includes('admin')) {
      role = 'Super Admin';
      name = 'John Doe';
    } else if (email.toLowerCase().includes('owner')) {
      role = 'Owner';
      name = 'Lakeside Development';
    } else if (email.toLowerCase().includes('tenant')) {
      role = 'Tenant';
      name = 'Robert Johnson';
    } else if (email.toLowerCase().includes('staff') || email.toLowerCase().includes('tech')) {
      role = 'Maintenance Staff';
      name = 'Technician Lead 1';
    }

    const mockUser: User = {
      id: 'usr-1',
      name: name,
      email: email,
      role: role,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    set({ user: mockUser, isAuthenticated: true });
    return true;
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
}));


// --- Notifications Store ---
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    { id: 'notif-1', title: 'New Maintenance Request', message: 'AC Not Cooling in Unit 301 (Sunset Villas)', time: '10m ago', read: false, type: 'warning' },
    { id: 'notif-2', title: 'Payment Received', message: 'John Doe paid $1,850 rent for Unit 101', time: '1h ago', read: false, type: 'success' },
    { id: 'notif-3', title: 'Lease Expiring Soon', message: 'Jane Smith (Unit 102) lease expires in 12 days', time: '1d ago', read: true, type: 'info' },
  ],
  addNotification: (n) => set((state) => ({
    notifications: [
      {
        ...n,
        id: `notif-${Date.now()}`,
        time: 'Just now',
        read: false
      },
      ...state.notifications
    ]
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),
  clearAll: () => set({ notifications: [] }),
}));
