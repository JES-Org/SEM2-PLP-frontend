'use client'

import React from 'react'

import { Hash } from 'lucide-react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

import 'react-circular-progressbar/dist/styles.css'

import LineChartComponent from '@/components/LineChartComponent'
import ScoreProfile from '@/components/ScoreProfile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const percentage = 66

export default function Page() {
	const { ref, inView } = useInView({ threshold: 0.5 })
	return (
		<div>
			<div className='flex md:ml-40 lg:ml-0 lg:w-11/12 xl:w-full text-3xl justify-center'>
				<div className='flex items-center space-x-2 font-bold my-20'>
					<Hash />
					<span>Stack and Queue</span>
				</div>
			</div>
			<div className='mb-6 md:ml-64 md:mr-3'>
				<Card className='py-10  lg:mx-auto'>
					<CardContent>
						<div className='w-full z-50'>
							<LineChartComponent />
						</div>
					</CardContent>
				</Card>
			</div>
			<div className='md:ml-64 md:mr-3'>
				<Card className='mx-auto'>
					<div className='md:flex  justify-around space-y-5 md:space-y-0  ml-3 md:ml-0 xl:mr-20 my-7'>
						<div className='flex md:w-5/12 w-11/12  flex-col justify-center'>
							<CircularProgressbarWithChildren
								value={25}
								styles={{
									root: {},
									path: {
										stroke: `rgba(227, 14, 14, ${percentage / 100})`,
									},
								}}
							>
								<strong
									style={{ fontSize: 25, marginTop: -5, color: '#E30E0E' }}
								>
									Min
								</strong>{' '}
								<br />
								<span style={{ fontSize: 60, marginTop: -5, color: '#E30E0E' }}>
									22
								</span>
							</CircularProgressbarWithChildren>
						</div>
						<div className='flex  md:w-5/12 w-11/12 flex-col justify-center'>
							<CircularProgressbarWithChildren
								value={50}
								styles={{
									root: {},
									path: {
										stroke: `${percentage / 100}`,
									},
								}}
							>
								<strong
									style={{ fontSize: 25, marginTop: -5, color: '#3385BA' }}
								>
									Avg
								</strong>{' '}
								<br />
								<span style={{ fontSize: 60, marginTop: -5, color: '#3385BA' }}>
									50
								</span>
							</CircularProgressbarWithChildren>
						</div>
					</div>
					<div className='md:flex space-y-5 md:space-y-0  justify-around md:ml-0 ml-3 xl:mr-20 my-7'>
						<div className='flex  md:w-5/12 w-11/12 flex-col justify-center'>
							<CircularProgressbarWithChildren
								value={92}
								styles={{
									root: {},
									path: {
										stroke: `rgba(6, 148, 37, ${percentage / 100})`,
									},
								}}
							>
								<strong
									style={{ fontSize: 25, marginTop: -5, color: '#069425' }}
								>
									Max
								</strong>{' '}
								<br />
								<span style={{ fontSize: 60, marginTop: -5, color: '#069425' }}>
									92
								</span>
							</CircularProgressbarWithChildren>
						</div>
						<div className='flex  md:w-5/12 w-11/12 flex-col justify-center'>
							<CircularProgressbarWithChildren
								value={50}
								styles={{
									root: {},
									path: {
										stroke: `rgba(0, 0, 0, ${percentage / 100})`,
									},
								}}
							>
								<strong style={{ fontSize: 25, marginTop: -5 }}>Mode</strong>{' '}
								<br />
								<span style={{ fontSize: 60, marginTop: -5 }}>50</span>
							</CircularProgressbarWithChildren>
						</div>
					</div>
				</Card>
			</div>
			<div className='md:ml-64 md:mr-3'>
				<Card className='mx-auto my-6 p-10'>
					<div className='xl:text-3xl text-xl font-bold mb-6 flex justify-center'>
						Number of Students attended
					</div>
					<div className='flex justify-center text-4xl' ref={ref}>
						{inView && <CountUp start={0} end={100} duration={2} delay={0} />}
					</div>
				</Card>
			</div>

			<div className='xl:flex justify-center md:ml-64'>
				<div className='xl:flex block w-full'>
					<div className='xl:w-6/12 2xl:mr-3  md:mr-3 xl:mr-1 mb-6'>
						<Card>
							<CardHeader>
								<CardTitle className='text-center'>Top Five</CardTitle>
							</CardHeader>
							<CardContent>
								{[0, 1, 2, 3, 5].map((index: number) => (
									<ScoreProfile key={index} />
								))}
							</CardContent>
						</Card>
					</div>
					<div className='xl:w-6/12  md:mr-3'>
						<Card>
							<CardHeader>
								<CardTitle className='text-center'>Bottom Five</CardTitle>
							</CardHeader>
							<CardContent>
								{[0, 1, 2, 3, 5].map((index: number) => (
									<ScoreProfile key={index} />
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
