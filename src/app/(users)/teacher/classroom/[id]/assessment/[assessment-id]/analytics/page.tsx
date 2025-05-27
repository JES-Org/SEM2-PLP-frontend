// @ts-nocheck

'use client'

import React, { useMemo } from 'react'

import { Hash } from 'lucide-react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

import 'react-circular-progressbar/dist/styles.css'

import {
	useAggregateAssessmentAnalyticsQuery,
	useAggregateSingleAssessmentScoreQuery,
	useAssessmentAnalyticsByIdQuery,
} from '@/store/assessment/assessmentApi'
import { useGetClassroomByIdQuery } from '@/store/classroom/classroomApi'
import { useAggregateGetStudentByIdQuery } from '@/store/student/studentApi'
import { usePathname } from 'next/navigation'

import LineChartComponent from '@/components/LineChartComponent'
import ScoreProfile from '@/components/ScoreProfile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const percentage = 66

interface scoreData {
	studentName: string
	result: number
}

export default function Page() {
	const { ref, inView } = useInView({ threshold: 0.5 })

	const currClassroomId = usePathname().split('/').at(-4)
	const assessmentId = usePathname().split('/').at(-2)

	const {
		data: singleAssessmentAnalytics,
		isLoading: isLoadingSingleAssessmentAnaytics,
		isFetching: isFetchingSinlgeAssessmentAnalytics,
		isError: isErrorSingleAssessmentAnalytics,
		error: errorSingleAssessmentAnalytics,
	} = useAssessmentAnalyticsByIdQuery(
		{
			classroomId: currClassroomId!,
			assessmentId: assessmentId!,
		},
		{ skip: assessmentId === '' },
	)

	const { data: classData } = useGetClassroomByIdQuery(currClassroomId)
	const studentIds = classData?.data.members?.map((member) => member.id) || []

	const { data: studentData, isLoading: isLoadingStudentData } =
		useAggregateGetStudentByIdQuery({ studentIds: studentIds })
	console.log('student ids: ', studentData)
	const fullNames =
		studentData?.map(
			(student) => `${student.data?.first_name} ${student.data?.last_name}`,
		) || []
	console.log('fullnames: ', fullNames)

	const studentNameMap = useMemo(() => {
		const map = new Map<string, string>()
		if (studentData) {
			studentData.forEach((response) => {
				const studentDetail = response.data
				if (
					studentDetail?.id &&
					studentDetail.first_name &&
					studentDetail.last_name
				) {
					map.set(
						String(studentDetail.id),
						`${studentDetail.first_name} ${studentDetail.last_name}`,
					)
				} else if (studentDetail?.id) {
					map.set(String(studentDetail.id), `Student ID: ${studentDetail.id}`)
				}
			})
		}
		return map
	}, [studentData])

	const { data: score, isLoading: isLoadingScores } =
		useAggregateSingleAssessmentScoreQuery({
			classroomId: currClassroomId!,
			assessmentId: assessmentId!,
			studentIds,
		})

	const scoreDataList: scoreData[] = useMemo(() => {
		if (!score || !Array.isArray(score)) return []
		return score.map((item: any) => ({
			studentName:
				studentNameMap.get(String(item.data.studentId)) ||
				`Student ID: ${item.data.studentId}`,
			result: item.data.score,
		}))
	}, [score, studentNameMap])

	const topFiveStudents = useMemo(() => {
		if (!scoreDataList || scoreDataList.length === 0) return []
		return [...scoreDataList].sort((a, b) => b.result - a.result).slice(0, 5)
	}, [scoreDataList])

	const bottomFiveStudents = useMemo(() => {
		if (!scoreDataList || scoreDataList.length === 0) return []
		return [...scoreDataList].sort((a, b) => a.result - b.result).slice(0, 5)
	}, [scoreDataList])

	console.log('singleAssessmentAnalytics', singleAssessmentAnalytics)

	return (
		<div>
			<div className='flex md:ml-40 lg:ml-0 lg:w-11/12 xl:w-full text-3xl justify-center'>
				<div className='flex items-center space-x-2 font-bold my-20'>
					<Hash />
					<span>{singleAssessmentAnalytics?.data.title}</span>
				</div>
			</div>
			<div className='mb-6 md:ml-64 md:mr-3'>
				<Card className='py-10  lg:mx-auto'>
					<CardContent>
						<div className='w-full z-50'>
							<LineChartComponent data={scoreDataList} />
						</div>
					</CardContent>
				</Card>
			</div>
			<div className='md:ml-64 md:mr-3'>
				<Card className='mx-auto'>
					<div className='md:flex justify-around space-y-5 md:space-y-0 ml-3 md:ml-0 xl:mr-20 my-7'>
						<div className='flex md:w-4/12 w-9/12 mx-auto flex-col justify-center'>
							<div
								style={{ width: '150px', height: '150px', margin: '0 auto' }}
							>
								<CircularProgressbarWithChildren
									value={singleAssessmentAnalytics?.data.lowestScore || 0}
									maxValue={100}
									styles={{
										root: { width: '100%' },
										path: {
											stroke: `rgba(227, 14, 14, ${percentage / 100})`,
											strokeWidth: 8,
										},
										trail: {
											strokeWidth: 8,
										},
									}}
								>
									<strong
										style={{ fontSize: 18, marginTop: -5, color: '#E30E0E' }}
									>
										Min
									</strong>
									<span
										style={{ fontSize: 42, marginTop: -5, color: '#E30E0E' }}
									>
										{singleAssessmentAnalytics?.data.lowestScore || 0}
									</span>
								</CircularProgressbarWithChildren>
							</div>
						</div>

						<div className='flex md:w-4/12 w-9/12 mx-auto flex-col justify-center'>
							<div
								style={{ width: '150px', height: '150px', margin: '0 auto' }}
							>
								<CircularProgressbarWithChildren
									value={singleAssessmentAnalytics?.data.meanScore || 0}
									maxValue={100}
									styles={{
										root: { width: '100%' },
										path: {
											stroke: `rgba(51, 133, 186, ${percentage / 100})`,
											strokeWidth: 8,
										},
										trail: {
											strokeWidth: 8,
										},
									}}
								>
									<strong
										style={{ fontSize: 18, marginTop: -5, color: '#3385BA' }}
									>
										Avg
									</strong>
									<span
										style={{ fontSize: 42, marginTop: -5, color: '#3385BA' }}
									>
										{singleAssessmentAnalytics?.data.meanScore?.toFixed(2) || 0}
									</span>
								</CircularProgressbarWithChildren>
							</div>
						</div>
					</div>

					<div className='md:flex justify-around space-y-5 md:space-y-0 ml-3 md:ml-0 xl:mr-20 my-7'>
						<div className='flex md:w-4/12 w-9/12 mx-auto flex-col justify-center'>
							<div
								style={{ width: '150px', height: '150px', margin: '0 auto' }}
							>
								<CircularProgressbarWithChildren
									value={singleAssessmentAnalytics?.data.highestScore || 0}
									maxValue={100}
									styles={{
										root: { width: '100%' },
										path: {
											stroke: `rgba(6, 148, 37, ${percentage / 100})`,
											strokeWidth: 8,
										},
										trail: {
											strokeWidth: 8,
										},
									}}
								>
									<strong
										style={{ fontSize: 18, marginTop: -5, color: '#069425' }}
									>
										Max
									</strong>
									<span
										style={{ fontSize: 42, marginTop: -5, color: '#069425' }}
									>
										{singleAssessmentAnalytics?.data.highestScore || 0}
									</span>
								</CircularProgressbarWithChildren>
							</div>
						</div>

						<div className='flex md:w-4/12 w-9/12 mx-auto flex-col justify-center'>
							<div
								style={{ width: '150px', height: '150px', margin: '0 auto' }}
							>
								<CircularProgressbarWithChildren
									value={singleAssessmentAnalytics?.data.modeScore || 0}
									maxValue={100}
									styles={{
										root: { width: '100%' },
										path: {
											stroke: `rgba(0, 0, 0, ${percentage / 100})`,
											strokeWidth: 8,
										},
										trail: {
											strokeWidth: 8,
										},
									}}
								>
									<strong style={{ fontSize: 18, marginTop: -5 }}>Mode</strong>
									<span style={{ fontSize: 42, marginTop: -5 }}>
										{singleAssessmentAnalytics?.data.modeScore || 0}
									</span>
								</CircularProgressbarWithChildren>
							</div>
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
						{inView && (
							<CountUp
								start={0}
								end={singleAssessmentAnalytics?.data.totalSubmissions}
								duration={2}
								delay={0}
							/>
						)}
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
								{isLoadingScores ? (
									<div className='text-center py-4'>
										Loading top performers...
									</div>
								) : topFiveStudents.length > 0 ? (
									topFiveStudents.map((student, index) => (
										<ScoreProfile
											key={index}
											studentName={student.studentName}
											score={student.result}
											rank={index + 1}
										/>
									))
								) : (
									<div className='text-center py-4'>No data available</div>
								)}
							</CardContent>
						</Card>
					</div>
					<div className='xl:w-6/12  md:mr-3'>
						<Card>
							<CardHeader>
								<CardTitle className='text-center'>Bottom Five</CardTitle>
							</CardHeader>
							<CardContent>
								{isLoadingScores ? (
									<div className='text-center py-4'>Loading data...</div>
								) : bottomFiveStudents.length > 0 ? (
									bottomFiveStudents.map((student, index) => (
										<ScoreProfile
											key={index}
											studentName={student.studentName}
											score={student.result}
											rank={index + 1}
										/>
									))
								) : (
									<div className='text-center py-4'>No data available</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
