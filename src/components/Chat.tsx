// @ts-nocheck
import { useEffect, useRef, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	// Assuming RootState is correctly defined
	RootState,
} from '@/store'
// Corrected import path assuming your RTK Query API file is at this location
import { useGetMessagesByClassroomQuery } from '@/store/chatbot/chatbotApi'
import {
	addMessage,
	loadMessages,
	markMessageAsRead,
} from '@/store/features/chatbotSlice'
import { SendHorizonal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

// import { cn } from '@/lib/utils'; // Not used in the provided snippet, but keep if needed elsewhere

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import Message from './Message'
import Typing from './Typing'

interface ChatProps {
	classRoomId: string
	typing?: boolean
}

const Chat = ({ classRoomId, typing }: ChatProps) => {
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser() // e.g., { id: '123', name: 'Current User' }
	const token = currUser?.token

	// Messages from Redux store (single source of truth for display)
	const messages = useSelector(
		(state: RootState) => state.chat[classRoomId] || [],
	)
	const dispatch = useDispatch()

	// RTK Query hook for fetching historical messages
	const {
		data: historicalMessagesData, // Renamed to avoid conflict with 'messages' from Redux
		isLoading: isLoadingHistoricalMessages, // Specific loading state from RTK Query
		isError: isHistoricalMessagesError,
		error: historicalMessagesError,
		refetch,
	} = useGetMessagesByClassroomQuery(classRoomId, {
		skip: !classRoomId || !currUser?.id, // Skip query if no classRoomId or user
	})

	const inputRef = useRef<HTMLInputElement>(null)
	const endOfMessagesRef = useRef<HTMLDivElement>(null)
	const [socket, setSocket] = useState<WebSocket | null>(null)

	// Effect to load historical messages into Redux store once fetched by RTK Query
	useEffect(() => {
		if (historicalMessagesData && currUser?.id) {
			dispatch(
				loadMessages({
					classRoomId,
					messages: historicalMessagesData, // This is ApiMessageType[]
					currentUserId: currUser.id.toString(),
				}),
			)
		}
	}, [historicalMessagesData, classRoomId, dispatch, currUser?.id])

	useEffect(() => {
		if (classRoomId && currUser?.id) {
			refetch()
		}
	}, [classRoomId, currUser?.id])

	// Effect for WebSocket connection
	useEffect(() => {
		if (!classRoomId || !currUser?.id) {
			if (socket) {
				socket.close() // Close existing socket if conditions are no longer met
				setSocket(null)
			}
			return
		}
		if (!token) {
			console.error(
				'WebSocket: No token found for current user. Cannot connect.',
			)
			if (socket) {
				socket.close()
				setSocket(null)
			}
			return
		}
		const wsUrl = `ws://localhost:8000/ws/chat/classroom/${classRoomId}/?token=${encodeURIComponent(token)}`
		const ws = new WebSocket(wsUrl)
		setSocket(ws) // Set socket state immediately

		ws.onopen = () =>
			console.log('WebSocket connected for classroom:', classRoomId)

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data)
			const currentUserIdStr = currUser.id.toString()

			if (data.type === 'message') {
				const senderIdStr = data.sender_id.toString()
				dispatch(
					addMessage({
						classRoomId,
						message: {
							id: data.message_id.toString(),
							text: data.message,
							sender: senderIdStr === currentUserIdStr ? 'me' : 'other',
							senderName: data.sender,
							timestamp: data.timestamp,
							isRead: senderIdStr === currentUserIdStr, // Messages from self are read
						},
					}),
				)

				// Send read receipt if message is from someone else
				if (senderIdStr !== currentUserIdStr) {
					if (ws.readyState === WebSocket.OPEN) {
						ws.send(
							JSON.stringify({
								type: 'read_receipt',
								message_id: data.message_id,
								// reader_id will be self.user on the backend
							}),
						)
					}
				}
			} else if (data.type === 'read_receipt') {
				dispatch(
					markMessageAsRead({
						classRoomId,
						messageId: data.message_id.toString(),
						readerId: data.reader_id.toString(),
					}),
				)
			}
		}

		ws.onerror = (err) => console.error('WebSocket error:', err)

		ws.onclose = (event) => {
			console.log('WebSocket disconnected:', event.reason, event.code)
			// Only set socket to null if this specific ws instance is closing
			// This check helps prevent issues if a new socket is created quickly
			setSocket((prevSocket) => (prevSocket === ws ? null : prevSocket))
		}

		// Cleanup function: close WebSocket when component unmounts or dependencies change
		return () => {
			console.log('Closing WebSocket for classroom:', classRoomId)
			ws.close()
			setSocket(null) // Clear socket on cleanup
		}
	}, [classRoomId, dispatch, currUser?.id]) // currUser.id ensures re-connection if user changes

	// Effect to scroll to the bottom of messages
	useEffect(() => {
		if (messages.length > 0) {
			endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages]) // Runs whenever messages array (from Redux) changes

	const sendHandler = () => {
		const currentMessageText = inputRef.current?.value
		if (
			!currentMessageText?.trim() ||
			!socket ||
			socket.readyState !== WebSocket.OPEN
		) {
			console.warn(
				'Cannot send message: Message empty, socket not available, or socket not open.',
			)
			return
		}

		const messageToSendToServer = {
			type: 'message',
			message: currentMessageText,
			// sender_id is derived from the authenticated user on the backend
		}
		socket.send(JSON.stringify(messageToSendToServer))

		if (inputRef.current) {
			inputRef.current.value = '' // Clear input field
			inputRef.current.focus() // Keep focus on input
		}
		// Scrolling is handled by the useEffect watching messages
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			// Send on Enter, allow Shift+Enter for newline
			e.preventDefault() // Prevent default Enter behavior (e.g., form submission)
			sendHandler()
		}
	}

	const canSendMessage = socket && socket.readyState === WebSocket.OPEN

	return (
		<div className='flex h-full flex-col bg-white dark:bg-gray-900'>
			<main className='flex-1 overflow-y-auto p-4'>
				{isLoadingHistoricalMessages && (
					<div className='flex h-full items-center justify-center'>
						<p className='text-lg font-semibold text-gray-500 dark:text-gray-400'>
							Loading messages...
						</p>
					</div>
				)}
				{isHistoricalMessagesError && (
					<div className='flex h-full items-center justify-center'>
						<p className='text-lg font-semibold text-red-500'>
							Error loading messages: {/* @ts-ignore */}
							{historicalMessagesError?.data?.error ||
								historicalMessagesError?.message ||
								'Unknown error'}
						</p>
					</div>
				)}
				{!isLoadingHistoricalMessages &&
					!isHistoricalMessagesError &&
					messages.length === 0 && (
						<div className='flex h-full items-center justify-center'>
							<p className='text-lg font-semibold text-gray-500 dark:text-gray-400'>
								No messages yet. Start the conversation!
							</p>
						</div>
					)}
				{!isLoadingHistoricalMessages &&
					!isHistoricalMessagesError &&
					messages.length > 0 && (
						<div className='flex flex-col space-y-2'>
							{messages.map((message) => (
								<Message
									key={message.id}
									text={message.text}
									sender={message.sender}
									senderName={message.senderName}
									timestamp={message.timestamp}
									// className='mb-2' // space-y-2 on parent handles spacing
								/>
							))}
							{typing && <Typing />}
							<div ref={endOfMessagesRef} />
						</div>
					)}
			</main>

			<div className='flex items-center gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800'>
				<Input
					ref={inputRef}
					className='flex-1 rounded-md border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
					placeholder='Type your message...'
					type='text'
					onKeyDown={handleKeyDown}
				/>
				<Button
					className='rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50 disabled:opacity-50'
					size='icon'
					variant='ghost'
					onClick={sendHandler}
				>
					<SendHorizonal className='h-5 w-5' />
					<span className='sr-only'>Send message</span>
				</Button>
			</div>
		</div>
	)
}

export default Chat
