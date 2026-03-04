import { useMutation } from '@tanstack/react-query';
import apiClient from '../client';
import { Endpoints } from '../endpoints';
import type { LoginResponse } from '../types';

interface LoginParams {
  phone: string;
  password: string;
}

interface MemberLoginParams {
  token: string;
  password: string;
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (params: LoginParams) =>
      apiClient.post<unknown, LoginResponse>(Endpoints.LOGIN, params),
  });
}

export function useMemberLoginMutation() {
  return useMutation({
    mutationFn: (params: MemberLoginParams) =>
      apiClient.post<unknown, LoginResponse>(Endpoints.LOGIN_MEMBER, params),
  });
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: (params: { phone: string; fullname: string; device_id: string }) =>
      apiClient.post(Endpoints.REGISTER_SEND_OTP, params),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (params: { phone: string; otp: string; device_id: string }) =>
      apiClient.post(Endpoints.REGISTER_VERIFY_OTP, params),
  });
}

export function useSavePasswordMutation() {
  return useMutation({
    mutationFn: (params: { password: string; access_token: string }) =>
      apiClient.post(Endpoints.REGISTER_SAVE_PASSWORD, params),
  });
}
