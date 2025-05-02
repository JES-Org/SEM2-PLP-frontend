'use client'

import React from 'react'

import { LandingPageItems } from '@/constants/LandingPageItems'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import HomepageCard from '@/components/HomepageCard'
import NavBar from '@/components/NavBar'
import { Button } from '@/components/ui/button'

import landingPage from '../../public/assets/landing-page.svg'

export default function Home() {
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const router = useRouter()

	if (currUser) {
		if (currUser.role == 0) router.push('/student/classroom/classroom-list')
		else if (currUser.role == 1) router.push('/teacher/classroom/classroom-list')
	}
	return (
		<>
			<div className='relative overflow-hidden text-primary h-full'>
				<div className='md:flex block h-screen w-screen md:justify-center justify-between items-center  md:bg-cover md:bg-center md:bg-no-repeat md:bg-[url(../../public/assets/background-home.svg)]'>
					<div className='z-30 h-fill justify-between'>
						<NavBar />

						<div className='md:grid md:grid-cols-12 block gap-4 md:mt-8 mt-20 items-center'>
							<div className='col-span-5 md:ml-20 ml-0 mx-auto'>
								<h1 className='md:text-4xl text-2xl  font-bold mb-5 md:ml-0 ml-4 md:pt-0 pt-9'>
									Discover Your Unique Path to Learning.
								</h1>
								<p className='mt-2 md:text-small mb-10 md:ml-0 mx-4'>
									Unlock Your Potential, With our Personalized Learning
									platform.
								</p>
								<div className='flex md:justify-start justify-center'>
									<Button asChild>
										<Link href='/auth/signup'>Join us</Link>
									</Button>
								</div>
							</div>
							<div className='col-span-7 md:flex md:justify-end md:mt-5 mt-20'>
								<div className='flex justify-center md:justify-end'>
									<div className='max-w-screen-md'>
										<Image
											src={landingPage}
											alt='discovery'
											width={1000}
											height={600}
											className='md:object-cover object-cover'
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<section className='bg-gray-900 text-white'>
				<div className='mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16'>
					<div className='mx-auto max-w-lg text-center'>
						<h2 className='text-3xl font-bold sm:text-4xl'>Our Service</h2>

						<p className='mt-4 text-gray-300'>
							Our innovative platform is designed to revolutionize the
							traditional education system, making learning more personalized,
							inclusive, and effective.
						</p>
					</div>

					<div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
						{LandingPageItems.map((item) => (
							<HomepageCard
								key={item.title}
								title={item.title}
								description={item.description}
								icon={item.icon}
							/>
						))}
					</div>

					<div className='mt-12 text-center'>
						<Link
							href='/auth/signup'
							className='inline-block rounded bg-blue-500 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring'
						>
							Get Started Today
						</Link>
					</div>
				</div>
			</section>
		</>
	)
}
