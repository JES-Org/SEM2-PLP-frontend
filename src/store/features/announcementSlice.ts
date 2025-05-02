import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface announcementState {
  currAnnouncementId: string;
}

const initialState: announcementState = {
  currAnnouncementId: '',
};

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    setAnnouncementId: (state, action: PayloadAction<string>) => {
      state.currAnnouncementId = action.payload;
    },
  },
});

export const selectAnnouncementId = (state: { announcement: announcementState }) => state.announcement.currAnnouncementId;

export const { setAnnouncementId } = announcementSlice.actions;
export default announcementSlice.reducer;

