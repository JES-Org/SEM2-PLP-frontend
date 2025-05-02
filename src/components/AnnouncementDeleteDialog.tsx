import { useDeleteAnnouncementMutation } from '@/store/announcement/announcementApi'
import {
	closeDialog,
	selectAnnouncementDialog,
} from '@/store/features/announcementDialogSlice'
import { selectAnnouncementId } from '@/store/features/announcementSlice'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog'

const AnnouncementDeleteDialog = () => {
	const dialogType = useSelector(selectAnnouncementDialog)
	console.log(`DIALOG_TYPE ${dialogType}`)
	const dispatch = useDispatch()
	const currClassroomId = useSelector(selectCurrClassroomId)
	const currAnnouncementId = useSelector(selectAnnouncementId)
	console.log(`CURR_ANNOUNCEMENT_ID ${currAnnouncementId}`)
	console.log(`CURR_CLASSROOM_ID ${currClassroomId}`)
	const [deleteAnnouncement, { isLoading, isSuccess, isError, error }] =
		useDeleteAnnouncementMutation()

	const onAnnouncementDeletion = () => {
		deleteAnnouncement({
			announcementId: currAnnouncementId,
			classRoomId: currClassroomId,
		})
			.then((res) => {
				dispatch(closeDialog())
				toast.success('Announcement deleted successfully')
			})
			.catch((err) => {
				toast.error('Failed to delete announcement')
			})
	}

	return (
		<Dialog
			open={dialogType === 'delete'}
			onOpenChange={() => dispatch(closeDialog())}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Announcement</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Are you sure you want to delete this announcement?
				</DialogDescription>
				<DialogFooter>
					<Button
						variant='destructive'
						onClick={() => onAnnouncementDeletion()}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
export default AnnouncementDeleteDialog
