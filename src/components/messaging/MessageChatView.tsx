// 'use client'

// import Chat from '@/components/Chat'
// import { Button } from '@/components/ui/button'

// interface MessageChatViewProps {
// 	classRoomId: string
// 	isMobile: boolean
// 	onBackToClassrooms: () => void
// }

// export const MessageChatView = ({
// 	classRoomId,
// 	isMobile,
// 	onBackToClassrooms,
// }: MessageChatViewProps) => {
// 	return (
// 		<div className='flex-1 flex flex-col mt-12 md:mt-0 overflow-hidden'>
// 			{isMobile && (
// 				<div className='p-2'>
// 					<Button variant='outline' onClick={onBackToClassrooms}>
// 						Back to Classrooms
// 					</Button>
// 				</div>
// 			)}
// 			<Chat classRoomId={classRoomId} />
// 		</div>
// 	)
// }
