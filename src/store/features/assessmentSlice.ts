import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface assessmentState {
  currAssessmentId: string;
}

const initialState: assessmentState = {
  currAssessmentId: '',
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    setAssessmentId: (state, action: PayloadAction<string>) => {
      state.currAssessmentId = action.payload;
    },
  },
});

export const selectCurrAssessmentId = (state: RootState) => state.assessment.currAssessmentId;

export const { setAssessmentId } = assessmentSlice.actions;
export default assessmentSlice.reducer;

