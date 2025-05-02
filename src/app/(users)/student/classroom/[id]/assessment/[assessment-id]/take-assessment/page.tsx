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
	const studentId = getCurrUser().id

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
					toast.error('Failed to submit assessment')
				}
			})
			.catch((err) => {
				toast.error('Failed to submit assessment')
			})
	}

	return (
		<div className='ml-72 mr-10 mt-10 h-screen'>
			<div className='flex flex-col h-screen'>
				<div className='w-full p-8 overflow-auto'>
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
											<div key={answer.id} className='flex items-center mb-2'>
												<RadioGroupItem
													value={answer.id}
													id={`option${answer.id}`}
													className='mr-2'
												/>
												<label
													htmlFor={`option${answer.id}`}
													className='text-gray-700 dark:text-gray-300'
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
							<Button size='lg' onClick={handleSubmit}>
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
