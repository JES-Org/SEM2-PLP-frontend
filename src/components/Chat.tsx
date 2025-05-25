import { useEffect, useRef } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { RootState } from '@/store'
import { useChatHistoryQuery } from '@/store/chatbot/chatbotApi'
import { addMessage } from '@/store/features/chatbotSlice'
import { SendHorizonal } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import Message from './Message'
import Spinner from './Spinner'
import Typing from './Typing'

interface ChatProps {
	typing: boolean
	currState: string | null
}

const Chat = ({ typing, currState }: ChatProps) => {
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const { data, isLoading, isFetching, isError } = useChatHistoryQuery(
		currUser?.id!,
	)
	const messages = useSelector((state: RootState) => state.chat.messages)
	const dispatch = useDispatch()
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const endOfMessagesRef = useRef<HTMLDivElement>(null)
	const pathname = usePathname()

	const sendHandler = () => {
		const currMessage = inputRef.current?.value
		if (currMessage?.trim() === '') return
		dispatch(addMessage({ text: currMessage, sender: 'me' }))
		inputRef.current!.value = ''
		endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		if (endOfMessagesRef.current) {
			endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [data?.chatHistory, messages, typing])
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter') {
			sendHandler()
		}
	}

	return (
		<div className='flex h-screen flex-col'>
			<main className='flex-1 overflow-y-auto p-4 flex-col justify-center items-center'>
				{isLoading || isFetching ? (
					<div className='flex justify-center items-center h-full'>
						<Spinner />
					</div>
				) : (
					<>
						{data?.chatHistory.length > 0 && (
							<div className='flex flex-col'>
								{data.chatHistory.map((message: any, i: number) => {
									return (
										<Message
											key={i}
											text={message.message}
											sender={message.is_ai_response ? 'other' : 'me'}
											className='mb-4'
										/>
									)
								})}
							</div>
						)}

						{data?.chatHistory.length === 0 && messages.length === 0 ? (
							<div className='flex items-center justify-center h-full'>
								<p className='font-semibold text-2xl text-gray-500'>
									No messages yet
								</p>
							</div>
						) : (
							<div className='flex flex-col'>
								{messages.map((message, i) => (
									<Message
										key={i}
										text={message.text}
										sender={message.sender}
										className='mb-4'
									/>
								))}
								{typing && <Typing />}
								<div ref={endOfMessagesRef} />
							</div>
						)}
					</>
				)}
			</main>
			{currState !== null && currState !== 'save' && (
				<div className='flex items-center gap-2 border-t bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950'>
					<textarea
						ref={inputRef}
						className='flex-1 rounded-md bg-blue-100 px-4 py-3 text-sm focus:outline-none dark:bg-gray-800 resize-none overflow-y-auto h-15'
						placeholder='Type your message...'
						onKeyDown={handleKeyDown}
						disabled={typing || isLoading}
					/>

					<Button
						className='rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50'
						size='icon'
						variant='ghost'
					>
						<SendHorizonal size="40" onClick={() => sendHandler()}

						/>
						<span className='sr-only'>Send message</span>
					</Button>
				</div>
			)}
		</div>
	)
}

export default Chat
