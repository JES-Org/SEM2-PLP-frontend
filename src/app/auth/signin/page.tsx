// @ts-nocheck

'use client';

import { useEffect, useState } from 'react';



import { useLocalStorage } from '@/hooks/useLocalStorage';
import { RootState } from '@/store';
import { closeDialog, openDialog } from '@/store/features/dialogSlice';
import { useSendOtpMutation } from '@/store/otp/otpApi';
import { useGetStudentByIdQuery, useUserSigninMutation } from '@/store/student/studentApi';
import { useGetTeacherByIdQuery } from '@/store/teacher/teacherApi';
import { UserSigninResponse } from '@/types/auth/studentAuth.type';
import { ExtendedError } from '@/types/Error.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';



import { cn } from '@/lib/utils';



import { PasswordInput } from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';





const formSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Please enter a valid email format' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(8, { message: 'Password must contain at least 8 characters' }),
})

type FormType = z.infer<typeof formSchema>

const SigninPage = () => {
	const form = useForm<FormType>({
		resolver: zodResolver(formSchema),
	})

	const [studentId, setStudentId] = useState('')
	const [teacherId, setTeacherId] = useState('')
	const [emailError, setEmailError] = useState('')
	const [emailverfication, Setemailverfication] = useState('')
	const [showResendOtpLink, setShowResendOtpLink] = useState(false);
    const [emailForResend, setEmailForResend] = useState('');

	const validateEmail = (value) => {
		// Basic email regex
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return regex.test(value)
	}

	const [
		userSignin,
		{
			data: userSigninData,
			isLoading: isLoadingUserSignin,
			isSuccess: isSuccessUserSignin,
			isError: isErrorUserSignin,
			error: userSigninError,
		},
	] = useUserSigninMutation()

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
			if (singleTeacherData!.data!.first_name === '') {
				dispatch(openDialog('teacher'))
			} else {
				dispatch(closeDialog())
				router.push('/teacher/classroom/classroom-list')
			}
		}
	}, [singleTeacherData, dispatch, router])

	const { setItem: setEmailForVerification } = useLocalStorage(
		'emailForVerification',
	)
	const { setItem: setforWhatVerification } = useLocalStorage(
		'forWhatVerification',
	)

	const [
		sendOtp,
		{ data: otpData, isError: isErrorOtpSend, isSuccess: isSuccessOtpSend },
	] = useSendOtpMutation()

	const onChangeEmailVerification = (e: any) => {
		const value = e.target.value
		Setemailverfication(value)

		if (!validateEmail(value)) {
			setEmailError('Please enter a valid email address.')
		} else {
			setEmailError('')
		}
	}
	const onSubmitEmailVerification = () => {
		if (emailverfication) {
			sendOtp({ email: emailverfication })
				.unwrap()
				.then((res) => {
					console.log(`response ${JSON.stringify(res)}`)
					setEmailForVerification(emailverfication)
					setforWhatVerification('forgotPassword')
					toast.success('Please check your email for verification.')
					router.push('/auth/verify-email')
				})
				.catch((err: ExtendedError) => {
					console.log(`error ${JSON.stringify(err)}`)
					toast.error('Invalid credentials')
				})
		}
	}

	const onSubmit = (credentials: FormType) => {
		console.log(`credentials ${JSON.stringify(credentials)}`)
		setShowResendOtpLink(false)
		setEmailForResend(credentials.email)

		userSignin(credentials)
			.unwrap()
			.then((res: UserSigninResponse) => {
				setCurrUser(res.data)
				if (res.data?.role === 0) {
					setStudentId(res.data?.id!)
					if (res.data?.student === null) {
						dispatch(openDialog('student'))
					}
				} else if (res.data?.role === 1) {
					setTeacherId(res.data?.id!)
					if (res.data?.teacher === null) {
						dispatch(openDialog('teacher'))
					}
				}
			})
			.catch((err: ExtendedError) => {
				if (err.data?.message?.includes('Account not verified')) {
					toast.error(
						'Your account is not verified. Please check your email for an OTP.',
					)
					setEmailForResend(credentials.email)
					setShowResendOtpLink(true)
				} else {
					toast.error(
						err.data?.message ||
							err.data?.errors?.[0] ||
							'Invalid credentials.',
					)
				}
			})
	}

	const handleResendVerificationOtp = async () => {
        if (!emailForResend) {
            toast.error("Email not available for resending OTP.");
            return;
        }
        try {
            await sendOtp({ email: emailForResend }).unwrap();
            toast.success("A new verification OTP has been sent to your email. Please check and verify.");

            router.push('/auth/verify-email');
        } catch (err) {
            toast.error("Failed to resend OTP. Please try again.");
        }
    };

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
												<Input
													id='email'
													className='col-span-3'
													value={emailverfication}
													onChange={onChangeEmailVerification}
												/>
												{emailError && (
													<p className='text-red-500 text-sm mt-1 col-span-3'>
														{emailError}
													</p>
												)}
											</div>
										</div>
										<DialogFooter>
											<Button
												type='submit'
												onClick={() => onSubmitEmailVerification()}
											>
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
											isLoadingUserSignin,
									})}
									disabled={isLoadingUserSignin }
									type='submit'
								>
									{isLoadingUserSignin  ? (
										<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
									) : null}
									Signin
								</Button>
								{showResendOtpLink && (
                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={handleResendVerificationOtp}
                                        className="text-blue-600 hover:underline self-center p-0 h-auto"
                                    >
                                        Resend Verification OTP
                                    </Button>
                                )}
								<span className='text-primary text-center text-sm'>
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