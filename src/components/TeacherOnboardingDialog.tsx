// @ts-nocheck
'use client'

import { departments } from '@/constants/departments'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useGetFacultyQuery } from '@/store/classroom/classroomApi'
import { closeDialog } from '@/store/features/dialogSlice'
import { RootState } from '@/store/index'
import { useEditTeacherProfileMutation } from '@/store/teacher/teacherApi'
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
	faculty: z.string({ required_error: 'Faculty is required' }),
})

type FormType = z.infer<typeof formSchema>

export default function TeacherOnboardingDialog() {
	const form = useForm<FormType>({
		resolver: zodResolver(formSchema),
	})
	const isOpen = useSelector((state: RootState) => state.dialog.isOpen)
	const userType = useSelector((state: RootState) => state.dialog.userType)
	const dispatch = useDispatch()
	const router = useRouter()
	const { data: faculties } = useGetFacultyQuery()
	const [changeProfile, { data, isLoading, isSuccess, isError, error }] =
		useEditTeacherProfileMutation()
	console.log('faculties:', faculties)

	const { getItem: getCurrUser, setItem: setCurrUser } =
		useLocalStorage('currUser')

	const onSubmit = (profileData: FormType) => {
		const currUser = getCurrUser()
		const profile = {
			...profileData,
			id: currUser.id as string,
			email: currUser.email as string,
			faculty: profileData.faculty,
		}

		const transformedData = {
			id: profile.id,
			first_name: profile.firstName,
			last_name: profile.lastName,
			phone: profile.phoneNumber,
			faculty: profile.faculty,
			email: profile.email,
		}
		changeProfile(transformedData)
			.unwrap()
			.then((res) => {
				toast.success('Profile updated successfully')
				dispatch(closeDialog())
				router.push('/teacher/classroom/classroom-list')
			})
			.catch((err) => {
				toast.error('Could not update profile')
			})
	}

	return (
		<>
			<Dialog
				open={isOpen && userType == 'teacher'}
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
								name='faculty'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Faculty</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select your faculity' />
												</SelectTrigger>
												<SelectContent>
													{faculties?.data.map((fac) => (
														<SelectItem key={fac.id} value={fac.name}>
															{fac.name}
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
