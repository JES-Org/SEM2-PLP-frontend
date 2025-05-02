export interface Student {
  studentId?:   string;
  firstName?:   string;
  lastName?:    string;
  dateOfBirth?: Date;
  department?:  number;
  phoneNumber?: string;
  joinDate?:    Date;
  year?:        number;
  section?:     string;
  email?:       string;
  password?:    string;
  role?:        number;
  isVerified?:  boolean;
  imageUrl?:    string;
  id?:          string;
  createdAt?:   Date;
  updatedAt?:   Date;
}

export interface GetSingleStudentResponse {
  isSuccess?: boolean;
  message?:   string;
  data?:      SingleStudentData;
  errors?:    string[];
}

export interface SingleStudentData {
  studentId?:   string;
  firstName?:   string;
  lastName?:    string;
  dateOfBirth?: Date;
  department?:  number;
  phoneNumber?: string;
  joinDate?:    Date;
  year?:        number;
  section?:     string;
  email?:       string;
  password?:    string;
  role?:        number;
  isVerified?:  boolean;
  imageUrl?:    string;
  id?:          string;
  createdAt?:   Date;
  updatedAt?:   Date;
}

export interface EditStudentProfileRequest {
  id?:          string;
  studentId?:   string;
  firstName?:   string;
  lastName?:    string;
  dateOfBirth?: string;
  department?:  number;
  phoneNumber?: string;
  joinDate?:    string;
  year?:        number;
  section?:     string;
  email?:       string;
}

