import { BaseQueryApi } from "@reduxjs/toolkit/query";

// SRS 12.2 standardized error response format
export type TError = {
  data: {
    success: false;
    message: string;
    errors?: Record<string, string[]>; // Validation errors: { field_name: ["error1", "error2"] }
  };
  status: number;
};

// Legacy error format (for backwards compatibility)
export type TErrorLegacy = {
  data: {
    message: string;
    success: boolean;
    stack: string;
  };
  status: number;
};

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success: boolean;
  message: string;
};

export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi;
