import { useMutation } from '@tanstack/react-query';
import apiClient from '@/src/api/client';
import { Endpoints } from '@/src/api/endpoints';
import type { ApiResponse, LoginResponse } from '@/src/api/types';

interface LoginParams {
  phone: string;
  password: string;
}

interface MemberLoginParams {
  token: string;
  password: string;
}

interface SendOtpParams {
  phone: string;
  deviceId: string;
}

interface VerifyOtpParams {
  phone: string;
  otp: string;
  deviceId: string;
}

interface SavePasswordParams {
  token: string;
  deviceId: string;
  fullname: string;
  password: string;
}

interface ForgotPasswordParams {
  phone: string;
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (params: LoginParams) =>
      apiClient.post<unknown, ApiResponse<LoginResponse>>(Endpoints.LOGIN, params),
  });
}

export function useMemberLoginMutation() {
  return useMutation({
    mutationFn: (params: MemberLoginParams) =>
      apiClient.post<unknown, ApiResponse<LoginResponse>>(Endpoints.LOGIN_MEMBER, params),
  });
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: (params: SendOtpParams) =>
      apiClient.post<unknown, ApiResponse<{ device_id: string }>>(
        Endpoints.REGISTER_SEND_OTP,
        params,
      ),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (params: VerifyOtpParams) =>
      apiClient.post<unknown, ApiResponse<{ token: string }>>(
        Endpoints.REGISTER_VERIFY_OTP,
        params,
      ),
  });
}

export function useSavePasswordMutation() {
  return useMutation({
    mutationFn: (params: SavePasswordParams) =>
      apiClient.post<unknown, ApiResponse<{ accessToken: string }>>(
        Endpoints.REGISTER_SAVE_PASSWORD,
        params,
      ),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (params: ForgotPasswordParams) =>
      apiClient.post<unknown, ApiResponse<unknown>>(Endpoints.FORGOT_PASSWORD, params),
  });
}
