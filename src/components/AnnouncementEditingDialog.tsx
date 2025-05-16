import React, { useEffect } from 'react'

import { useUpdateAnnouncementMutation } from '@/store/announcement/announcementApi'
import {
	closeDialog,
	selectAnnouncementDialog,
} from '@/store/features/announcementDialogSlice'
import {
	selectSelectedAnnouncement,
	setSelectedAnnouncement,
} from '@/store/features/announcementSlice'
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

const AnnouncementEditingDialog = () => {
	const dialogType = useSelector(selectAnnouncementDialog)
	const selectedAnnouncement = useSelector(selectSelectedAnnouncement)
	const currClassroomId = useSelector(selectCurrClassroomId)
	const dispatch = useDispatch()

	const [updateAnnouncement] = useUpdateAnnouncementMutation()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			content: '',
		},
	})

	useEffect(() => {
		if (selectedAnnouncement) {
			form.reset({
				title: selectedAnnouncement.title,
				content: selectedAnnouncement.content,
			})
		}
	}, [selectedAnnouncement])

	const onEditSubmit = async (data: z.infer<typeof formSchema>) => {
		if (!selectedAnnouncement) return
		try {
			await updateAnnouncement({
				id: selectedAnnouncement.id,
				classRoomId: currClassroomId,
				title: data.title,
				content: data.content,
			}).unwrap()
			toast.success('Announcement updated successfully')
			dispatch(closeDialog())
			dispatch(setSelectedAnnouncement(null))
		} catch (err) {
			toast.error('Failed to update announcement')
			console.error('Update error:', err)
		}
	}

	return (
		<Dialog
			open={dialogType === 'edit'}
			onOpenChange={() => {
				dispatch(closeDialog())
				dispatch(setSelectedAnnouncement(null))
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Announcement</DialogTitle>
					<DialogDescription>
						Make changes to your announcement.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onEditSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder='Announcement title' {...field} />
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
											placeholder='Announcement content...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type='submit'>Save Changes</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default AnnouncementEditingDialog
