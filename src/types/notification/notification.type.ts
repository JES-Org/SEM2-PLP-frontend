export interface UnreadNotificationResponse {
  isSuccess?: boolean;
  message?:   string | null;
  data:      UnreadNotificationData[];
  errors?:    string[] | null;
}

export interface UnreadNotificationData {
  id?:          string;
  description: string;
  receivers?:   any[];
  classroomId?: string;
  createdAt?:   Date;
  updatedAt?:   Date;
}
