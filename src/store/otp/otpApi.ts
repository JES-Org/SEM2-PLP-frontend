import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { OtpSendRequest, OtpVerifyRequest, OtpResponse } from '@/types/auth/otp.type'

export const otpApi = createApi({
  reducerPath: 'otpApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/user/' }),
  endpoints: (builder) => ({
    sendOtp: builder.mutation<OtpResponse, OtpSendRequest>({
      query: (body) => ({
        url: 'otp/send/',
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation<OtpResponse, OtpVerifyRequest>({
      query: (body) => ({
        url: 'otp/verify/',
        method: 'POST',
        body,
    }),
  }),
}),
})

export const {useSendOtpMutation, useVerifyOtpMutation} = otpApi