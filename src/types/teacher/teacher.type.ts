export interface Teacher {
  firstName?:   string;
  lastName?:    string;
  dateOfBirth?: Date;
  department?:  number;
  phoneNumber?: string;
  joinDate?:    Date;
  email?:       string;
  password?:    string;
  role?:        number;
  isVerified?:  boolean;
  imageUrl?:    string;
  id?:          string;
  createdAt?:   Date;
  updatedAt?:   Date;
}

export interface GetSingleTeacherResponse {
  isSuccess?: boolean;
  message?:   string;
  data?:      GetSingleTeacherResponseData;
  errors?:    string[];
}

export interface GetSingleTeacherResponseData {
  firstName?:   string;
  lastName?:    string;
  dateOfBirth?: Date;
  department?:  number;
  phoneNumber?: string;
  joinDate?:    Date;
  email?:       string;
  password?:    string;
  role?:        number;
  isVerified?:  boolean;
  imageUrl?:    string;
  id?:          string;
  createdAt?:   Date;
  updatedAt?:   Date;
}

export interface EditTeacherProfileRequest {
  id?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  department?: number;
  phoneNumber?: string;
  joinDate?: string;
  email?: string;
}
