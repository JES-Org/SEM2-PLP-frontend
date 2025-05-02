import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDeleteMessageMutation } from '@/store/discussion/discussionApi'
import { setRightClicked } from '@/store/features/discussionSlice'
import { CreateMessageResponseData } from '@/types/discussion/discussion.type'
import { useDispatch } from 'react-redux'

import { extractTime } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { usePathname } from 'next/navigation'

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
		deleteMessage({classroomId: currClassroomId, messageId: id})
		.unwrap()
		.then((res) => {
			if(res.isSuccess) {
				toast.success('Message deleted successfully')
			} else {
				toast.error('Failed to delete message')
			}
		dispatch(setRightClicked({id: null, content: '', option: null}))
		})
		.catch((err) => {
			toast.error('Failed to delete message')
		})
	}

	return (
		<div
			className={cn('flex flex-col gap-2', {
				'items-start': sender.id !== currUser.id,
				'items-end': sender.id === currUser.id,
			})}
		>
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<div
						className={cn(
							'flex flex-col gap-2 p-4 rounded-lg bg-primary text-primary-foreground w-[400px]',
							{
								'bg-secondary text-secondary-foreground':
									sender.id !== currUser.id,
							},
						)}
					>
						<div className='flex items-center justify-between'>
							<div className='text-xs font-medium'>{`${sender.firstName} ${sender.lastName}`}</div>
							<div className='text-xs'>{extractTime(updatedAt)}</div>
						</div>
						<div>
							<p className='text-sm break-words'>{content}</p>
						</div>
					</div>
				</ContextMenuTrigger>
				{sender.id === currUser.id && (
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
