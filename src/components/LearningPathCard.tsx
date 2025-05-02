import { useState } from 'react'

import { useMarkAsCompletedMutation } from '@/store/chatbot/chatbotApi'
import { CalendarX } from 'lucide-react'

import { toMonthAndDay } from '@/lib/helpers'
import { cn } from '@/lib/utils'

import MarkdownRenderer from './MarkdownRenderer'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from './ui/dialog'

interface LearningPathCardProps {
	id: string
	userId: string
	title: string
	deadline: string
	isCompleted: boolean
	content: string
}

const LearningPathCard = ({
	id,
	userId,
	title,
	deadline,
	isCompleted,
	content,
}: LearningPathCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [showDialog, setShowDialog] = useState(false)

	const [complete, { isLoading }] = useMarkAsCompletedMutation()

	const handleComplete = async (e: any) => {
		e.stopPropagation()
		try {
			await complete({ studentId: userId, learningPathId: id })
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<Card className='cursor-pointer' onClick={() => setShowDialog(true)}>
				<CardHeader className='px-6 pt-6 pb-4'>
					<CardTitle className='text-2xl font-bold'>{title}</CardTitle>
					<div className='flex items-center gap-2 mt-2'>
						<Badge
							variant='outline'
							className={cn('rounded-full', {
								'bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400':
									isCompleted,
								'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400':
									!isCompleted,
							})}
						>
							{isCompleted ? 'Completed' : 'Ongoing'}
						</Badge>
						{!isCompleted && (
							<Button
								variant='outline'
								size='sm'
								className='ml-auto'
								onClick={(e) => handleComplete(e)}
							>
								Complete
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent className='relative max-h-32 overflow-hidden'>
					<div className='line-clamp-5'>
						<MarkdownRenderer content={content} />
					</div>
				</CardContent>
				<CardFooter className='mt-4 flex flex-row gap-x-2'>
					<CalendarX size={16} />
					<p>{toMonthAndDay(deadline)}</p>
				</CardFooter>
			</Card>

			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent className='w-full max-w-4xl max-h-[80vh] overflow-auto'>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>
							Deadline: {toMonthAndDay(deadline)}
						</DialogDescription>
					</DialogHeader>
					<div className='overflow-auto max-h-[60vh]'>
						<MarkdownRenderer content={content} />
					</div>
					<div className='mt-4'></div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default LearningPathCard
