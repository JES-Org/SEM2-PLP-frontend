import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface DialogState {
  isOpen: boolean;
  activeDialog: 'delete' | 'edit' | null;
  learningPathId: string | null;
}

const initialState: DialogState = {
  isOpen: false,
  activeDialog: null,
  learningPathId: null,
};

const learningPathDialogSlice = createSlice({
  name: 'learningPathDialog',
  initialState,
  reducers: {
    openDialog: (
      state,
      action: PayloadAction<{ activeDialog: 'delete' | 'edit'; learningPathId: string }>
    ) => {
      state.isOpen = true;
      state.activeDialog = action.payload.activeDialog;
      state.learningPathId = action.payload.learningPathId;
    },
    closeDialog: (state) => {
      state.isOpen = false;
      state.activeDialog = null;
      state.learningPathId = null;
    },
  },
});

export const selectLearningPathDialog = (state: RootState) => state.learningPath;
export const { openDialog, closeDialog } = learningPathDialogSlice.actions;
export default learningPathDialogSlice.reducer;
