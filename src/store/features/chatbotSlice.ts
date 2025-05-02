import { MessageType } from "@/types/Message";
import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
  messages: MessageType[]
}

const initialState: ChatState = {
  messages: []
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    }
  }
})

export const { addMessage } = chatSlice.actions
export default chatSlice.reducer 