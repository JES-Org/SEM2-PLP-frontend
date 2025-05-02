import React from 'react'

import { useCreateAnnouncementMutation } from '@/store/announcement/announcementApi'
import {
	closeDialog,
	selectAnnouncementDialog,
} from '@/store/features/announcementDialogSlice'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog'

const formSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	content: z.string().min(1, { message: 'Content is required' }),
})

const AnnouncementCreatingDialog = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			content: '',
		},
	})

	const dialogType = useSelector(selectAnnouncementDialog)
	const dispatch = useDispatch()
	const currClassroomId = useSelector(selectCurrClassroomId)

	const [createAnnouncement, { isLoading, isSuccess, isError, error }] =
		useCreateAnnouncementMutation()

	const onAnnouncementCreation = (
		newAnnouncement: z.infer<typeof formSchema>,
	) => {
		// console.log(newAnnouncement)
		createAnnouncement({
			...newAnnouncement,
			classRoomId: currClassroomId,
			timeStamp: new Date().toISOString(),
		})
			.unwrap()
			.then((res) => {
				if (!res.isSuccess) {
					toast.error('Failed to create announcement')
				} else {
					toast.info('Announcement created successfully')
				}
				dispatch(closeDialog())
			})
			.catch((err) => {
				toast.error('Failed to create announcement')
			})
	}

	return (
		<Dialog
			open={dialogType === 'create'}
			onOpenChange={() => dispatch(closeDialog())}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Announcement</DialogTitle>
					<DialogDescription>
						Share important updates with your class.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onAnnouncementCreation)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder='Regarding final examination'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='content'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
									<FormControl>
										<Textarea
											placeholder='The final examination will be held on...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>Publish</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default AnnouncementCreatingDialog
