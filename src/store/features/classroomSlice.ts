import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface classroomState {
  currClassroomId: string;
}

const initialState: classroomState = {
  currClassroomId: '',
};

const classroomSlice = createSlice({
  name: "classroom",
  initialState,
  reducers: {
    setCurrClassroomId: (state, action: PayloadAction<string>) => {
      state.currClassroomId = action.payload;
    },
  },
});

export const selectCurrClassroomId = (state: { classroom: classroomState }) => state.classroom.currClassroomId;

export const { setCurrClassroomId } = classroomSlice.actions;
export default classroomSlice.reducer;

