import { MessageType ,ApiMessageType} from "@/types/Message";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  [classRoomId: string]: MessageType[];
}

const initialState: ChatState = {}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {

    loadMessages: (
      state,
      action: PayloadAction<{
        classRoomId: string;
        messages: ApiMessageType[];
        currentUserId: string; // Pass current user's ID to map sender
      }>,
    ) => {
      const { classRoomId, messages, currentUserId } = action.payload;
      state[classRoomId] = messages
        .map((msg) => ({
          id: msg.id.toString(),
          text: msg.content,
          sender: msg.sender_id.toString() === currentUserId ? "me" as "me" : "other" as "other",
          senderName: msg.sender_name,
          timestamp: msg.timestamp,
  
          isRead: msg.sender_id.toString() === currentUserId,
        }))
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        ); // Ensure sorted
    },
    addMessage: (state, action: PayloadAction<{ classRoomId: string, message: MessageType }>) => {
      const { classRoomId, message } = action.payload;
      if (!state[classRoomId]) {
        state[classRoomId] = [];
      }
      state[classRoomId].push(message);
    },
    setMessages: (state, action: PayloadAction<{ courseId: string, messages: MessageType[] }>) => {
      state[action.payload.courseId] = action.payload.messages;
    },
    markMessageAsRead: (state, action) => {
      const { classRoomId, messageId, readerId } = action.payload;
      if (state[classRoomId]) {
        const message = state[classRoomId].find(m => m.id === messageId);
        if (message) {
          if (!message.readBy) message.readBy = [];
          if (!message.readBy.includes(readerId)) {
            message.readBy.push(readerId);
          }
        }
      }
    }
  }
})

export const { addMessage, setMessages ,markMessageAsRead,loadMessages} = chatSlice.actions
export default chatSlice.reducer
