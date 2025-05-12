export interface OtpSendRequest {
  email: string
  // userId: string
  // role: number
}

export interface OtpVerifyRequest {
  otp: string
  email: string
  // role: number
}

export interface OtpResponse {
  isSuccess?: boolean
  message?: string
  data?: string
  errors?: string[]
}
