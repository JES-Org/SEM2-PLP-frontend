// @ts-nocheck

'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'; // Import Link for navigation
import { Eye } from 'lucide-react';

import {
	useAggregateAssessmentAnalyticsQuery,
	useAggregateSingleAssessmentScoreQuery,
	useAssessmentAnalyticsByIdQuery,
	useCrossAssessmentAnalyticsQuery,
	useGetAssessmentsQuery,
	useGetQuestionsQuery,
} from '@/store/assessment/assessmentApi'
import { ChevronDown, ChevronUp, CheckCheck } from 'lucide-react'
import { AssessmentQuestion } from '@/types/assessment/assessment.type';
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Rectangle,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useGetClassroomByIdQuery } from '@/store/classroom/classroomApi'
import { toMonthAndDay } from '@/lib/helpers'
import { useAggregateGetStudentByIdQuery } from '@/store/student/studentApi'

const roster = [
	{
		fullName: 'John Doe',
		submissionDate: '2021-10-01',
		score: 85,
	},
	{
		fullName: 'Jane Smith',
		submissionDate: '2021-10-02',
		score: 92,
	},
	{
		fullName: 'Mike Johnson',
		submissionDate: '2021-10-03',
		score: 78,
	},
	{
		fullName: 'Sarah Williams',
		submissionDate: '2021-10-04',
		score: 90,
	},
	{
		fullName: 'David Brown',
		submissionDate: '2021-10-05',
		score: 88,
	},
	{
		fullName: 'Emily Davis',
		submissionDate: '2021-10-06',
		score: 95,
	},
	{
		fullName: 'Michael Wilson',
		submissionDate: '2021-10-07',
		score: 82,
	},
];

const metrics: string[] = [
	'Mean Score',
	'Median Score',
	'Mode Score',
	'Standard Deviation',
	'Variance',
	'Highest Score',
	'Lowest Score',
	'Range',
	'Interquartile Range',
	'Skewness',
	'Kurtosis',
	'Coefficient Of Variation',
	'Mean Absolute Deviation',
	'Median Absolute Deviation',
	'Mode Absolute Deviation',
]

const getMetricKey = (metric: string) => {
	const metricMap = {
		'Mean Score': 'meanScore',
		'Median Score': 'medianScore',
		'Mode Score': 'modeScore',
		'Standard Deviation': 'standardDeviation',
		Variance: 'variance',
		'Highest Score': 'highestScore',
		'Lowest Score': 'lowestScore',
		Range: 'range',
		'Interquartile Range': 'interquartileRange',
		Skewness: 'skewness',
		Kurtosis: 'kurtosis',
		'Coefficient Of Variation': 'coefficientOfVariation',
		'Mean Absolute Deviation': 'meanAbsoluteDeviation',
		'Median Absolute Deviation': 'medianAbsoluteDeviation',
		'Mode Absolute Deviation': 'modeAbsoluteDeviation',
	}
	return metricMap[metric as keyof typeof metricMap]
}

const chapters: string[] = Array.from(
	{ length: 10 },
	(_, i) => `Chapter ${i + 1}`,
)

