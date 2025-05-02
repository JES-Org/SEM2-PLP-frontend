import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface DialogState {
  activeDialog: 'delete' | null;
  classroomIdTobeDeleted: string | null;
}

const initialState: DialogState = {
  activeDialog: null,
  classroomIdTobeDeleted: null
}

const classroomDialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<{ activeDialog: 'delete', classroomIdTobeDeleted: string }>) => {
      state.activeDialog = action.payload.activeDialog;
      state.classroomIdTobeDeleted = action.payload.classroomIdTobeDeleted;
    },
    closeDialog: (state) => {
      state.activeDialog = null;
      state.classroomIdTobeDeleted = null;
    }
  }
})

export const selectClassroomDialogType = (state: RootState) => state.classroomDialog.activeDialog;
export const selectClassroomIdTobeDeleted = (state: RootState) => state.classroomDialog.classroomIdTobeDeleted
export const { openDialog, closeDialog } = classroomDialogSlice.actions;
export default classroomDialogSlice.reducer;
