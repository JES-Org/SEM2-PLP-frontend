// @ts-nocheck

'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useGetDepartmentsQuery } from '@/store/department/departmentApi'
import { closeDialog } from '@/store/features/dialogSlice'
import { RootState } from '@/store/index'
import { useEditStudentProfileMutation } from '@/store/student/studentApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import z from 'zod'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
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

const formSchema = z.object({
	studentId: z.string({ required_error: 'Student ID is required' }),
	firstName: z
		.string()
		.regex(/^[A-Za-z]+$/, 'First name should only contain alphabets')
		.min(1, 'First name is required'),
	lastName: z
		.string()
		.regex(/^[A-Za-z]+$/, 'Last name should only contain alphabets')
		.min(1, 'Last name is required'),
	phoneNumber: z
		.string({ required_error: 'Phone number is required' })
		.startsWith('+251')
		.length(13, 'Phone number length is invalid'),
	department: z.string({ required_error: 'Department is required' }),
	section: z.string(),
	year: z.string(),
})

type FormType = z.infer<typeof formSchema>

export default function StudentOnboardingDialog() {
	const form = useForm<FormType>({
		resolver: zodResolver(formSchema),
	})
	const isOpen = useSelector((state: RootState) => state.dialog.isOpen)
	const userType = useSelector((state: RootState) => state.dialog.userType)
	const dispatch = useDispatch()
	const router = useRouter()

	const [changeProfile, { data, isLoading, isSuccess, isError, error }] =
		useEditStudentProfileMutation()

	const { getItem: getCurrUser, setItem: setCurrUser } =
		useLocalStorage('currUser')
	const { data: departments, isLoading: isDepartmentsLoading } =
		useGetDepartmentsQuery()
	const onSubmit = (profileData: FormType) => {
		const currUser = getCurrUser()
		const profile = {
			...profileData,
			id: currUser.id as string,
			department: profileData.department,
			year: parseInt(profileData.year),
		}
		const transformedData = {
			student_id: profile.studentId,
			first_name: profile.firstName,
			last_name: profile.lastName,
			phone: profile.phoneNumber,
			year: profile.year,
			section: profile.section,
			department: profile.department,
		}

		console.log('transformedData', transformedData)
		changeProfile(transformedData)
			.unwrap()
			.then((res) => {
				toast.success('Profile updated successfully')
				dispatch(closeDialog())
				router.push('/student/classroom/classroom-list')
			})
			.catch((err) => {
				toast.error('Could not update profile')
			})
	}

	return (
		<>
			<Dialog
				open={isOpen && userType == 'student'}
				onOpenChange={() => dispatch(closeDialog())}
			>
				<DialogContent className='w-5/6'>
					<DialogHeader>
						<DialogTitle>👋 Welcome Onboard</DialogTitle>
						<DialogDescription>
							Setup your profile here. Click save when you're done.
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							method='POST'
							onSubmit={form.handleSubmit(onSubmit)}
							className='grid grid-cols-auto sm:grid-cols-1 md:grid-cols-2 gap-4'
						>
							<FormField
								control={form.control}
								name='studentId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Student ID</FormLabel>
										<FormControl>
											<Input
												className='text-primary'
												placeholder='UGR/1234/56'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input
												className='text-primary'
												placeholder='John'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='lastName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input
												className='text-primary'
												placeholder='Doe'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
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
													{departments.map((dept) => (
														<SelectItem
															key={dept.id}
															value={dept.id.toString()}
														>
															{' '}
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
								control={form.control}
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
								control={form.control}
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
													{[1, 2, 3, 4, 5,6].map((year) => (
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
							<FormField
								control={form.control}
								name='phoneNumber'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input
												className='text-primary'
												placeholder='+2510123456'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button className='col-span-full mt-3' type='submit'>
								Save changes
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	)
}