const AnalyticsPage = () => {
	const currClassroomId = usePathname().split('/').at(-2)
	console.log('CLASSROOM ID', currClassroomId)
	const {
		data: fetchedAssessments,
		isLoading: isLoadingFetchedAssessments,
		isError: isErrorFetchedAssessments,
		error: errorFetchedAssessments,
		isFetching: isFetchingFetchedAssesments,
	} = useGetAssessmentsQuery(currClassroomId)

	// const {
	// 	data: crossAssessmentAnalytics,
	// 	isLoading: isLoadingCrossAssessmentAnaytics,
	// 	isFetching: isFetchingCrossAssessmentAnalytics,
	// 	isError: isErrorCrossAssessmentAnalytics,
	// 	error: errorCrossAssessmentAnalytics,
	// } = useCrossAssessmentAnalyticsQuery(currClassroomId!)

	const assessments =
		fetchedAssessments?.data
			?.filter((assessment) => assessment.is_published)
			.map((assessment) => ({
				id: assessment.id,
				name: assessment.name,
			})) || []

	const [selectedMetric, setSelectedMetric] = useState({
		label: 'Mean Score',
		isOpen: false,
	})
	const [selectedChapter, setSelectedChapter] = useState({
		label: 'Chapter 1',
		isOpen: false,
	})

	const {
		data: aggregateData,
		isLoading: isLoadingAggregate,
		isFetching: isFethingAggregate,
		isError: isErrorAggregate,
		isSuccess: isSuccessAggregate,
		error: errorAggregate,
	} = useAggregateAssessmentAnalyticsQuery(
		currClassroomId)

	// console.debug('ASSESSMENTS', JSON.stringify(assessments, null, 2))
	// console.debug('ANALYSIS', JSON.stringify(aggregateData, null, 2))

const graphData = assessments.map((assessment) => {
	const metricKey = getMetricKey(selectedMetric.label)
	const assessmentId = assessment.id
	return {
		name: assessment.name,
		value: aggregateData?.data?.[assessmentId]?.data?.[metricKey] ?? 0,
	}
})


	

	console.log('GRAPH DATA', graphData)
	console.log('GRAPH aggregateData DATA', aggregateData)


	// console.debug(assessments)
	const [selectedAssessment, setSelectedAssessment] = useState({
		label: assessments.length > 0 ? assessments[0].name : 'No assessments',
		id: assessments.length > 0 ? assessments[0].id : '',
		isOpen: false,
	})

	// console.debug(selectedAssessment.id)

	const {
		data: singleAssessmentAnalytics,
		isLoading: isLoadingSingleAssessmentAnaytics,
		isFetching: isFetchingSinlgeAssessmentAnalytics,
		isError: isErrorSingleAssessmentAnalytics,
		error: errorSingleAssessmentAnalytics,
	} = useAssessmentAnalyticsByIdQuery(
		{
			classroomId: currClassroomId!,
			assessmentId: selectedAssessment.id,
		},
		{ skip: selectedAssessment.id === '' },
	)

	// console.debug(singleAssessmentAnalytics)

	const {data: classData} = useGetClassroomByIdQuery(currClassroomId)
	const studentIds = classData?.data.members?.map((member) => member.id) || []

	const {data: studentData, isLoading: isLoadingStudentData } = useAggregateGetStudentByIdQuery({studentIds: studentIds})
	console.log("student ids: ", studentData)
	const fullNames = studentData?.map((student) => `${student.data?.first_name} ${student.data?.last_name}` ) || []
	console.log("fullnames: ", fullNames)

	const studentNameMap = useMemo(() => {
		const map = new Map<string, string>();
		if (studentData) {
			studentData.forEach(response => { 
				const studentDetail = response.data; 
				if (studentDetail?.id && studentDetail.first_name && studentDetail.last_name) {
					map.set(String(studentDetail.id), `${studentDetail.first_name} ${studentDetail.last_name}`);
				} else if (studentDetail?.id) {
					map.set(String(studentDetail.id), `Student ID: ${studentDetail.id}`);
				}
			});
		}
		return map;
	}, [studentData]);

	const { data: score, isLoading: isLoadingScores } = useAggregateSingleAssessmentScoreQuery({
		classroomId: currClassroomId!,
		assessmentId: selectedAssessment.id,
		studentIds,
	})

	const { data: selectedAssessmentQuestionsData, isLoading: isLoadingSelectedAssessmentQuestions } = useGetQuestionsQuery(
		{
			classroomId: currClassroomId!,
			assessmentId: selectedAssessment.id,
		},
		{ skip: !selectedAssessment.id || !currClassroomId }
	);
	const questionsForSelectedAssessment: AssessmentQuestion[] = selectedAssessmentQuestionsData?.data?.questions || [];

	const handleMetricChange = (selectedLabel: string) => {
		setSelectedMetric({ label: selectedLabel, isOpen: false })
	}

	const handleChapterhange = (selectedLabel: string) => {
		setSelectedChapter({ label: selectedLabel, isOpen: false })
	}

	const handleAssessmentChange = (selectedLabel: string) => {
		setSelectedAssessment({
			label: selectedLabel,
			isOpen: false,
			id: assessments.find((assessment) => assessment.name === selectedLabel)
				?.id!,
		})
	}

	useEffect(() => {
		if (assessments.length > 0 && !selectedAssessment.id) {
			setSelectedAssessment(prev => ({
				...prev,
				label: assessments[0].name,
				id: assessments[0].id,
			}));
		}
	}, [assessments, selectedAssessment.id]);

	return (
		<div className='md:ml-72 mr-10 mt-10 h-screen'>
			<div className='flex flex-row justify-between'>
				<DropdownMenu
					open={selectedMetric.isOpen}
					onOpenChange={(isOpen) =>
						setSelectedMetric({ ...selectedMetric, isOpen })
					}
				>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' size='lg' className='mb-10 ml-16'>
							{selectedMetric.label}
							{selectedMetric.isOpen ? (
								<ChevronUp className='ml-6 h-4 w-4' />
							) : (
								<ChevronDown className='ml-6 h-4 w-4' />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Analytic metrics</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={selectedMetric.label}
							onValueChange={(value) => handleMetricChange(value)}
						>
							<div className='w-56 max-h-60 overflow-auto'>
								{metrics.map((metric) => (
									<DropdownMenuRadioItem key={metric} value={metric}>
										{metric}
									</DropdownMenuRadioItem>
								))}
							</div>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Chapter dropdown */}
				<DropdownMenu
					open={selectedChapter.isOpen}
					onOpenChange={(isOpen) =>
						setSelectedChapter({ ...selectedChapter, isOpen })
					}
				>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' size='lg' className='mb-10 mr-8'>
							{selectedChapter.label}
							{selectedChapter.isOpen ? (
								<ChevronUp className='ml-6 h-4 w-4' />
							) : (
								<ChevronDown className='ml-6 h-4 w-4' />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Analyze chapter</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={selectedChapter.label}
							onValueChange={(value) => handleChapterhange(value)}
						>
							<div className='w-56 max-h-60 overflow-auto'>
								{chapters.map((chapter) => (
									<DropdownMenuRadioItem key={chapter} value={chapter}>
										{chapter}
									</DropdownMenuRadioItem>
								))}
							</div>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Graph */}
			<ResponsiveContainer width='100%' height={300}>
				<BarChart
					width={400}
					height={300}
					data={graphData}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='name' />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar
						dataKey='value'
						fill='#0F172A'
						activeBar={<Rectangle fill='#0F172A' />}
					/>
				</BarChart>
			</ResponsiveContainer>

			{/* Assessment Dropdown */}
			<DropdownMenu
				open={selectedAssessment.isOpen}
				onOpenChange={(isOpen) =>
					setSelectedAssessment({ ...selectedAssessment, isOpen })
				}
			>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' size='lg'>
						{selectedAssessment.label}
						{selectedAssessment.isOpen ? (
							<ChevronUp className='ml-6 h-4 w-4' />
						) : (
							<ChevronDown className='ml-6 h-4 w-4' />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Analyze assessment</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuRadioGroup
						value={selectedAssessment.label}
						onValueChange={(value) => handleAssessmentChange(value)}
					>
						<div className='w-56 max-h-60 overflow-auto'>
							{assessments?.map((assessment) => (
								<DropdownMenuRadioItem
									key={assessment.id}
									value={assessment.name}
								>
									{assessment.name}
								</DropdownMenuRadioItem>
							))}
						</div>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Metrics cards */}
			<div className='grid md:grid-cols-3 gap-6 mt-10'>
				<Card className='flex flex-col justify-center items-center'>
					<CardContent className='flex flex-col items-center justify-center gap-2 mt-4'>
						<div className='flex items-center justify-center w-20 h-20 rounded-full bg-accent'>
							<span className='text-4xl text-accent-foreground font-bold'>
								{singleAssessmentAnalytics?.data?.meanScore !== undefined
									? Number(singleAssessmentAnalytics.data.meanScore).toFixed(2)
									: 'N/A'}
							</span>
						</div>
						<div className='text-primary'>Mean Grade</div>
					</CardContent>
				</Card>
				<Card className='flex flex-col justify-center items-center'>
					<CardContent className='flex flex-col items-center justify-center gap-2 mt-4'>
						<div className='flex items-center justify-center w-20 h-20 rounded-full bg-accent'>
							<span className='text-4xl text-accent-foreground font-bold'>
								{singleAssessmentAnalytics?.data?.medianScore !== undefined
									? Number(singleAssessmentAnalytics.data.medianScore).toFixed(2)
									: 'N/A'}
							</span>
						</div>
						<div className='text-primary'>Median Grade</div>
					</CardContent>
				</Card>
				<Card className='flex flex-col justify-center items-center'>
					<CardContent className='flex flex-col items-center justify-center gap-2 mt-4'>
						<div className='flex items-center justify-center w-20 h-20 rounded-full bg-accent'>
							<span className='text-4xl text-accent-foreground font-bold'>
								{singleAssessmentAnalytics?.data?.totalSubmissions !== undefined
									? singleAssessmentAnalytics.data.totalSubmissions
									: 'N/A'}
							</span>
						</div>
						<div className='text-primary'>Total Submissions</div>
					</CardContent>
				</Card>
			</div>

			<Table className='my-4'>
				<TableHeader>
					<TableRow className='text-'>
						<TableHead className='text-lg'>Name</TableHead>
						<TableHead className='text-lg'>Submission Date</TableHead>
						<TableHead className='text-right text-lg'>Score</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{/* Add loading/empty states for the table */}
					{isLoadingScores && (
						<TableRow>
							<TableCell colSpan={3} className="text-center">Loading scores...</TableCell>
						</TableRow>
					)}
					{!isLoadingScores && (!score || score.length === 0) && (
						<TableRow>
							<TableCell colSpan={3} className="text-center">No submissions found for this assessment.</TableCell>
						</TableRow>
					)}
					{score?.map((record) => {
						const studentName = studentNameMap.get(String(record.data.studentId)) || `Student ID: ${record.data.studentId}`; // Fallback
						const reviewUrl = `/teacher/classroom/${currClassroomId}/assessment/${selectedAssessment.id}/submission/${record.data.id}/review/${record.data.studentId}`;

						let allShortAnswersGraded = true;
						let hasShortAnswers = false;

						if (questionsForSelectedAssessment.length > 0) {
							for (const question of questionsForSelectedAssessment) {
								if (question.question_type === 'short_answer') {
									hasShortAnswers = true;
									if (record.data.graded_details?.[question.id] === undefined || record.data.graded_details?.[question.id] === null) {
										allShortAnswersGraded = false;
										break;
									}
								}
							}
						} else {
							allShortAnswersGraded = false;
						}

						if (questionsForSelectedAssessment.length > 0 && !hasShortAnswers) {
							allShortAnswersGraded = true;
						}
						
						return (
							<TableRow key={record.data.id} className='text-lg'>
								<TableCell>{studentName}</TableCell>
								<TableCell>{toMonthAndDay(record.data.updatedAt)}</TableCell>
								<TableCell className='text-right'>
									{record.data.score}
								</TableCell>
								<TableCell className='text-center'>
									{allShortAnswersGraded ? (
										<Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 cursor-default" asChild>
											<Link href={reviewUrl} passHref>
												<CheckCheck className="mr-2 h-4 w-4" /> Reviewed
											</Link>
										</Button>
									) : (
										<Link href={reviewUrl} passHref>
											<Button variant="outline" size="sm">
												<Eye className="mr-2 h-4 w-4" /> Review
											</Button>
										</Link>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	)
}
export default AnalyticsPage
