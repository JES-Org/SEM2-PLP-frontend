import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface DialogState {
  activeDialog: 'create' | 'delete' | null;
}

const initialState: DialogState = {
  activeDialog: null,
}

const assessmentDialogSlice = createSlice({
  name: 'assessmentDialog',
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<'create' | 'delete'>) => {
      state.activeDialog = action.payload;
    },
    closeDialog: (state) => {
      state.activeDialog = null;
    }
  }
})

export const selectAssessmentDialog = (state: RootState) => state.assessmentDialog.activeDialog;

export const { openDialog, closeDialog } = assessmentDialogSlice.actions;
export default assessmentDialogSlice.reducer;
