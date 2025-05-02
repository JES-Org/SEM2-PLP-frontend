'use client'

import { useGetAssessmentsQuery } from '@/store/assessment/assessmentApi'
import { openDialog } from '@/store/features/assessmentDialogSlice'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { useDispatch, useSelector } from 'react-redux'

import CreateAssessmentDialog from '@/components/AssessmentCreatingDialog'
import DraftAssessments from '@/components/DraftAssessments'
import PublishedAssessments from '@/components/PublishedAssements'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Spinner from '@/components/Spinner'


const AssessmentPage = () => {
	const dispatch = useDispatch()
	const currClassroomId = useSelector(selectCurrClassroomId)
	const {
		data: assessments,
		isLoading: isLoadingAssessments,
		isFetching: isFetchingAssessments,
		isError: isErrorAssessments,
		error: errorAssessments,
	} = useGetAssessmentsQuery(currClassroomId)

	const draftAssessments = assessments?.data?.filter(
		(assessment) => !assessment.isPublished
	)

	const publishedAssessments = assessments?.data?.filter(
		(assessment) => assessment.isPublished
	)

	return (
		<div className='ml-72 mr-24 mt-10 h-screen'>
			<CreateAssessmentDialog />
			<Tabs defaultValue='draft'>
				<div className='flex flex-row justify-between'>
					<TabsList className='flex self-center gap-4'>
						<TabsTrigger value='draft' className='px-6 py-2 w-32 text-center'>
							Draft
						</TabsTrigger>
						<TabsTrigger value='published' className='px-6 py-2 w-32 text-center'>
							Published
						</TabsTrigger>
					</TabsList>
					<Button onClick={() => dispatch(openDialog('create'))}>
						Create Assessment
					</Button>
				</div>

				{isLoadingAssessments || isFetchingAssessments ? (
					<div className='flex justify-center items-center h-full'>
						<Spinner />
					</div>
				) : isErrorAssessments ? (
					<div className='flex justify-center items-center h-full'>
						<p className='text-red-500'>Failed to load assessments</p>
					</div>
				) : (
					<>
						<TabsContent value='draft'>
							<DraftAssessments assessments={draftAssessments}  />
						</TabsContent>
						<TabsContent value='published'>
							<PublishedAssessments assessments={publishedAssessments} />
						</TabsContent>
					</>
				)}
			</Tabs>
		</div>
	)
}
export default AssessmentPage
