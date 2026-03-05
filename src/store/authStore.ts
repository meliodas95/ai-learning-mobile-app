import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { MemberEntity, LoginResponse, Account, CategoryEntity } from '@/src/api/types';
import { setTokenGetter } from '@/src/api/client';
import { SECURE_STORE_KEYS } from '@/src/constants';

interface AuthState {
  user: Account | null;
  member: MemberEntity | null;
  members: MemberEntity[];
  accessToken: string | null;
  accountToken: string | null;
  memberCategories: CategoryEntity[];
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (data: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  updateBalance: (balance: number) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Wire up token getter for API client
  setTokenGetter(() => get().accessToken);

  return {
    user: null,
    member: null,
    members: [],
    accessToken: null,
    accountToken: null,
    memberCategories: [],
    isAuthenticated: false,
    isLoading: true,

    setAuth: async (data: LoginResponse) => {
      const token = data.member_token;
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN, token);
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.ACCOUNT_TOKEN, data.account_token);

      set({
        user: data.account,
        member: data.member,
        members: data.members,
        accessToken: token,
        accountToken: data.account_token,
        memberCategories: data.member_categories,
        isAuthenticated: true,
        isLoading: false,
      });
    },

    logout: async () => {
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCOUNT_TOKEN);
      set({
        user: null,
        member: null,
        members: [],
        accessToken: null,
        accountToken: null,
        memberCategories: [],
        isAuthenticated: false,
        isLoading: false,
      });
    },

    loadStoredAuth: async () => {
      try {
        const token = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
        if (token) {
          set({ accessToken: token, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      } catch {
        set({ isLoading: false });
      }
    },

    updateBalance: (balance: number) => {
      const member = get().member;
      if (member) {
        set({ member: { ...member, member_token: { quantity: balance } } });
      }
    },
  };
});
