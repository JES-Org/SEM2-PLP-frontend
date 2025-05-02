export interface StudentSignupRequest {
    studentId?: string
    firstName?: string
    lastName?: string
    dateOfBirth?: Date
    department?: number
    phoneNumber?: string
    joinDate?: Date
    year?: number
    section?: string
    email?: string
    password?: string
}

export interface StudentSignupResponse {
  isSuccess?: boolean
  message?:   string
  data?:      MainSignupResponse
  errors?:    string[]
}  

interface MainSignupResponse {
  studentId?:   string
  firstName?:   string
  lastName?:    string
  dateOfBirth?: Date
  department?:  number
  phoneNumber?: string
  joinDate?:    Date
  year?:        number
  section?:     string
  email?:       string
  password?:    string
  role?:        number
  isVerified?:  boolean
  imageUrl?:    string
  id?:          string
  createdAt?:   Date
  updatedAt?:   Date
} 

export interface StudentSigninRequest {
  email:      string
  password:   string
}

export interface StudentSigninResponse {
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