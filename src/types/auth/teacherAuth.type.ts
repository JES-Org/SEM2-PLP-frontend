export interface TeacherSignupRequest {
  firstName?: string
  lastName?: string
  dateOfBirth?: Date
  department?: number
  phoneNumber?: string
  joinDate?: Date
  email?: string
  password?: string
}

export interface TeacherSignupResponse {
  isSuccess?: boolean
  message?:   string
  data?:      MainSignupResponse
  errors?:    string[]
}  

interface MainSignupResponse {
  id?:          string
  firstName?:   string
  lastName?:    string
  email?:       string
  dateOfBirth?: Date
  phoneNumber?: string
  joinDate?:    Date
  role?:        number
  department?:  number
  imageUrl?:    string
  createdAt?:   Date
  updatedAt?:   Date
  isVerified?:  boolean
} 

export interface TeacherSigninRequest {
  email:      string
  password:   string
}

export interface TeacherSigninResponse {
  isSuccess?: boolean
  message?:   string
  data?:      MainSigninResponse
  errors?:    string[]
}

interface MainSigninResponse {
  id?:        string
  email?:     string
  role?:      number
  token?:     string
}