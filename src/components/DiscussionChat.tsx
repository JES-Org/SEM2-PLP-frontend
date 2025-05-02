import { useEffect, useRef, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	useCreateMessageMutation,
	useEditMessageMutation,
	useGetAllMessagesQuery,
} from '@/store/discussion/discussionApi'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import {
	addMessage,
	selectIsRightClicked,
	selectMessages,
	setMessages,
	setRightClicked,
} from '@/store/features/discussionSlice'
import { CreateMessageResponseData } from '@/types/discussion/discussion.type'
import { SendHorizonal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { toMonthAndDay } from '@/lib/helpers'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import DiscussionMessage from './DiscussionMessage'
import Spinner from './Spinner'

interface ChatProps {
	typing: boolean
}

const DiscussionChat = ({ typing }: ChatProps) => {
	const messages = useSelector(selectMessages)
	const isRightClicked = useSelector(selectIsRightClicked)
	const dispatch = useDispatch()
	const inputRef = useRef<HTMLInputElement>(null)
	const endOfMessagesRef = useRef<HTMLDivElement>(null)
	const currClassroomId = useSelector(selectCurrClassroomId)
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()

	const {
		data: allMessages,
		error: allMessagesError,
		isLoading: isLoadingAllMesages,
		isFetching: isFetchingAllMessages,
	} = useGetAllMessagesQuery({
		classroomId: currClassroomId,
		page: 1,
		pageSize: 1000,
	})
	const [createMessage, { isLoading: isSending }] = useCreateMessageMutation()
	const [editMessage, { isLoading: isEditing }] = useEditMessageMutation()
	const [inputValue, setInputValue] = useState('')

	useEffect(() => {
		if (allMessages?.data) {
			dispatch(setMessages(allMessages.data))
		}
	}, [allMessages, dispatch])

	useEffect(() => {
		if (isRightClicked.option === 'edit') {
			setInputValue(isRightClicked.content)
		}
	}, [isRightClicked])

	let lastDate = ''

	const sendHandler = async () => {
		if (isRightClicked.option === null) {
			try {
				const newMessage = await createMessage({
					classroomId: currClassroomId,
					content: inputValue,
					senderId: currUser.id,
					senderRole: currUser.role,
					// threadParent: '',
				}).unwrap()

				dispatch(addMessage(newMessage.data))
				setInputValue('')
				endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
			} catch (error) {
				console.error('Failed to send message:', error)
			}
		} else {
			try {
				await editMessage({
					id: isRightClicked.id as string,
					classroomId: currClassroomId,
					content: inputValue,
					senderId: currUser.id,
					senderRole: currUser.role,
				}).unwrap()
				setInputValue('')
				dispatch(setRightClicked({ id: null, content: '', option: null }))
			} catch (error) {
				toast.error('Failed to edit message')
			}
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			sendHandler()
		}
	}

	return (
		<div className='flex h-screen flex-col'>
			<main className='flex-1 overflow-y-auto p-4'>
				{isLoadingAllMesages || isFetchingAllMessages ? (
					<div className='flex items-center justify-center h-full'>
						<Spinner />
					</div>
				) : allMessagesError ? (
					<div className='flex items-center justify-center h-full'>
						<p className='font-semibold text-2xl text-gray-500'>
							Failed to load messages
						</p>
					</div>
				) : (
					<div className='flex flex-col gap-4'>
						{messages.map((message, index) => {
							const messageDate = toMonthAndDay(message.updatedAt)
							const showDate = messageDate !== lastDate
							lastDate = messageDate

							return (
								<div key={index}>
									{showDate && (
										<div className='flex justify-center'>
											<div className='px-4 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full'>
												{messageDate}
											</div>
										</div>
									)}
									<DiscussionMessage message={message} />
								</div>
							)
						})}
						<div ref={endOfMessagesRef} />
					</div>
				)}
			</main>
			<div className='flex items-center gap-2 border-t bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950'>
				<Input
					ref={inputRef}
					className='flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm focus:outline-none dark:bg-gray-800'
					placeholder='Type your message...'
					type='text'
					disabled={isSending}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => handleKeyDown(e)}
				/>
				<Button
					className='rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50'
					size='icon'
					variant='ghost'
					onClick={() => sendHandler()}
					disabled={isSending}
				>
					<SendHorizonal />
					<span className='sr-only'>Send message</span>
				</Button>
			</div>
		</div>
	)
}

export default DiscussionChat
