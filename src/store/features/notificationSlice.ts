import { createSlice } from "@reduxjs/toolkit";
import { UnreadNotificationData } from "@/types/notification/notification.type";
import { RootState } from "..";


interface NotificationState {
  notifications: UnreadNotificationData[]
}

const initialState: NotificationState = {
  notifications: []
}


const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload
    },
    clearNotifications: (state) => { 
      state.notifications = []
    },
  }
})

export const selectNotifications = (state: RootState) => state.notification.notifications

export const { setNotifications, clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer