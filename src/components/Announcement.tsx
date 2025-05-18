import React, { useEffect, useRef, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	useDeleteAttachmentMutation,
	useGetAttachmentQuery,
} from '@/store/announcement/announcementApi'
import { openDialog } from '@/store/features/announcementDialogSlice'
import {
	selectAnnouncementId,
	setAnnouncementId,
	setSelectedAnnouncement,
} from '@/store/features/announcementSlice'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { Annoucement } from '@/types/announcement/announcement.type'
import { Paperclip, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

import { EllipsisVertical } from './Icons'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface AnnouncementProps extends React.HTMLAttributes<HTMLDivElement> {
	announcement: Annoucement
}

const Announcement = ({ children, ...props }: AnnouncementProps) => {
	const { announcement } = props
	const [isExpanded, setIsExpanded] = useState(false)
	const [isOverflowing, setIsOverflowing] = useState(false)
	const [attachmentId, setAttachmentId] = useState<string | null>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const dispatch = useDispatch()
	const currClassroomId = useSelector(selectCurrClassroomId)
	const currAnnouncementId = useSelector(selectAnnouncementId)
	const { refetch } = useGetAttachmentQuery(
		{
			classRoomId: currClassroomId,
			announcementId: currAnnouncementId,
			attachmentId: attachmentId!,
		},
		{ skip: !attachmentId },
	)
	const [deleteAttachment] = useDeleteAttachmentMutation()
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const role = getCurrUser().role == 0 ? 'student' : 'teacher'

	useEffect(() => {
		const contentElement = contentRef.current
		if (contentElement) {
			setIsOverflowing(
				contentElement.scrollHeight > contentElement.clientHeight,
			)
		}
	}, [])

	const onEdit = () => {
		dispatch(setSelectedAnnouncement(announcement))
		dispatch(openDialog('edit'))
	}

	const onAttachmentClick = (clickedAttachmentId: string) => {
		dispatch(setAnnouncementId(announcement?.id!))
		setAttachmentId(clickedAttachmentId)
	}

	useEffect(() => {
		if (attachmentId) {
			refetch()
		}
	}, [attachmentId])

	const onDeleteAttachment = async (attachmentId: string) => {
		try {
			await deleteAttachment({
				classRoomId: currClassroomId,
				attachmentId,
			}).unwrap()
			toast.success('Attachment deleted successfully')
		} catch (error) {
			toast.error('Failed to delete attachment')
			console.error('Delete attachment error:', error)
		}
	}
	const onDelete = () => {
		console.log('DELETE IS CLICKED')
		dispatch(setAnnouncementId(announcement?.id!))
		dispatch(openDialog('delete'))
	}

	const onAttachFile = () => {
		console.log('ATTACH FILE IS CLICKED')
		dispatch(setAnnouncementId(announcement?.id!))
		dispatch(openDialog('file'))
	}

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded)
	}

	return (
		<Card {...props}>
			<CardHeader className='flex flex-row justify-between'>
				<CardTitle className='text-xl'>{announcement.title}</CardTitle>
				{role === 'teacher' ? (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<EllipsisVertical className='h-4 w-4' />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								className='focus:bg-gray-300 cursor-pointer'
								onClick={onEdit}
							>
								Edit
							</DropdownMenuItem>

							<DropdownMenuItem
								className='focus:bg-gray-300 cursor-pointer'
								onClick={() => onAttachFile()}
							>
								Attach file
							</DropdownMenuItem>
							<DropdownMenuItem
								className='focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
								onClick={() => onDelete()}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : null}
			</CardHeader>

			<CardContent
				ref={contentRef}
				className={cn('text-sm', {
					'max-h-32 overflow-hidden': !isExpanded,
				})}
			>
				{announcement.content}
			</CardContent>
			<CardFooter>
				{isOverflowing && (
					<Button variant='link' onClick={toggleExpanded}>
						{isExpanded ? 'Show less' : 'Show more'}
					</Button>
				)}
				{announcement.attachments?.map((attachment, i) => (
					<div key={i} className='relative group'>
						<Button
							variant='link'
							onClick={() => onAttachmentClick(attachment.id)}
							className='pr-6' // Add padding for the X button
						>
							<Paperclip className='h-4 w-4 mr-1' />
							{`Attachment ${i + 1}`}
						</Button>
						{role === 'teacher' && (
							<button
								onClick={(e) => {
									e.stopPropagation()
									onDeleteAttachment(attachment.id)
								}}
								className='absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700'
								aria-label='Remove attachment'
							>
								<X className='h-4 w-4' />
							</button>
						)}
					</div>
				))}
			</CardFooter>
		</Card>
	)
}

export default Announcement
