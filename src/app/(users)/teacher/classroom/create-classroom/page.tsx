// @ts-nocheck

'use client'

import React, { use } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	useAddBatchMutation,
	useCreateClassRoomMutation,
	useAddStudentMutation,
} from '@/store/classroom/classroomApi'
import { useGetDepartmentsQuery } from '@/store/department/departmentApi'
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
	const [activeTab, setActiveTab] = React.useState<
		'createClassroom' | 'addBatch'
	>('createClassroom')
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const [createClassroom, { isLoading: isCreateClassroomLoading }] =
		useCreateClassRoomMutation()

	const [addBatch, { isLoading: isAddBatchLoading }] = useAddBatchMutation()
	const [addStudent, { isLoading: isAddStudentLoading }] = useAddStudentMutation()
	const { data: departments, isLoading: isDepartmentsLoading } =
	useGetDepartmentsQuery()
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
		const newClassroomData = {
			...formData,
			creatorId: currUser.teacher.id as string,
		}
		createClassroom(newClassroomData)
			.unwrap()
			.then((res: CreateClassroomResponse) => {
				setNewClassroomId(res.id)
				toast.success(`${formData.name} classroom created successfully`)
				// Switch to Add Batch tab after classroom is created
				setActiveTab('addBatch')
			})
			.catch(() => {
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
		
		addBatch(addBatchData)
			.unwrap()
			.then(() => {
				toast.success(`Batch ${formData.section} added successfully`)
				handleAddStudent(formData)
				router.push('/teacher/classroom/classroom-list')
			})
			.catch(() => {
				toast.error('Failed to add this batch')
			})
	}

	const handleAddStudent = (formData: z.infer<typeof addBatchFormSchema>) => {
		const addStudentData = {
			batch: {...formData, year: parseInt(formData.year), department: parseInt(formData.department)},
			classRoomId: newClassroomId,
		}

		addStudent(addStudentData)
			.unwrap()
			.then(() => {
				toast.success(`Students added to ${formData.section} successfully`)
			})
			.catch(() => {
				toast.error('Failed to add students')
			})
	}

	return (
		<div>
			<div className='pl-96 pt-20'>
				<Tabs
					className='w-full max-w-3xl'
					value={activeTab}
					onValueChange={(val) =>
						setActiveTab(val as 'createClassroom' | 'addBatch')
					}
				>
					<TabsList className='grid w-full grid-cols-2 mb-6'>
						<TabsTrigger
							value='createClassroom'
							disabled={!!newClassroomId} // Disable if classroom is already created
						>
							Create Classroom
						</TabsTrigger>
						<TabsTrigger
							value='addBatch'
							disabled={!newClassroomId} // Disable if classroom is not created yet
						>
							Add Batch
						</TabsTrigger>
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
													disabled={!!newClassroomId} // Disable input if classroom created
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
													disabled={!!newClassroomId}
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
													disabled={!!newClassroomId}
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
									disabled={isCreateClassroomLoading || !!newClassroomId}
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
													disabled={isDepartmentsLoading}
												>
													<SelectTrigger>
														<SelectValue placeholder='Select your department' />
													</SelectTrigger>
													<SelectContent>
														{departments?.map((dept) => (
															<SelectItem
																key={dept.id}
																value={dept.id.toString()}
															>
																{dept.name}
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
									disabled={isAddBatchLoading || !newClassroomId}
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
