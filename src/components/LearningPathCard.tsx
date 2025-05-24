import { useState } from 'react'

import {
	useMarkAsCompletedMutation,
	useToggleTaskCompletionMutation,
} from '@/store/chatbot/chatbotApi'
import { LearningPath, Task } from '@/types/learningPath/pathType'
import { CalendarX } from 'lucide-react'
import { toast } from 'sonner'

import { toMonthAndDay } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { useDispatch } from 'react-redux'
import { EllipsisVertical } from './Icons'
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { openDialog } from '@/store/features/learningPathDialogSlice'
interface LearningPathCardProps {
	path: LearningPath
	userId: string
}
const LearningPathCard = ({ userId, path }: LearningPathCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [showDialog, setShowDialog] = useState(false)
    const dispatch = useDispatch()
	
	const [complete, { isLoading, isError }] = useMarkAsCompletedMutation()
	const [toggleTask] = useToggleTaskCompletionMutation()
	const handleToggleTask = async (taskId: string, e: React.SyntheticEvent) => {
		e.stopPropagation?.()
		try {
			await toggleTask({ taskId }).unwrap()
			toast.success('Task status updated')
		} catch (error) {
			toast.error('Failed to update task status')
		}
	}
	const handleDelete = (id: string) => {
      dispatch(openDialog({ activeDialog: 'delete', learningPathId:id }));
	}
	return (
		<>
			<Card className='cursor-pointer' onClick={() => setShowDialog(true)}>
				<CardHeader className='flex flex-row justify-between'>
					<CardTitle className='text-2xl font-bold'>{path.title}</CardTitle>

					<DropdownMenu>
						<DropdownMenuTrigger>
							<EllipsisVertical className='h-4 w-4' />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
								onClick={(e) => {
									e.stopPropagation()
									handleDelete(path.id)
								}}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardHeader>
				<CardContent className='flex flex-row justify-between'>
					<div className='flex items-center gap-2 mt-2'>
						<span className='text-md text-muted-foreground'>
							progress:  {Math.round(path.completion_percentage)}% 
						</span>
					</div>
					<div className='line-clamp-3'>{path.tasks.length} tasks</div>
				</CardContent>
				{path.deadline && (
					<CardFooter className='mt-4 flex flex-row gap-x-2'>
						<CalendarX size={16} />
						<p>{toMonthAndDay(path.deadline)}</p>
					</CardFooter>
				)}
			</Card>

			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent className='w-full max-w-4xl max-h-[80vh] overflow-auto'>
					<DialogHeader>
						<DialogTitle>{path.title}</DialogTitle>
						{path.deadline && (
							<DialogDescription>
								Deadline: {toMonthAndDay(path.deadline)}
							</DialogDescription>
						)}
					</DialogHeader>

					<div className='space-y-6'>
						{/* Prerequisites Section */}
						{path.tasks.find((task) => task.category === 'PREREQUISITE') && (
							<TaskSection
								title='Prerequisites'
								tasks={path.tasks.filter(
									(task) => task.category === 'PREREQUISITE',
								)}
								onToggle={handleToggleTask}
							/>
						)}

						{/* Weekly Tasks Section */}
						{path.tasks.some((task) => task.category === 'WEEK') && (
							<div className='space-y-4'>
								<h3 className='font-semibold text-lg'>Weekly Tasks</h3>
								{Array.from(
									new Set(
										path.tasks
											.filter((task) => task.category === 'WEEK')
											.map((task) => task.week_number),
									),
								).map((weekNum) => (
									<TaskSection
										key={weekNum}
										title={`Week ${weekNum}`}
										tasks={path.tasks.filter(
											(task) =>
												task.category === 'WEEK' &&
												task.week_number === weekNum,
										)}
										onToggle={handleToggleTask}
									/>
								))}
							</div>
						)}

						{/* Resources Section */}
						{path.tasks.find((task) => task.category === 'RESOURCE') && (
							<TaskSection
								title='Additional Resources'
								tasks={path.tasks.filter(
									(task) => task.category === 'RESOURCE',
								)}
								onToggle={handleToggleTask}
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
interface TaskSectionProps {
	title: string
	tasks: Task[]
	onToggle: (taskId: string, e: React.SyntheticEvent) => Promise<void>
}

const TaskSection = ({ title, tasks, onToggle }: TaskSectionProps) => (
	<div className='space-y-2'>
		{tasks.map((task) => (
			<div key={task.id} className='flex flex-col'>
				<div className='flex justify-between items-center w-full'>
					<h4
						className={cn('font-medium', {
							'line-through text-muted-foreground': task.is_completed,
						})}
					>
						{task.title}
						{task.day_range && (
							<span className='text-sm text-muted-foreground ml-2'>
								(Days {task.day_range})
							</span>
						)}
					</h4>

					<input
						type='checkbox'
						checked={task.is_completed}
						onChange={(e) => onToggle(task.id, e)}
						className='ml-4 w-5 h-5 accent-green-500 rounded focus:ring-2 focus:ring-offset-1 focus:ring-green-500'
					/>
				</div>

				<div className='text-sm text-muted-foreground mt-2'>
					<MarkdownRenderer content={task.description} />
				</div>
			</div>
		))}
	</div>
)
export default LearningPathCard
