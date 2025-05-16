export interface UnreadNotificationResponse {
  isSuccess?: boolean;
  message?: string | null;
  data: UnreadNotificationData[];
  errors?: string[] | null;
}

export interface UnreadNotificationData {
  id: number;                    
  message: string;                
  url?: string | null;             
  is_read: boolean;                
  created_at: string;            
  sender?: number | null;        
  recipient: number;              
}
