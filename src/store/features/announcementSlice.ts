import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Annoucement } from '@/types/announcement/announcement.type'

interface announcementState {
	currAnnouncementId: string
	selectedAnnouncement: Annoucement | null
}

const initialState: announcementState = {
	currAnnouncementId: '',
	selectedAnnouncement: null,
}

const announcementSlice = createSlice({
	name: 'announcement',
	initialState,
	reducers: {
		setSelectedAnnouncement: (
			state,
			action: PayloadAction<Annoucement | null>,
		) => {
			state.selectedAnnouncement = action.payload
		},
		setAnnouncementId: (state, action: PayloadAction<string>) => {
			state.currAnnouncementId = action.payload
		},
	},
})

export const selectAnnouncementId = (state: {
	announcement: announcementState
}) => state.announcement.currAnnouncementId
export const selectSelectedAnnouncement = (state: any) => state.announcement.selectedAnnouncement;


export const { setAnnouncementId,setSelectedAnnouncement } = announcementSlice.actions
export default announcementSlice.reducer
