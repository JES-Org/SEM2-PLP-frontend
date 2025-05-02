import { Teacher } from "../teacher/teacher.type";
import { Student } from "../student/student.type";


export interface Classroom {
  name: string;
  courseNo: string;
  description: string;
  creator: Teacher;
  members: Student[] | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClassroomRequest {
  name: string;
  courseNo: string;
  description: string;
  creatorId: string;
}

export interface CreateClassroomResponse extends Classroom {}

export interface EditClassroomRequest {

}

export interface EditClassroomResponse {
    
}

export interface AddBatchRequest {
  section: string;
  year: number;
  department: number;
  classRoomId: string;

}

export interface AddBatchResponse {
  isSuccess: boolean;
  message: string | null;
  data: Classroom;
  errors: string[] | null;
}

export interface StudentClassroomResponse {
  isSuccess: boolean;
  message: string | null;
  data: Classroom[];
  errors: string[] | null;
}

export interface TeacherClassroomResponse extends StudentClassroomResponse {}

export interface GetClassroomByIdResponse extends AddBatchResponse {}

export interface DeleteClassroomRequest {

}

export interface DeleteClassroomResponse {
  
}

export interface SearchClassroomResponse {
  isSuccess: boolean;
  message: string;
  data: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    results: Classroom[] | null;
  };
  errors: string[] | null
}

export interface AddStudentRequest {

}

export interface AddStudentResponse {
  
}

export interface RemoveStudentRequest {

}

export interface RemoveStudentResponse {

}