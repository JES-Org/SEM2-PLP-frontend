export interface CreateMessageRequest {
  content: string;
  senderId: string;
  senderRole: number;
  threadParent?: string;
  classroomId: string;
}

export interface CreateMessageResponse {
  isSuccess: boolean;
  message: string;
  data: CreateMessageResponseData;
  errors: string[] | null;
}

export interface CreateMessageResponseData {
  id: string;
  content: string;
  sender: MessageSender;
  threadParent: string;
  classroomId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageSender {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: number;
  unreadMessages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EditMessageRequest {
  id: string;
  content: string;
  senderRole: number;
  senderId: string;
  classroomId: string;
}

export interface EditMessageResponse {
  isSuccess: boolean;
  message: string;
  data: EditMessageResponseData;
  errors: string[];
}

export interface EditMessageResponseData extends CreateMessageResponseData {}


export interface DeleteMessageResponse {
  isSuccess: boolean;
  message: string;
  data: DeleteMessageData;
  errors: string[];
}
export interface DeleteMessageData extends CreateMessageResponseData {}

export interface GetAllMessagesResponse {
  total: number;
  page: number;
  pageSize: number;
  data: GetAllMessagesResponseData[];
}

export interface GetAllMessagesResponseData extends CreateMessageResponseData {}