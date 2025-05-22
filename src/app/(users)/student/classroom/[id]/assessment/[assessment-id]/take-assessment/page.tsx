// @ts-nocheck
'use client'

import { useEffect, useState, useMemo } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	useGetQuestionsQuery,
	useSingleAssessmentScoreQuery,
	useSubmitAssessmentMutation,
} from '@/store/assessment/assessmentApi'
import { AssessmentQuestion, AssessmentAnswer as AnswerOptionType } from '@/types/assessment/assessment.type'
import { CheckCircle, MessageSquareText, XCircle, Star } from 'lucide-react' // Added Star for score display
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import Spinner from '@/components/Spinner'
import { Badge } from '@/components/ui/badge' // For displaying score/weight

interface ScoreDataDetails {
    id: string;
    score: number;
    answers: Record<string, string>;
    graded_details?: Record<string, number>; // Teacher's manual grades for short answers
    createdAt: string; // Assuming these are present
    updatedAt: string; // Assuming these are present
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
	const [answers, setAnswers] = useState<Record<string, string>>({})
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [isReviewMode, setIsReviewMode] = useState(false)
    const [submissionGradedDetails, setSubmissionGradedDetails] = useState<Record<string, number> | undefined>(undefined);

	const totalPossibleAssessmentWeight = useMemo(() => {
		if (!fetchedQuestions || fetchedQuestions.length === 0) {
			return 0;
		}
		return fetchedQuestions.reduce((sum, question) => sum + (question.weight || 0), 0);
	}, [fetchedQuestions]);


	useEffect(() => {
		const submissionDetails = scoreQueryData?.data as ScoreDataDetails | undefined;

		if (submissionDetails?.id) {
			setHasSubmitted(true);
			setIsReviewMode(true);
			if (submissionDetails.answers && Object.keys(submissionDetails.answers).length > 0) {
				setAnswers(submissionDetails.answers);
			} else if (fetchedQuestions.length > 0) {
                const initialAnswers: Record<string, string> = {};
                fetchedQuestions.forEach(q => initialAnswers[q.id] = '');
                setAnswers(initialAnswers);
            }
            if (submissionDetails.graded_details) {
                setSubmissionGradedDetails(submissionDetails.graded_details);
            }
		} else if (fetchedQuestions.length > 0) {
			const initialAnswers: Record<string, string> = {};
			fetchedQuestions.forEach(q => initialAnswers[q.id] = '');
			setAnswers(initialAnswers);
			setHasSubmitted(false);
			setIsReviewMode(false);
            setSubmissionGradedDetails(undefined);
		}
	}, [scoreQueryData, fetchedQuestions]);


