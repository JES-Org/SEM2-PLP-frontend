'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTeacherSignupMutation } from '@/store/teacher/teacherApi'
import { useSendOtpMutation } from '@/store/otp/otpApi'
import { useStudentSignupMutation } from '@/store/student/studentApi'
import { ExtendedError } from '@/types/Error.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { cn } from '@/lib/utils'

import { PasswordInput } from '@/components/PasswordInput'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
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

const formSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Please enter a valid email format' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must contain at least 8 characters' }),
		confirmPassword: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must contain at least 8 characters' }),
		role: z.string({ required_error: 'Role is required' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords do not match',
	})

type FormType = z.infer<typeof formSchema>

const SignupPage = () => {
	const router = useRouter()
	const { setItem: setEmailForVerification } = useLocalStorage(
		'emailForVerification',
	)
	const { setItem: setIdForVerification } = useLocalStorage('idForVerification')
	const { setItem: setRoleForVerification } = useLocalStorage(
		'roleForVerification',
	)

	const [
		studentSignup,
		{
			data: studentSignupData,
			error: studentSignupError,
			isLoading: isLoadingStudentSignup,
			isSuccess: isSuccessStudentSignup,
		},
	] = useStudentSignupMutation()
	const [
		teacherSignup,
		{
			data: teacherSignupData,
			error: teacherSignupError,
			isLoading: isLoadingTeacherSignup,
			isSuccess: isSuccessTeacherSignup,
		},
	] = useTeacherSignupMutation()
	const [
		sendOtp,
		{ data: otpData, isError: isErrorOtpSend, isSuccess: isSuccessOtpSend },
	] = useSendOtpMutation()

	const form = useForm<FormType>({
		resolver: zodResolver(formSchema),
	})

	const onSubmit = async (credentials: FormType) => {
		if (credentials.role.toLowerCase() === 'student') {
			studentSignup(credentials)
				.unwrap()
				.then((res) => {
					console.log(`studentSignupResponse: ${JSON.stringify(res)}`)
					setEmailForVerification(res.data?.email!)
					setIdForVerification(res.data?.id!)
					setRoleForVerification(res.data?.role!)
					sendOtp({
						email: res.data?.email!,
						userId: res.data?.id!,
						role: res.data?.role!,
					})
					toast.success('Please check your email for verification.')
					router.push('/auth/verify-email')
				})
				.catch((err: ExtendedError) => {
					console.log(`signup error ${JSON.stringify(err)}`)
					toast.error('Signup failed')
				})
		} else if (credentials.role.toLowerCase() === 'teacher') {
			teacherSignup(credentials)
				.unwrap()
				.then((res) => {
					console.log(`teacherSignupData: ${JSON.stringify(res)}`)
					setEmailForVerification(res.data?.email!)
					setIdForVerification(res.data?.id!)
					setRoleForVerification(res.data?.role!)
					sendOtp({
						email: res.data?.email!,
						userId: res.data?.id!,
						role: res.data?.role!,
					})
					toast.success('Please check your email for verification.')
					router.push('/auth/verify-email')
				})
				.catch((err: ExtendedError) => {
					console.log(`signup error ${JSON.stringify(err)}`)
					toast.error('Signup failed')
				})
		}
	}

	return (
		<main className='flex h-screen w-screen justify-center items-center bg-[url(/signup-bg.jpg)]'>
			<div className='flex h-[80vh] w-[80vw] shadow-lg'>
				<section className='flex flex-col items-center justify-center rounded-l-2xl lg:w-1/2 w-full bg-slate-50'>
					<div className='space-y-4 mb-10'>
						<h2 className='text-primary text-center text-xl font-bold'>
							Signup
						</h2>
						<p className='text-center text-gray-500'>Welcome to CustomEd</p>
					</div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='w-3/4 space-y-6'
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
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<PasswordInput
												className='font-semibold text-primary'
												placeholder='Confirm Password'
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
							<div className='flex flex-col gap-y-4 w-full'>
								<Button
									className={cn('w-full', {
										'bg-primary/90': isLoadingStudentSignup,
									})}
									disabled={isLoadingStudentSignup}
									type='submit'
								>
									{isLoadingStudentSignup || isLoadingTeacherSignup ? (
										<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
									) : null}
									Signup
								</Button>

								<span className='md:hidden text-primary text-center text-sm'>
									Already have an account ?
									<Link
										href='/auth/signin'
										className='text-primary ml-2 underline'
									>
										Signin
									</Link>
								</span>
							</div>
						</form>
					</Form>
				</section>

				<section className='hidden lg:flex lg:flex-col lg:justify-center lg:items-center gap-8 rounded-r-2xl w-1/2 bg-zinc-800'>
					<h1 className='text-white text-3xl font-extrabold'>
						Begin Your Journey
					</h1>
					<Image
						src='/signup-illustration.svg'
						width={300}
						height={300}
						alt='Signup Illustration'
					/>
					<span className='text-primary-foreground'>
						Already have an account ?{' '}
						<Link className='hover:underline' href='/auth/signin'>
							Signin
						</Link>
					</span>
				</section>
			</div>
		</main>
	)
}
export default SignupPage
