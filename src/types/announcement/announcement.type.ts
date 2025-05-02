export interface AnnoucementMessage {
  title?: string;
  content?: string;
  file?: File;
}

export interface Annoucement {
  id?:          string;
  title?:       string;
  content?:     string;
  dateTime?:    Date;
  attachments?: any[];
  classRoom?:   AnnouncementTempClassroom;
  createdAt?:   Date;
  updatedAt?:   Date;
}

export interface AnnouncementTempClassroom {
  name?:        string;
  description?: string;
  students?:    any[];
  creatorId?:   string;
  memberIds?:   string[];
  id?:          string;
  createdAt?:   Date;
  updatedAt?:   Date;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  classRoomId: string;
  timeStamp: string;
}

export interface CreateAnnouncementResponse {
  isSuccess?: boolean;
  message?:   string;
  data?:      CreateAnnouncementResponseData;
  errors?:    null;
}

export interface CreateAnnouncementResponseData extends Annoucement {}

export interface GetAnnouncementsResponse {
  isSuccess?: boolean;
  message?:   string;
  data?:      Annoucement[];
  errors?:    null;
}

export interface DeleteAnnouncementParams {
  classRoomId: string;
  announcementId: string;
}