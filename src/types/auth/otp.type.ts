export interface OtpSendRequest {
  email: string
  userId: string
  role: number
}

export interface OtpVerifyRequest {
  otp: string
  userId: string
  role: number
}

export interface OtpResponse {
  isSuccess?: boolean
  message?: string
  data?: string
  errors?: string[]
}
