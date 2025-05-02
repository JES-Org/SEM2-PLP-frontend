import { useState } from 'react'

import { useCreateAssessmentMutation } from '@/store/assessment/assessmentApi'
import {
	closeDialog,
	selectAssessmentDialog,
} from '@/store/features/assessmentDialogSlice'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { format } from 'date-fns'
import { CalendarClock } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { Calendar } from './ui/calendar'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type Checked = DropdownMenuCheckboxItemProps['checked']

interface FormState {
	title: string
	description: string
	tag: boolean[]
	deadline: Date | undefined
}

const AssessmentCreatingDialog = () => {
	const dialogType = useSelector(selectAssessmentDialog)
	const dispatch = useDispatch()
	const currClassroomId = useSelector(selectCurrClassroomId)
	const [createAssessment, { isLoading }] = useCreateAssessmentMutation()

	const [formState, SetFormState] = useState<FormState>({
		title: '',
		description: '',
		tag: Array.from({ length: 10 }, () => false),
		deadline: undefined,
	})

	const onAssessmentCreation = () => {
		console.log(JSON.stringify(formState))
		const reqBody = {
			classroomId: currClassroomId,
			name: formState.title,
			description: formState.description,
			tag: formState.tag
				.map((tag, index) => (tag ? index + 1 : null))
				.filter((index) => index !== null)
				.join(','),
			deadline: formState.deadline?.toISOString()!,
		}
		console.log(JSON.stringify(reqBody))
		createAssessment(reqBody)
			.unwrap()
			.then((res) => {
				if (res.isSuccess) {
					toast.success('Assessment created successfully')
					dispatch(closeDialog())
				} else {
					toast.error('Failed to create assessment')
				}
			})
			.catch((err) => {
				toast.error('Failed to create assessment')
			})
	}

	return (
		<Dialog
			open={dialogType === 'create'}
			onOpenChange={() => dispatch(closeDialog())}
		>
			<DialogContent className='min-w-1/2'>
				<DialogHeader>
					<DialogTitle>Create Assessment</DialogTitle>
					<DialogDescription>
						Create assessment for evaluating students
					</DialogDescription>
				</DialogHeader>

				<div className='flex flex-col gap-4'>
					<div className='flex flex-col gap-2'>
						<Label>Name</Label>
						<Input
							placeholder='Weekly assessment'
							onChange={(e) => {
								SetFormState((prev) => ({ ...prev, title: e.target.value }))
							}}
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<Label>Description</Label>
						<Textarea
							placeholder='This is your wekly assessment'
							onChange={(e) => {
								SetFormState((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}}
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<Label className='block'>Deadline</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={'outline'}
									className={cn(
										'w-[240px] justify-start text-left font-normal',
										!formState.deadline && 'text-muted-foreground',
									)}
								>
									<CalendarClock className='mr-2 h-4 w-4' />
									{formState.deadline ? (
										format(formState.deadline, 'PPP')
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0' align='start'>
								<Calendar
									mode='single'
									selected={formState.deadline}
									onSelect={(date) => {
										SetFormState((prev) => ({ ...prev, deadline: date }))
									}}
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div className='flex flex-col gap-2'>
						<Label>Tags</Label>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline' className='w-1/4'>
									Select portion
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='w-56'>
								{Array.from({ length: 5 }).map((_, i) => (
									<DropdownMenuCheckboxItem
										key={i}
										checked={formState.tag[i] as Checked}
										onCheckedChange={(checked) => {
											SetFormState((prev) => ({
												...prev,
												tag: prev.tag.map((_, index) =>
													index === i ? checked : false,
												),
											}))
										}}
									>
										Chapter {i + 1}
									</DropdownMenuCheckboxItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<Button onClick={() => onAssessmentCreation()}>Create</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
export default AssessmentCreatingDialog
