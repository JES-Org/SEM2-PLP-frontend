'use client'

import { useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	useGetQuestionsQuery,
	useSingleAssessmentScoreQuery,
	useSubmitAssessmentMutation,
} from '@/store/assessment/assessmentApi'
import { AssessmentQuestion } from '@/types/assessment/assessment.type'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const TakeAssessment = () => {
	const router = useRouter()
	const currPath = usePathname().split('/')
	const currClassroomId = currPath[3]
	const currAssessmentId = currPath[5]
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const studentId = getCurrUser().student.id
	console.log('studentId', studentId)

	const { data, isLoading, isFetching, isError, error } = useGetQuestionsQuery({
		classroomId: currClassroomId,
		assessmentId: currAssessmentId,
	})

	const { data: score } = useSingleAssessmentScoreQuery({
		classroomId: currClassroomId,
		assessmentId: currAssessmentId,
		studentId: studentId,
	})
	const [submit, {}] = useSubmitAssessmentMutation()

	const fetchedQuestions: AssessmentQuestion[] = data?.data?.questions || []
	const [answers, setAnswers] = useState<string[]>(
		Array(fetchedQuestions.length).fill(''),
	)

	const handleAnswerChange = (questionIndex: number, answerIndex: string) => {
		const updatedAnswers = [...answers]
		updatedAnswers[questionIndex] = answerIndex
		setAnswers(updatedAnswers)
	}

	const handleSubmit = () => {
		console.log(answers)
		console.log('studentId', studentId)
		for (let i = 0; i < answers.length; i++) {
			if (answers[i] === '') {
				toast.error('Please answer question ' + (i + 1))
				return
			}
		}
		submit({
			classroomId: currClassroomId,
			body: {
				assessmentId: currAssessmentId,
				answers: answers,
				studentId: studentId,
			},
		})
			.unwrap()
			.then((res) => {
				if (res.isSuccess) {
					toast.success('Assessment submitted successfully')
					router.back()
				} else {
					console.log(res)
					toast.error('Failed to submit assessment')
				}
			})
			.catch((err) => {
				toast.error('Failed to submit assessment: ' + err.data.errors[0])
			})
	}

	const answeredQuestions = answers.filter(ans => ans !== '').length;
	const totalQuestions = fetchedQuestions.length;
	const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
	const allAnswered = answers.every(ans => ans !== '') && answers.length === fetchedQuestions.length;

	return (
		<div className='ml-72 mr-10 mt-10 h-screen'>
			<div className='flex flex-col h-screen'>
				<div className='w-full p-8 overflow-auto'>
					<div className='mb-6'>
						<div className='flex justify-between mb-1 text-sm font-medium text-gray-700 dark:text-gray-300'>
							<span>Progress</span>
							<span>{answeredQuestions} / {totalQuestions} Answered</span>
						</div>
						<div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
							<div
								className='bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out'
								style={{ width: `${progressPercentage}%` }}
							></div>
						</div>
					</div>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-3xl font-bold'>
							{data?.data?.name}
						</h1>
						<div className='flex items-center justify-center w-20 h-20 rounded-full bg-accent'>
							<span className='text-4xl text-accent-foreground font-bold'>
								{score?.data.score || 0}
							</span>
						</div>
					</div>
					<div className='space-y-8'>
						{fetchedQuestions.map((question, questionIndex) => (
							<>
								<div key={question.id}>
									<p className='mb-4'>
										<span className='font-semibold mr-2'>
											{questionIndex + 1}.
										</span>
										{question.text}
									</p>
									<RadioGroup
										value={String(answers[questionIndex])}
										onValueChange={(value) =>
											handleAnswerChange(questionIndex, value)
										}
									>
										{question.answers.map((answer, answerIndex) => (
											<div
											key={answer.id}
											className={`flex items-center mb-2 p-3 rounded-lg border transition-all duration-150 ease-in-out cursor-pointer ${
												answers[questionIndex] === String(answer.id)
													? 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-700 shadow-md'
													: 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
											}`}
											onClick={() => handleAnswerChange(questionIndex, String(answer.id))} // Allow clicking the whole div
										>
											<RadioGroupItem
												value={String(answer.id)}
												id={`option${answer.id}`}
												className='mr-3' // Increased margin
											/>
											<label
												htmlFor={`option${answer.id}`}
												className='text-gray-700 dark:text-gray-300 flex-1 cursor-pointer' // flex-1 to take available space
											>
												{answer.text}
											</label>
										</div>
										))}
									</RadioGroup>
								</div>
							</>
						))}
						<div className='text-center'>
							<Button size='lg' onClick={handleSubmit} disabled={!allAnswered || isLoading || isFetching}>
								Submit
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TakeAssessment
