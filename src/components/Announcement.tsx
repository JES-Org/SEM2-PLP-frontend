import React, { useEffect, useRef, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useGetAttachmentQuery } from '@/store/announcement/announcementApi'
import { openDialog } from '@/store/features/announcementDialogSlice'
import {
	selectAnnouncementId,
	setAnnouncementId,
} from '@/store/features/announcementSlice'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { Annoucement } from '@/types/announcement/announcement.type'
import { useDispatch, useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Paperclip } from 'lucide-react'

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
	const {} = useGetAttachmentQuery(
		{
			classRoomId: currClassroomId,
			announcementId: currAnnouncementId,
			attachmentId: attachmentId!,
		},
		{ skip: !attachmentId },
	)

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

	const onAttachmentClick = (clickedAttachmentId: string) => {
		dispatch(setAnnouncementId(announcement?.id!))
		setAttachmentId(clickedAttachmentId)
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
							<DropdownMenuItem className='focus:bg-gray-300 cursor-pointer'>
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
					<Button
						variant='link'
						key={i}
						onClick={() => onAttachmentClick(attachment)}
					>
						<Paperclip className='h-4 w-4 mr-1' />
						{`Attachment ${i + 1}`}
					</Button>
				))}
			</CardFooter>
		</Card>
	)
}

export default Announcement
