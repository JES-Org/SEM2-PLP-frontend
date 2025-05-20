export interface MessageType {
  text: string;
  sender: 'other' | 'me'
}

export interface ApiMessageType {
  id: number | string; 
  content: string;
  sender_id: number | string; 
  sender_name: string;
  timestamp: string; 
  is_read_by_current_user?: boolean; 
}