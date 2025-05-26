import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
  activeDialog: null as 'deleteAccount' | null,
}

const studentDialogSlice = createSlice({
  name: 'studentDialog',
  initialState,
  reducers: {
    openDialog(state, action) {
      state.isOpen = true
      state.activeDialog = action.payload // 'deleteAccount'
    },
    closeDialog(state) {
      state.isOpen = false
      state.activeDialog = null
    },
  },
})

export const { openDialog, closeDialog } = studentDialogSlice.actions
export const selectStudentDialog = (state: any) => state.studentDialog
export default studentDialogSlice.reducer