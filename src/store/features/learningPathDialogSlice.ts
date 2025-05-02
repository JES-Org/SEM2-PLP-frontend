import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface DialogState {
  isOpen: boolean;
}

const initialState: DialogState = {
  isOpen: false,
}

const learningPathDialogSlice = createSlice({
  name: 'learningPathDialog',
  initialState,
  reducers: {
    openDialog: (state) => {
      state.isOpen = true
    },
    closeDialog: (state) => {
      state.isOpen = true
    }
  }
})

export const selectLearningPathDialog = (state: RootState) => state.learningPath.isOpen;

export const { openDialog, closeDialog } = learningPathDialogSlice.actions;
export default learningPathDialogSlice.reducer;
