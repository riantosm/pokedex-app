import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { isAxiosError, type AxiosRequestConfig } from 'axios';
import { axiosInstance } from './axiosInstance';

export interface AxiosQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  params?: AxiosRequestConfig['params'];
}

/** `status` null = tidak ada response (offline / timeout). */
export interface ApiError {
  status: number | null;
  message: string;
}

/** baseQuery RTK Query yang memakai `axiosInstance`. */
export const axiosBaseQuery =
  (): BaseQueryFn<AxiosQueryArgs | string, unknown, ApiError> => async args => {
    const {
      url,
      method = 'GET',
      params,
    } = typeof args === 'string' ? { url: args } : args;
    try {
      const response = await axiosInstance.request({ url, method, params });
      return { data: response.data };
    } catch (error) {
      if (isAxiosError(error)) {
        return {
          error: {
            status: error.response?.status ?? null,
            message: error.message,
          },
        };
      }
      return { error: { status: null, message: String(error) } };
    }
  };
