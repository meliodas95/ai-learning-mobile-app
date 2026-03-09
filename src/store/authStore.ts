import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { MemberEntity, LoginResponse, Account, CategoryEntity } from '@/src/api/types';
import apiClient, { setTokenGetter } from '@/src/api/client';
import { Endpoints } from '@/src/api/endpoints';
import { SECURE_STORE_KEYS } from '@/src/constants';
import { logger } from '@/src/utils/logger';

interface MemberListResponse {
  account: Account;
  members: MemberEntity[];
  member_categories: CategoryEntity[];
}

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
        const [token, accountToken] = await Promise.all([
          SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN),
          SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCOUNT_TOKEN),
        ]);

        if (!token) {
          set({ isLoading: false });
          return;
        }

        // Set token first so the API client can use it for the validation request
        set({ accessToken: token, accountToken });

        // Validate token by fetching user profile from backend
        const response = await apiClient.get<unknown, { data: MemberListResponse }>(
          Endpoints.MEMBER_LIST,
        );
        const data = response.data;
        const mainMember = data.members?.find((m) => m.is_main === 1) ?? data.members?.[0] ?? null;

        set({
          user: data.account,
          member: mainMember,
          members: data.members ?? [],
          memberCategories: data.member_categories ?? [],
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        logger.warn('Auth restoration failed, clearing tokens', error);
        // Token is invalid/expired — clear everything and send to login
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCOUNT_TOKEN);
        set({
          accessToken: null,
          accountToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
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
