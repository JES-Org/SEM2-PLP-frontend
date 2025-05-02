import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface DialogState {
  activeDialog: 'create' | 'delete'| 'file' | null;
}

const initialState: DialogState = {
  activeDialog: null,
}

const announcementDialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<'create' | 'delete' | 'file'>) => {
      state.activeDialog = action.payload;
    },
    closeDialog: (state) => {
      state.activeDialog = null;
    }
  }
})

export const selectAnnouncementDialog = (state: RootState) => state.announcementDialog.activeDialog;

export const { openDialog, closeDialog } = announcementDialogSlice.actions;
export default announcementDialogSlice.reducer;
