import { useState } from 'react'

import { useMakeAttachmentMutation } from '@/store/announcement/announcementApi'
import {
	closeDialog,
	selectAnnouncementDialog,
} from '@/store/features/announcementDialogSlice'
import { selectAnnouncementId } from '@/store/features/announcementSlice'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { FileUp } from 'lucide-react'
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

const AttachmentDialog = () => {
	const [selectedFile, setSelectedFile] = useState<File[]>([])
	const [makeAttachment, { isLoading, isError, error }] =
		useMakeAttachmentMutation()
	const dialogType = useSelector(selectAnnouncementDialog)
	const dispatch = useDispatch()
	const currClassroomId = useSelector(selectCurrClassroomId)
	const currAnnouncementId = useSelector(selectAnnouncementId)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setSelectedFile(Array.from(e.target.files))
		}
	}

	const onFileUpload = async () => {
		console.log('File uploading...')
		if (selectedFile.length > 0) {
			console.log('File selected:', selectedFile)
			const formData = new FormData()
			selectedFile.forEach((file) => {
				formData.append('attachements', file)
			})
			console.log(`FORM DATA ${formData}`)
			makeAttachment({
				classRoomId: currClassroomId,
				id: currAnnouncementId,
				formData,
			})
				.unwrap()
				.then((res) => {
					toast.info('File uploaded successfully')
					dispatch(closeDialog())
				})
				.catch((err) => {
					toast.error('Failed to upload file')
					console.error('Failed to upload file:', err)
				})
		} else {
			console.log('No file selected')
		}
	}

	return (
		<Dialog
			open={dialogType === 'file'}
			onOpenChange={() => dispatch(closeDialog())}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Attachment</DialogTitle>
					<DialogDescription>Upload your files here</DialogDescription>
				</DialogHeader>
				<div className='space-y-2'>
					<div className='flex flex-col items-center space-y-2'>
						<input
							id='file'
							type='file'
							className='hidden'
							onChange={(e) => handleFileChange(e)}
						/>
						<label
							htmlFor='file'
							className='flex flex-col gap-2 items-center justify-center w-32 h-32 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer'
						>
							<FileUp className='w-8 h-8 text-muted-foreground' />
							<p className='text-xs text-muted-foreground'>Upload a file</p>
						</label>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={() => onFileUpload()} disabled={isLoading}>
						{isLoading ? 'Uploading...' : 'Upload'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
export default AttachmentDialog