	const handleAnswerChange = (questionId: string, value: string) => {
		if (isReviewMode || hasSubmitted) return
		setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: value, }))
	}

	const handleSubmit = async () => {
		// ... (handleSubmit logic remains largely the same as your last version)
        if (hasSubmitted) {
			setIsReviewMode(true);
			toast.info('You have already submitted this assessment. Viewing results.');
			return;
		}
		for (const question of fetchedQuestions) {
			if (!answers[question.id] || answers[question.id].trim() === '') {
                const questionNumber = fetchedQuestions.findIndex(q => q.id === question.id) + 1;
				toast.error(`Please answer question ${questionNumber}`);
				return;
			}
		}
		try {
			const res = await submitMutation({
				classroomId: currClassroomId,
				body: { assessmentId: currAssessmentId, answers: answers, studentId: studentId, },
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
			toast.error( err?.data?.errors?.[0] || err?.data?.message || err?.message || 'Failed to submit assessment', )
		}
	}

	if (isLoading || isFetching || (!assessmentData && !isError) ) {
		return ( <div className='ml-72 mr-10 mt-10 h-screen flex justify-center items-center'> <Spinner /> </div> )
	}
	if (isError || !assessmentData?.data) {
		return ( <div className='ml-72 mr-10 mt-10 h-screen flex justify-center items-center'> <p className='text-xl text-red-500'> Error loading assessment: {JSON.stringify(error) || 'Assessment data not found.'} </p> </div> )
	}

	const answeredQuestionsCount = Object.values(answers).filter(ans => ans && ans.trim() !== '').length;
    const allQuestionsAnsweredForSubmission = answeredQuestionsCount === fetchedQuestions.length;
    const currentDisplayScore = scoreQueryData?.data?.score; // Directly from submission data

	return (
		<div className='ml-72 mr-10 mt-10 pb-20'>
			<div className='flex flex-col'>
				<div className='w-full p-4 md:p-8 overflow-auto'> {/* Adjusted padding */}
                    {/* Header with Title and Score */}
                    <div className='flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow'>
						<h1 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-0'>
							{assessmentData?.data?.name}
						</h1>
						<div className='flex flex-col items-center'>
							<span className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                {hasSubmitted ? "Your Score" : "Score"}
                            </span>
							<div className='flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary text-primary-foreground'>
								<span className='text-3xl md:text-4xl font-bold'>
									{hasSubmitted && currentDisplayScore !== undefined
                                        ? `${currentDisplayScore} / ${totalPossibleAssessmentWeight}`
                                        : '-'}
								</span>
							</div>
						</div>
					</div>

					{/* Progress Bar */}
					{ !isReviewMode && !hasSubmitted && fetchedQuestions.length > 0 && (
                        <div className='mb-8'>
							<div className='flex justify-between mb-1 text-sm font-medium text-gray-700 dark:text-gray-300'>
								<span>Progress</span>
								<span>{answeredQuestionsCount} / {fetchedQuestions.length} Answered</span>
							</div>
							<div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
								<div
									className='bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out'
									style={{ width: `${fetchedQuestions.length > 0 ? (answeredQuestionsCount / fetchedQuestions.length) * 100 : 0}%` }}
								></div>
							</div>
						</div>
					)}
                    {isReviewMode && (
                        <div className="mb-6 p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700 rounded-md text-center text-sm">
                            You are in review mode. Your submitted answers and scores are shown below.
                        </div>
                    )}

					<div className='space-y-8'>
						{fetchedQuestions.map((question, questionIndex) => {
                            const studentResponse = answers[question.id];
                            const manuallyGradedScore = isReviewMode && submissionGradedDetails ? submissionGradedDetails[question.id] : undefined;

							return (
								<div key={question.id} id={`question-wrapper-${questionIndex}`} className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
									<div className='flex flex-col sm:flex-row justify-between items-start mb-3'>
                                        <div className="flex-1">
                                            <div className='flex items-center mb-1'>
                                                <span className='font-semibold mr-2 text-lg text-gray-800 dark:text-gray-200'>
                                                    {questionIndex + 1}.
                                                </span>
                                                {question.question_type === 'short_answer' && (
                                                    <MessageSquareText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                )}
                                                <p className='text-lg text-gray-900 dark:text-gray-100'>{question.text}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="mt-1 sm:mt-0 ml-0 sm:ml-2 whitespace-nowrap">Weight: {question.weight || 0}</Badge>
                                    </div>


									{question.question_type === 'multiple_choice' ? (
										<RadioGroup
											value={studentResponse || ''}
											onValueChange={(value) =>
												handleAnswerChange(question.id, value)
											}
											disabled={isReviewMode || hasSubmitted}
                                            className="mt-2"
										>
											{question.answers.map((answerOption: AnswerOptionType) => {
												let optionStyle = 'bg-gray-50 border-gray-300 hover:bg-gray-100 dark:bg-gray-750 dark:border-gray-600 dark:hover:bg-gray-700'
												let feedbackIcon = null

												if (isReviewMode && studentResponse !== undefined) {
													const isSelectedByStudent = String(answerOption.id) === studentResponse;
													const isCorrectOption = answerOption.is_correct;

													if (isSelectedByStudent) {
														if (isCorrectOption) {
															optionStyle = 'bg-green-100 border-green-500 ring-2 ring-green-400 dark:bg-green-700 dark:border-green-500';
															feedbackIcon = <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-300 ml-auto" />;
														} else {
															optionStyle = 'bg-red-100 border-red-500 ring-2 ring-red-400 dark:bg-red-700 dark:border-red-500';
															feedbackIcon = <XCircle className="h-5 w-5 text-red-700 dark:text-red-300 ml-auto" />;
														}
													} else if (isCorrectOption) {
														optionStyle = 'bg-green-50 border-green-400 dark:bg-green-800 dark:border-green-600';
														feedbackIcon = <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 ml-auto opacity-80" />;
													}
												} else if (studentResponse === String(answerOption.id)) {
													optionStyle = 'bg-blue-100 border-blue-500 dark:bg-blue-700 dark:border-blue-500 shadow-md';
												}

												return (
													<div
														key={answerOption.id}
														className={`flex items-center mb-2 p-3 rounded-lg border transition-all duration-150 ease-in-out ${
															!(isReviewMode || hasSubmitted) ? 'cursor-pointer' : 'cursor-default'
														} ${optionStyle}`}
														onClick={() => {
															if (!(isReviewMode || hasSubmitted)) {
																handleAnswerChange(question.id, String(answerOption.id))
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
															} text-gray-700 dark:text-gray-200`}
														>
															{answerOption.text}
														</label>
														{isReviewMode && studentResponse !== undefined && feedbackIcon}
													</div>
												)
											})}
										</RadioGroup>
									) : question.question_type === 'short_answer' ? (
										<div className="mt-3 space-y-3">
											<div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Answer:</p>
                                                <Textarea
													placeholder="Type your answer here..."
													value={studentResponse || ''}
													onChange={(e) => handleAnswerChange(question.id, e.target.value)}
													disabled={isReviewMode || hasSubmitted}
													className="min-h-[100px] p-3 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md"
												/>
                                            </div>
                                            {isReviewMode && question.model_answer && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Model Answer:</p>
                                                    <div className="p-3 bg-blue-50 border border-blue-200 dark:bg-blue-900 dark:border-blue-700 rounded-md text-sm text-blue-700 dark:text-blue-300">
                                                        {question.model_answer}
                                                    </div>
                                                </div>
                                            )}
                                            {isReviewMode && manuallyGradedScore !== undefined && manuallyGradedScore !== null && (
                                                <div className="flex items-center mt-2 p-2 bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 rounded-md">
                                                    <Star className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                                                    <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                                        Score Awarded: {manuallyGradedScore} / {question.weight || 0}
                                                    </p>
                                                </div>
                                            )}
										</div>
									) : null}
								</div>
							)
						})}
						<div className='text-center pt-6'>
							{hasSubmitted ? (
								<Button size='lg' onClick={() => router.back()} variant="outline">
									Back to Assessments
								</Button>
							) : (
								<Button
									size='lg'
									onClick={handleSubmit}
									disabled={!allQuestionsAnsweredForSubmission || isSubmitting || isLoading}
								>
									{isSubmitting ? <Spinner size="sm" className="mr-2"/> : null}
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
