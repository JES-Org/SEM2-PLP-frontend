'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	useGetQuestionsQuery,
	useSingleAssessmentScoreQuery,
	useSubmitAssessmentMutation,
} from '@/store/assessment/assessmentApi'
import { AssessmentQuestion } from '@/types/assessment/assessment.type'
import { CheckCircle, XCircle } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Spinner from '@/components/Spinner'

interface ScoreDataWithAnswers {
    id: string;
    score: number;
    submittedAnswers?: string[];
}

const TakeAssessment = () => {
	const router = useRouter()
	const currPath = usePathname().split('/')
	const currClassroomId = currPath[3]
	const currAssessmentId = currPath[5]
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const studentId = getCurrUser().student.id

	const {
		data: assessmentData,
		isLoading,
		isFetching,
		isError,
		error,
	} = useGetQuestionsQuery({
		classroomId: currClassroomId,
		assessmentId: currAssessmentId,
	})

	const { data: scoreQueryData, refetch: refetchScore } =
		useSingleAssessmentScoreQuery({
			classroomId: currClassroomId,
			assessmentId: currAssessmentId,
			studentId: studentId,
		})
	const [submitMutation, { isLoading: isSubmitting }] = useSubmitAssessmentMutation()

	const fetchedQuestions: AssessmentQuestion[] =
		assessmentData?.data?.questions || []
	const [answers, setAnswers] = useState<string[]>([])
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [isReviewMode, setIsReviewMode] = useState(false)

	useEffect(() => {
		const submissionDetails = scoreQueryData?.data as {
			id: string;
			score: number;
			answers: Record<string, string>;
		} | undefined;

		if (submissionDetails?.id) {
			setHasSubmitted(true);
			setIsReviewMode(true);

			if (submissionDetails.answers && fetchedQuestions.length > 0) {
				const studentSelectedAnswers = fetchedQuestions.map(
					(question) => submissionDetails.answers[question.id] || ''
				);
				setAnswers(studentSelectedAnswers);
			} else if (fetchedQuestions.length > 0) {
				setAnswers(Array(fetchedQuestions.length).fill(''));
			}
		} else if (fetchedQuestions.length > 0) {
			setAnswers(Array(fetchedQuestions.length).fill(''));
			setHasSubmitted(false);
			setIsReviewMode(false);
		}
	}, [scoreQueryData, fetchedQuestions]);
	


	const handleAnswerChange = (questionIndex: number, answerId: string) => {
		if (isReviewMode || hasSubmitted) return

		const updatedAnswers = [...answers]
		updatedAnswers[questionIndex] = answerId
		setAnswers(updatedAnswers)
	}

	const handleSubmit = async () => {
		if (hasSubmitted) {
			setIsReviewMode(true);
			toast.info('You have already submitted this assessment. Viewing results.');
			return;
		}

		for (let i = 0; i < answers.length; i++) {
			if (answers[i] === '') {
				toast.error(`Please answer question ${i + 1}`)
				return
			}
		}

		try {
			const res = await submitMutation({
				classroomId: currClassroomId,
				body: {
					assessmentId: currAssessmentId,
					answers: answers,
					studentId: studentId,
				},
			}).unwrap()

			if (res.isSuccess) {
				toast.success('Assessment submitted successfully')
				setHasSubmitted(true)
				setIsReviewMode(true)
				refetchScore()
			} else {
				toast.error(res.message || 'Failed to submit assessment')
			}
		} catch (err: any) {
			toast.error(
				err?.data?.errors?.[0] || err?.data?.message || err?.message || 'Failed to submit assessment',
			)
		}
	}

	if (isLoading || isFetching || (!assessmentData && !isError) ) {
		return (
			<div className='ml-72 mr-10 mt-10 h-screen flex justify-center items-center'>
				<Spinner />
			</div>
		)
	}

	if (isError || !assessmentData?.data) {
		return (
			<div className='ml-72 mr-10 mt-10 h-screen flex justify-center items-center'>
				<p className='text-xl text-red-500'>
					Error loading assessment: {JSON.stringify(error) || 'Assessment data not found.'}
				</p>
			</div>
		)
	}

	const allQuestionsAnsweredForSubmission = answers.length === fetchedQuestions.length && answers.every(ans => ans !== '');
    const currentDisplayScore = (scoreQueryData?.data as ScoreDataWithAnswers | undefined)?.score;

	return (
		<div className='ml-72 mr-10 mt-10 pb-20'>
			<div className='flex flex-col'>
				<div className='w-full p-8 overflow-auto'>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-3xl font-bold'>
							{assessmentData?.data?.name}
						</h1>
						<div className='flex flex-col items-center'>
							<span className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                {hasSubmitted ? "Your Score" : "Score"}
                            </span>
							<div className='flex items-center justify-center w-20 h-20 rounded-full bg-accent'>
								<span className='text-4xl text-accent-foreground font-bold'>
									{hasSubmitted && currentDisplayScore !== undefined ? currentDisplayScore : '-'}
								</span>
							</div>
						</div>
					</div>

					{ !isReviewMode && !hasSubmitted && fetchedQuestions.length > 0 && (
                        <div className='mb-8'>
							<div className='flex justify-between mb-1 text-sm font-medium text-gray-700 dark:text-gray-300'>
								<span>Progress</span>
								<span>{answers.filter(a => a !== '').length} / {fetchedQuestions.length} Answered</span>
							</div>
							<div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
								<div
									className='bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out'
									style={{ width: `${(answers.filter(a => a !== '').length / fetchedQuestions.length) * 100}%` }}
								></div>
							</div>
						</div>
					)}
                    {isReviewMode && (
                        <div className="mb-6 p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-center">
                            You are in review mode. Your previous answers are shown.
                        </div>
                    )}


					<div className='space-y-8'>
						{fetchedQuestions.map((question, questionIndex) => {
                            const studentAnswerId = answers.length > questionIndex ? answers[questionIndex] : undefined;

							return (
								<div key={question.id} id={`question-wrapper-${questionIndex}`}>
									<p className='mb-4 text-lg'>
										<span className='font-semibold mr-2'>
											{questionIndex + 1}.
										</span>
										{question.text}
									</p>
									<RadioGroup
                                        value={studentAnswerId || ''}
										onValueChange={(value) =>
											handleAnswerChange(questionIndex, value)
										}
										disabled={isReviewMode || hasSubmitted}
									>
										{question.answers.map((answerOption: AssessmentQuestion['answers'][number]) => {
											let optionStyle = 'bg-gray-50 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700';
											let feedbackIcon = null;
											
											if (isReviewMode && studentAnswerId !== undefined) {
												const isSelectedByStudent = String(answerOption.id) === studentAnswerId;
												const isCorrectOption = answerOption.is_correct;
											
												if (isSelectedByStudent) {
													if (isCorrectOption) {
														optionStyle = 'bg-green-200 border-green-600 ring-2 ring-green-500 dark:bg-green-800 dark:border-green-600';
														feedbackIcon = <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 ml-auto" />;
													} else {
														optionStyle = 'bg-red-200 border-red-600 ring-2 ring-red-500 dark:bg-red-800 dark:border-red-600';
														feedbackIcon = <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 ml-auto" />;
													}
												} else if (isCorrectOption) {
													optionStyle = 'bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-700';
													feedbackIcon = <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 ml-auto" />;
												}
											} else if (studentAnswerId === String(answerOption.id)) {
												optionStyle = 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-700 shadow-md';
											}

											return (
												<div
													key={answerOption.id}
													className={`flex items-center mb-2 p-3 rounded-lg border transition-all duration-150 ease-in-out ${
														!(isReviewMode || hasSubmitted) ? 'cursor-pointer' : 'cursor-default'
													} ${optionStyle}`}
													onClick={() => {
														if (!(isReviewMode || hasSubmitted)) {
															handleAnswerChange(questionIndex, String(answerOption.id))
														}
													}}
												>
													<RadioGroupItem
														value={String(answerOption.id)}
														id={`option-${question.id}-${answerOption.id}`}
														className='mr-3'
														disabled={isReviewMode || hasSubmitted}
													/>
													<label
														htmlFor={`option-${question.id}-${answerOption.id}`}
														className={`flex-1 ${
															!(isReviewMode || hasSubmitted) ? 'cursor-pointer' : 'cursor-default'
														} text-gray-700 dark:text-gray-300`}
													>
														{answerOption.text}
													</label>
													{isReviewMode && studentAnswerId !== undefined && feedbackIcon}
												</div>
											)
										})}
									</RadioGroup>
								</div>
							)
						})}
						<div className='text-center pt-6'>
							{hasSubmitted ? (
								<Button size='lg' onClick={() => router.back()}>
									Back to Assessments
								</Button>
							) : (
								<Button
									size='lg'
									onClick={handleSubmit}
									disabled={!allQuestionsAnsweredForSubmission || isSubmitting || isLoading}
								>
									{isSubmitting ? 'Submitting...' : 'Submit Assessment'}
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TakeAssessment
