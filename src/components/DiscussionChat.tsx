import { useEffect, useRef, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useGetAllMessagesQuery } from '@/store/discussion/discussionApi'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import {
	addMessage,
	selectIsRightClicked,
	selectMessages,
	setMessages,
	setRightClicked,
} from '@/store/features/discussionSlice'
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
	const token = currUser?.token

	const [inputValue, setInputValue] = useState('')
	const [socket, setSocket] = useState<WebSocket | null>(null)

	const {
		data: allMessages,
		error: allMessagesError,
		isLoading: isLoadingAllMesages,
		isFetching: isFetchingAllMessages,
		refetch,
	} = useGetAllMessagesQuery({
		classroomId: currClassroomId,
		page: 1,
		pageSize: 1000,
	})

	useEffect(() => {
		if (allMessages?.data) {
			dispatch(setMessages(allMessages.data))
		}
	}, [allMessages, dispatch])

	useEffect(() => {
		refetch()
	}, [])

	useEffect(() => {
		const wsUrl = `ws://localhost:8000/ws/chat/${currClassroomId}/?token=${encodeURIComponent(token)}`
		const chatSocket = new WebSocket(wsUrl)

		chatSocket.onopen = () => {
			console.log('WebSocket connection established')
		}

		chatSocket.onmessage = (event) => {
			const data = JSON.parse(event.data)

			dispatch(addMessage(data))
		}

		chatSocket.onclose = () => {
			console.warn('WebSocket closed. Reconnecting in 3 seconds...')
			setTimeout(() => setSocket(new WebSocket(wsUrl)), 3000)
		}

		chatSocket.onerror = (e) => {
			console.error('WebSocket error', e)
		}

		setSocket(chatSocket)

		return () => {
			chatSocket.close()
		}
	}, [currClassroomId, dispatch])

	useEffect(() => {
		if (isRightClicked.option === 'edit') {
			setInputValue(isRightClicked.content)
		}
	}, [isRightClicked])

	let lastDate = ''
	useEffect(() => {
		if (messages.length > 0) {
			endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages]) 
	const sendHandler = () => {
	if (!inputValue.trim()) return

	if (isRightClicked.option === null) {
		// Normal send
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(
				JSON.stringify({
					type: 'send',
					message: inputValue,
					sender_id: currUser.id,
				})
			)
			setInputValue('')
		} else {
			toast.error('WebSocket not connected. Try again.')
		}
	} else if (isRightClicked.option === 'edit') {
		// Edit existing message
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(
				JSON.stringify({
					type: 'edit',
					message_id: isRightClicked.id,
					message: inputValue,
					sender_id: currUser.id,
				})
			)
			setInputValue('')
			dispatch(setRightClicked({ option: null, content: '', id: null }))
		} else {
			toast.error('WebSocket not connected. Try again.')
		}
	}
}


	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			sendHandler()
		}
	}

	return (
		<div className='flex h-full flex-col'>
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
			<div className='flex items-center gap-2 border-t bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-950'>
				<Input
					ref={inputRef}
					className='flex-1 rounded-md bg-blue-100 px-4 py-6 text-sm focus:outline-none dark:bg-gray-800'
					placeholder='Type your message...'
					type='text'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<Button
					className='rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50'
					size='icon'
					variant='ghost'
					onClick={sendHandler}
				>
					<SendHorizonal />
					<span className='sr-only'>Send message</span>
				</Button>
			</div>
		</div>
	)
}

export default DiscussionChat
