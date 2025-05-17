export interface MessageType {
	id: string;
  text: string;
  sender: 'me' | 'other';
  senderName?: string;
  timestamp?: string;
  isRead?: boolean;
  readBy?: string[];

}


export interface ApiMessageType {
  id: number | string; 
  content: string;
  sender_id: number | string; 
  sender_name: string;
  timestamp: string; 
  is_read_by_current_user?: boolean; 
}