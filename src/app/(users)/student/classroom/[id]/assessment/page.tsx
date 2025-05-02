'use client'

import { useGetAssessmentsQuery } from '@/store/assessment/assessmentApi'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { useDispatch, useSelector } from 'react-redux'

import Spinner from '@/components/Spinner'
import StudentAssessmentCard from '@/components/StudentAssessmentCard'

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

	return (
		<div className='ml-80 mr-24 mt-10 h-screen'>
			{isLoadingAssessments || isFetchingAssessments ? (
				<div className='flex justify-center items-center'>
					<Spinner />
				</div>
			) : isErrorAssessments || assessments === undefined ? (
				<div className='flex justify-center items-center h-full'>
					<p className='text-red-500'>Failed to load assessments</p>
				</div>
			) : (
				<StudentAssessmentCard assessments={assessments.data} />
			)}
		</div>
	)
}
export default AssessmentPage
