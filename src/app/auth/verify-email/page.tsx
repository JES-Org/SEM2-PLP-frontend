'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSendOtpMutation, useVerifyOtpMutation } from '@/store/otp/otpApi'
import { ReloadIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

const VerifyEmailPage = () => {
	const router = useRouter()
	const { getItem: getEmailForVerification } = useLocalStorage(
		'emailForVerification',
	)
	const { getItem: getIdForVerification } = useLocalStorage('idForVerification')
	const { getItem: getRoleForVerification } = useLocalStorage(
		'roleForVerification',
	)

	const [
		sendOtp,
		{
			data: otpSendData,
			isLoading: isLoadingOtpSend,
			isError: isErrorOtpSend,
			error: otpSendError,
		},
	] = useSendOtpMutation()
	const [
		verifyOtp,
		{
			data: otpVerifyData,
			isLoading: isLoadingOtpVerify,
			isError: isErrorOtpVerify,
			error: otpVerifyError,
		},
	] = useVerifyOtpMutation()

	const email = getEmailForVerification()
	const userId = getIdForVerification()
	const role = getRoleForVerification()

	const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const inputRefs = Array(6)
		.fill(0)
		// eslint-disable-next-line react-hooks/rules-of-hooks
		.map((_, i) => useRef<HTMLInputElement>(null))

	const handleSendOtp = async (e: any) => {
		e.preventDefault()
		if (email !== undefined && userId !== undefined && role !== undefined) {
			console.log(`Things for OTP Send: ${email}, ${userId}, ${role}`)
			toast.info('Resending OTP')
			sendOtp({ email, userId, role })
				.unwrap()
				.then((res) => {
					console.log('OTP Send Response: ', JSON.stringify(res))
					setTimeout(() => {}, 2000)
					if (isErrorOtpSend) {
						toast.error('Failed to send OTP')
					} else {
						toast.success('OTP sent successfully')
					}
				})
				.catch((err) => {
					console.error('OTP Send Error: ', err)
				})
		}
	}

	const handleChange = (
		index: number,
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const value = event.target.value
		if (isNaN(Number(value))) return
		const newOTP = [...otp]
		newOTP[index] = value
		setOtp(newOTP)

		if (value !== '' && index < inputRefs.length - 1) {
			inputRefs[index + 1].current!.focus()
		}
	}

	const handleKeyDown = (index: number, event: any) => {
		if (event.key === 'Backspace' && otp[index] === '' && index > 0) {
			inputRefs[index - 1].current!.focus()
		}
	}

	const handleSubmit = async () => {
		console.log('OTP: ', otp.join(''))
		const otpValue = otp.join('')
		verifyOtp({ otp: otpValue, userId, role })
			.unwrap()
			.then((res) => {
				console.log('OTP Verify Response: ', JSON.stringify(res))
				toast.success('OTP Verified Successfully')
				router.push('/auth/signin')
			})
			.catch((err) => {
				console.error('OTP Verification Error: ', err)
				toast.error('OTP Verification Failed. Please try again.')
			})
	}

	return (
		<main className='flex h-screen w-screen justify-center items-center bg-[url(/signup-bg.jpg)]'>
			<div className='flex h-[80vh] w-[80vw]'>
				<section className='flex flex-col items-center justify-evenly rounded-l-2xl lg:w-1/2 w-full bg-slate-50'>
					<h2 className='mb-6 text-primary text-center text-xl font-bold'>
						OTP Verification
					</h2>
					<div className='w-11/12 md:w-4/5 flex flex-col gap-24 items-center'>
						<div>
							{otp.map((digit, index) => (
								<input
									key={index}
									ref={inputRefs[index]}
									type='text'
									value={digit}
									maxLength={1}
									className='text-text_primary font-semibold rounded-md w-9 md:w-12 bg-input text-center md:px-4 py-2 mx-1 md:mx-3 outline-none focus:border-2 focus:border-primary'
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										handleChange(index, e)
									}
									onKeyDown={(e: any) => handleKeyDown(index, e)}
								/>
							))}
						</div>
						<div className='flex flex-col gap-y-4 w-full'>
							<Button
								className={cn('w-full', {
									'bg-primary/90': isLoadingOtpVerify,
								})}
								disabled={isLoadingOtpVerify}
								onClick={() => handleSubmit()}
							>
								{isLoadingOtpVerify ? (
									<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
								) : null}
								Verify
							</Button>
							<span className='md:hidden text-primary text-center text-sm'>
								Didn't get the code ?
								<Button
									variant='link'
									className='text-primary font-normal text-sm underline'
									onClick={(e) => handleSendOtp(e)}
								>
									Resend
								</Button>
							</span>
						</div>
					</div>
				</section>

				<section className='hidden lg:flex lg:flex-col lg:justify-center lg:items-center gap-8 rounded-r-2xl w-1/2 bg-zinc-800'>
					<h1 className='text-white text-3xl font-extrabold'>
						Verify Your Email
					</h1>
					<Image
						src='/otp-post.svg'
						width={300}
						height={300}
						alt='Signup Illustration'
					/>
					<span className='text-primary-foreground'>
						Didn't get the code ?
						<Button
							variant='link'
							className='text-primary-foreground text-md font-normal'
							onClick={(e) => handleSendOtp(e)}
						>
							Resend
						</Button>
					</span>
				</section>
			</div>
		</main>
	)
}
export default VerifyEmailPage
