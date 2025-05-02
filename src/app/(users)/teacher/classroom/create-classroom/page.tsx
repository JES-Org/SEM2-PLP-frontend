'use client'

import React from 'react'

import { departments } from '@/constants/departments'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	useAddBatchMutation,
	useCreateClassRoomMutation,
} from '@/store/classroom/classroomApi'
import { CreateClassroomResponse } from '@/types/classroom/classroom.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { cn } from '@/lib/utils'

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

const createClassroomFormSchema = z.object({
	name: z.string({ required_error: 'Course Name is required' }),
	courseNo: z.string({ required_error: 'Course Code is required' }),
	description: z.string({ required_error: 'Description is required' }),
})

const addBatchFormSchema = z.object({
	section: z.string({ required_error: 'Section is required' }),
	year: z.string({ required_error: 'Year is required' }),
	department: z.string({ required_error: 'Department is required' }),
})

const CreateClassroomPage = () => {
	const router = useRouter()
	const [newClassroomId, setNewClassroomId] = React.useState('')
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const [
		createClassroom,
		{
			isLoading: isCreateClassroomLoading,
			isSuccess: isCreateClassroomSuccess,
			isError: isCreateClassroomError,
			error: createClassroomError,
		},
	] = useCreateClassRoomMutation()

	const [
		addBatch,
		{
			isLoading: isAddBatchLoading,
			isSuccess: isAddBatchSuccess,
			isError: isAddBatchError,
			error: addBatchError,
		},
	] = useAddBatchMutation()

	const createClassroomForm = useForm<
		z.infer<typeof createClassroomFormSchema>
	>({
		resolver: zodResolver(createClassroomFormSchema),
	})

	const addBatchForm = useForm<z.infer<typeof addBatchFormSchema>>({
		resolver: zodResolver(addBatchFormSchema),
	})

	const handleCreateClassroom = (
		formData: z.infer<typeof createClassroomFormSchema>,
	) => {
		const newClassroomData = { ...formData, creatorId: currUser.id as string }
		console.log(`Create classroom data ${JSON.stringify(newClassroomData)}`)
		createClassroom(newClassroomData)
			.unwrap()
			.then((res: CreateClassroomResponse) => {
				setNewClassroomId(res.id)
				console.log(`New classroom id ${newClassroomId}`)
				toast.success(`${formData.name} classroom created successfully`)
			})
			.catch((err) => {
				toast.error(`Failed to create ${formData.name} classroom`)
			})
	}

	const handleAddBatch = (formData: z.infer<typeof addBatchFormSchema>) => {
		const addBatchData = {
			...formData,
			year: parseInt(formData.year),
			department: parseInt(formData.department),
			classRoomId: newClassroomId,
		}
		console.log(`Add batch data ${JSON.stringify(formData)}`)
		addBatch(addBatchData)
			.unwrap()
			.then((res) => {
				console.log(JSON.stringify(res))
				toast.success(`Batch ${formData.section} added successfully`)
				router.push('/teacher/classroom/classroom-list')
			})
			.catch((err) => {
				toast.error('Failed to add this batch')
			})
	}

	return (
		<div>
			<div className='pl-96 pt-20'>
				<Tabs className='w-full max-w-3xl' defaultValue='createClassroom'>
					<TabsList className='grid w-full grid-cols-2 mb-6'>
						<TabsTrigger value='createClassroom'>Create Classroom</TabsTrigger>
						<TabsTrigger value='addBatch'>Add Batch</TabsTrigger>
					</TabsList>
					<TabsContent value='createClassroom'>
						<Form {...createClassroomForm}>
							<form
								className='flex flex-col gap-y-4'
								method='POST'
								onSubmit={createClassroomForm.handleSubmit(
									handleCreateClassroom,
								)}
							>
								<FormField
									control={createClassroomForm.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Course name</FormLabel>
											<FormControl>
												<Input
													className='text-primary'
													placeholder='Operating Systems'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={createClassroomForm.control}
									name='courseNo'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Course code</FormLabel>
											<FormControl>
												<Input
													className='text-primary'
													placeholder='CoSc4021_'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={createClassroomForm.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder='Say something about the course'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									className={cn('w-full mt-6', {
										'bg-primary/90': isCreateClassroomLoading,
									})}
									disabled={isCreateClassroomLoading}
									type='submit'
								>
									{isCreateClassroomLoading ? (
										<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
									) : null}
									Submit
								</Button>
							</form>
						</Form>
					</TabsContent>

					{/* Add Batch Tab */}

					<TabsContent value='addBatch'>
						<Form {...addBatchForm}>
							<form
								className='flex flex-col gap-y-4'
								method='POST'
								onSubmit={addBatchForm.handleSubmit(handleAddBatch)}
							>
								<FormField
									control={addBatchForm.control}
									name='department'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Department</FormLabel>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<SelectTrigger>
														<SelectValue placeholder='Select your department' />
													</SelectTrigger>
													<SelectContent>
														{Object.entries(departments).map(([key, value]) => (
															<SelectItem key={value} value={value.toString()}>
																{key}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={addBatchForm.control}
									name='section'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Section</FormLabel>
											<FormControl>
												<Input
													className='text-primary'
													placeholder='1'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={addBatchForm.control}
									name='year'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Academic Year</FormLabel>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value?.toString()}
												>
													<SelectTrigger>
														<SelectValue placeholder='Select your academic year' />
													</SelectTrigger>
													<SelectContent>
														{[1, 2, 3, 4, 5].map((year) => (
															<SelectItem key={year} value={year.toString()}>
																{year}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									className={cn('w-full mt-6', {
										'bg-primary/90': isAddBatchLoading,
									})}
									disabled={isAddBatchLoading}
									type='submit'
								>
									{isAddBatchLoading ? (
										<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
									) : null}
									Submit
								</Button>
							</form>
						</Form>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export default CreateClassroomPage
