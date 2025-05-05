// @ts-nocheck

'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { RootState } from '@/store'
import { closeDialog, openDialog } from '@/store/features/dialogSlice'
import {
	useGetStudentByIdQuery,
	useStudentSigninMutation,
} from '@/store/student/studentApi'
import {
	useGetTeacherByIdQuery,
	useTeacherSigninMutation,
} from '@/store/teacher/teacherApi'
import { StudentSigninResponse } from '@/types/auth/studentAuth.type'
import { ExtendedError } from '@/types/Error.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { z } from 'zod'

import { cn } from '@/lib/utils'

import { PasswordInput } from '@/components/PasswordInput'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Please enter a valid email format' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(8, { message: 'Password must contain at least 8 characters' }),
	role: z.string({ required_error: 'Role is required' }),
})

type FormType = z.infer<typeof formSchema>

const SigninPage = () => {
	const form = useForm<FormType>({
		resolver: zodResolver(formSchema),
	})

	const [studentId, setStudentId] = useState('')
	const [teacherId, setTeacherId] = useState('')

	const [
		studentSignin,
		{
			data: studentSigninData,
			isLoading: isLoadingStudentSignin,
			isSuccess: isSuccessStudentSignin,
			isError: isErrorStudentSignin,
			error: studentSigninError,
		},
	] = useStudentSigninMutation()

	const [
		teacherSignin,
		{
			data: teacherSigninData,
			isLoading: isLoadingTeacherSignin,
			isSuccess: isSuccessTeacherSignin,
			isError: isErrorTeacherSignin,
			error: teacherSigninError,
		},
	] = useTeacherSigninMutation()

	const {
		data: singleStudentData,
		isLoading: isLoadingSingleStudent,
		isSuccess: isSuccessSingleStudent,
		isError: isErrorSingleStudent,
		error: singleStudentError,
		refetch: singleStudentRefetch,
	} = useGetStudentByIdQuery(studentId, { skip: !studentId })

	const {
		data: singleTeacherData,
		isLoading: isLoadingSingleTeacher,
		isSuccess: isSuccessSingleTeacher,
		isError: isErrorSingleTeacher,
		error: singleTeacherError,
		refetch: singleTeacherRefetch,
	} = useGetTeacherByIdQuery(teacherId, { skip: !teacherId })

	const { setItem: setCurrUser, getItem: getCurrUser } =
		useLocalStorage('currUser')
	const router = useRouter()
	const [otpSent, setOtpSent] = useState(false)
	const isOpen = useSelector((state: RootState) => state.dialog.isOpen)
	const dispatch = useDispatch()

	useEffect(() => {
		if (studentId) {
			singleStudentRefetch()
		}
	}, [studentId, singleStudentRefetch])

	useEffect(() => {
		if (teacherId) {
			singleTeacherRefetch()
		}
	}, [teacherId, singleTeacherRefetch])

	useEffect(() => {
		if (singleStudentData) {
			console.log(`singleStudentData ${JSON.stringify(singleStudentData)}`)
			if (singleStudentData!.data!.year === null) {
				dispatch(openDialog('student'))
			} else {
				dispatch(closeDialog())
				router.push('/student/classroom/classroom-list')
			}
		}
	}, [singleStudentData, dispatch, router])

	useEffect(() => {
		if (singleTeacherData) {
			console.log(`singleTeacherData ${JSON.stringify(singleTeacherData)}`)
			if (singleTeacherData!.data!.first_name === '') {
				dispatch(openDialog('teacher'))
			} else {
				dispatch(closeDialog())
				router.push('/teacher/classroom/classroom-list')
			}
		}
	}, [singleTeacherData, dispatch, router])

	const onSubmit = (credentials: FormType) => {
		console.log(`credentials ${JSON.stringify(credentials)}`)
		if (credentials.role.toLowerCase() === 'student') {
			studentSignin(credentials)
				.unwrap()
				.then((res: StudentSigninResponse) => {
					console.log(`response ${JSON.stringify(res)}`)
					console.log("res.data",res.data)
					setCurrUser(res.data)
					setStudentId(res.data?.id!)
					dispatch(openDialog('student'))
					toast.success('Signin successful')
				})
				.catch((err: ExtendedError) => {
					console.log(`error ${JSON.stringify(err)}`)
					toast.error('Invalid credentials')
				})
		} else if (credentials.role.toLowerCase() === 'teacher') {
			teacherSignin(credentials)
				.unwrap()
				.then((res) => {
					console.log(`response ${JSON.stringify(res)}`)
					setCurrUser(res.data)
					setTeacherId(res.data?.id!)
					dispatch(openDialog('teacher'))
					toast.success('Signin successful')
				})
				.catch((err: ExtendedError) => {
					console.log(`error ${JSON.stringify(err)}`)
					toast.error('Invalid credentials')
				})
		}
	}

	return (
		<main className='flex h-screen w-screen justify-center items-center bg-[url(/signup-bg.jpg)]'>
			<div className='flex h-[80vh] w-[80vw] shadow-lg'>
				<section className='hidden lg:flex lg:flex-col lg:justify-center lg:items-center gap-8 rounded-l-2xl w-1/2 bg-zinc-800'>
					<h1 className='text-white text-3xl font-extrabold'>
						Welcome to CustomEd
					</h1>
					<Image
						src='/signin-illustration.svg'
						width={400}
						height={400}
						alt='Signup Illustration'
					/>
					<span className='text-primary-foreground'>
						Don't have an account ?{' '}
						<Link className='hover:underline' href='/auth/signup'>
							Signup
						</Link>
					</span>
				</section>

				<section className='flex flex-col items-center justify-center rounded-r-2xl lg:w-1/2 w-full bg-slate-50'>
					<div className='space-y-4 mb-10'>
						<h2 className='text-primary text-center text-xl font-bold'>
							Signin
						</h2>
						<p className='text-center text-gray-500'>Welcome to CustomEd</p>
					</div>
					<Form {...form}>
						<form
							method='POST'
							onSubmit={form.handleSubmit(onSubmit)}
							className='flex flex-col w-3/4 space-y-6'
						>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												className='font-semibold text-primary'
												placeholder='Email'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<PasswordInput
												className='font-semibold text-primary'
												placeholder='Password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='role'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Select onValueChange={field.onChange}>
												<FormControl>
													<SelectTrigger
														className={cn(
															'font-semibold text-muted-foreground',
															{
																'text-primary': field.value !== undefined,
															},
														)}
													>
														<SelectValue placeholder='Role' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem
														className='font-semibold text-primary'
														value='teacher'
													>
														Teacher
													</SelectItem>
													<SelectItem
														className='font-semibold text-primary'
														value='student'
													>
														Student
													</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{otpSent ? (
								<Dialog>
									<DialogTrigger asChild>
										<Button variant='link' className='text-gray-500 self-end'>
											Forgot password ?
										</Button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-[425px]'>
										<DialogHeader>
											<DialogTitle>Recover password</DialogTitle>
											<DialogDescription>
												Please enter the OTP you received.
											</DialogDescription>
										</DialogHeader>
										<div className='grid gap-4 py-4'>
											<div className='grid grid-cols-4 items-center gap-4'>
												<Label htmlFor='otp' className='text-right'>
													OTP
												</Label>
												<Input id='otp' className='col-span-3' />
											</div>
										</div>
										<DialogFooter>
											<Button
												type='submit'
												onClick={() => router.push('/auth/forgot-password')}
											>
												Submit
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							) : (
								<Dialog>
									<DialogTrigger asChild>
										<Button variant='link' className=' text-gray-500 self-end'>
											Forgot password ?
										</Button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-[425px]'>
										<DialogHeader>
											<DialogTitle>Recover password</DialogTitle>
											<DialogDescription>
												Please provide your email to recover your password.
											</DialogDescription>
										</DialogHeader>
										<div className='grid gap-4 py-4'>
											<div className='grid grid-cols-4 items-center gap-4'>
												<Label htmlFor='email' className='text-right'>
													Email
												</Label>
												<Input id='email' className='col-span-3' />
											</div>
										</div>
										<DialogFooter>
											<Button type='submit' onClick={() => setOtpSent(true)}>
												Submit
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							)}
							<div className='flex flex-col gap-y-4 w-full'>
								<Button
									className={cn('w-full', {
										'bg-primary/90':
											isLoadingStudentSignin || isLoadingTeacherSignin,
									})}
									disabled={isLoadingStudentSignin || isLoadingTeacherSignin}
									type='submit'
								>
									{isLoadingStudentSignin || isLoadingTeacherSignin ? (
										<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
									) : null}
									Signin
								</Button>
								<span className='md:hidden text-primary text-center text-sm'>
									Don't have an account ?
									<Link
										href='/auth/signup'
										className='text-primary ml-2 underline'
									>
										Signup
									</Link>
								</span>
							</div>
						</form>
					</Form>
				</section>
			</div>
		</main>
	)
}
export default SigninPage
