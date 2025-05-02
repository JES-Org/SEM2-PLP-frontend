import { CreateMessageResponseData } from "@/types/discussion/discussion.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface isRightClickType {
  id: string | null
  content: string
  option: 'edit' | 'delete' | null
}

interface DiscussionState {
  messages: CreateMessageResponseData[]
  isRightClicked: isRightClickType
}

const initialState: DiscussionState = {
  messages: [],
  isRightClicked: {
    id: null,
    content: '',
    option: null
  }
}

const discussionSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    setRightClicked: (state, action: PayloadAction<isRightClickType>) => {
      state.isRightClicked = action.payload
    }
  }
})

export const selectMessages = (state: { discussion: { messages: CreateMessageResponseData[] } }) => state.discussion.messages
export const selectIsRightClicked = (state: { discussion: { isRightClicked: isRightClickType }}) => state.discussion.isRightClicked

export const { addMessage, setMessages, setRightClicked } = discussionSlice.actions
export default discussionSlice.reducer 