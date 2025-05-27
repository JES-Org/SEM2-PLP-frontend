import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDeleteMessageMutation } from '@/store/discussion/discussionApi'
import { setRightClicked } from '@/store/features/discussionSlice'
import { CreateMessageResponseData } from '@/types/discussion/discussion.type'
import { usePathname } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

import { extractTime } from '@/lib/helpers'
import { cn } from '@/lib/utils'

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface Props {
	message: CreateMessageResponseData
}

const DiscussionMessage = ({ message }: Props) => {
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const { id, content, updatedAt, sender } = message
	const dispatch = useDispatch()
	const [deleteMessage, { isLoading, isSuccess, isError, error }] =
		useDeleteMessageMutation()
	const currClassroomId = usePathname().split('/').at(-2) as string

	const handleEdit = (id: string, content: string) => {
		dispatch(setRightClicked({ id, content, option: 'edit' }))
	}

	const handleDelete = (id: string) => {
		deleteMessage({ classroomId: currClassroomId, messageId: id })
			.unwrap()
			.then((res) => {
				if (res.isSuccess) {
					toast.success('Message deleted successfully')
				} else {
					toast.error('Failed to delete message')
				}
				dispatch(setRightClicked({ id: null, content: '', option: null }))
			})
			.catch((err) => {
				toast.error('Failed to delete message')
			})
	}

	return (
		<div
			className={cn('flex flex-col gap-2', {
				'items-start': String(sender.id) !== String(currUser.id),
				'items-start ml-20': String(sender.id) === String(currUser.id),
			})}
		>
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<div
						className={cn(
							'flex flex-col gap-2 p-4 rounded-lg bg-slate-600 text-primary-foreground min-w-[100px] max-w-[90%] w-fit break-words',
							{
								'bg-secondary text-secondary-foreground':
									String(sender.id) !== String(currUser.id),
							},
						)}
					>
						<div className='text-xs font-medium'>
							{String(sender.id) !== String(currUser.id)
								? `${sender.firstName} ${sender.lastName}`
								: 'you'}
						</div>
						<div>
							<p className='text-sm break-words'>{content} </p>
						</div>
						<div className='text-xs text-right self-end mt-1'>
							{extractTime(updatedAt)}
						</div>
					</div>
				</ContextMenuTrigger>
				{String(sender.id) === String(currUser.id) && (
					<ContextMenuContent>
						<ContextMenuItem
							className='flex cursor-pointer items-center justify-between px-3 py-2 text-sm focus:bg-accent focus:text-accent-foreground dark:focus:bg-blue-600'
							onClick={() => handleEdit(id, content)}
						>
							Edit
						</ContextMenuItem>
						<ContextMenuItem
							className='flex cursor-pointer items-center justify-between px-3 py-2 text-sm focus:bg-destructive focus:text-destructive-foreground dark:focus:bg-destructive dark:hover:text-destructive-foreground'
							onClick={() => handleDelete(id)}
						>
							Delete
						</ContextMenuItem>
					</ContextMenuContent>
				)}
			</ContextMenu>
		</div>
	)
}

export default DiscussionMessage
