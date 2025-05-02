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
}

const Chat = ({ typing }: ChatProps) => {
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const { data, isLoading, isFetching, isError } = useChatHistoryQuery(currUser?.id!)
	const messages = useSelector((state: RootState) => state.chat.messages)
	const dispatch = useDispatch()
	const inputRef = useRef<HTMLInputElement>(null)
	const endOfMessagesRef = useRef<HTMLDivElement>(null)
	const pathname = usePathname()



	const sendHandler = () => {
		const currMessage = inputRef.current?.value
		if (currMessage?.trim() === '') return
		dispatch(addMessage({ text: currMessage, sender: 'me' }))
		inputRef.current!.value = ''
		endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
									const cyclePosition = i % 5
									return (
										<Message
											key={i}
											text={message}
											sender={cyclePosition % 2 === 0 ? 'other' : 'me'}
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

			<div className='flex items-center gap-2 border-t bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950'>
				<Input
					ref={inputRef}
					className='flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm focus:outline-none dark:bg-gray-800'
					placeholder='Type your message...'
					type='text'
					onKeyDown={(e) => handleKeyDown(e)}
				/>
				<Button
					className='rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50'
					size='icon'
					variant='ghost'
				>
					<SendHorizonal onClick={() => sendHandler()} />
					<span className='sr-only'>Send message</span>
				</Button>
			</div>
		</div>
	)
}

export default Chat
