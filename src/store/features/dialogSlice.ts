import { createSlice } from "@reduxjs/toolkit";

interface DialogState {
  isOpen: boolean
  userType: 'student' | 'teacher'
}

const initialState: DialogState = {
  isOpen: false,
  userType: 'student'
}

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state, action) => {
      state.isOpen = true
      state.userType = action.payload
    },
    closeDialog: (state) => {
      state.isOpen = false
    }
  }
})

export const { openDialog, closeDialog } = dialogSlice.actions
export default dialogSlice.reducer
