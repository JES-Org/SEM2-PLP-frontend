'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	useGetQuestionsQuery,
	useSingleAssessmentScoreQuery,
	useSubmitAssessmentMutation,
} from '@/store/assessment/assessmentApi'
// Assuming your types are updated:
import { AssessmentQuestion, AssessmentAnswer as AnswerOptionType } from '@/types/assessment/assessment.type'
import { CheckCircle, MessageSquareText, XCircle } from 'lucide-react' // Added MessageSquareText
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea' // Import Textarea
import Spinner from '@/components/Spinner'

// Update this if your backend sends a more detailed score object
interface ScoreDataDetails {
    id: string;
    score: number;
    // This should now be a Record where value can be string (optionId) or string (text answer)
    answers: Record<string, string>;
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

	// fetchedQuestions should now include a 'question_type' field
	const fetchedQuestions: AssessmentQuestion[] =
		assessmentData?.data?.questions || []

	// 'answers' state will now be a Record: { [questionId: string]: string }
	// The string value will be an answerOption.id for MCQs, or the text for short answers.
	const [answers, setAnswers] = useState<Record<string, string>>({})
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [isReviewMode, setIsReviewMode] = useState(false)

	useEffect(() => {
		const submissionDetails = scoreQueryData?.data as ScoreDataDetails | undefined;

		if (submissionDetails?.id) {
			setHasSubmitted(true);
			setIsReviewMode(true);
			if (submissionDetails.answers && Object.keys(submissionDetails.answers).length > 0) {
				setAnswers(submissionDetails.answers); // Directly use the map from backend
			} else {
                // Initialize empty answers if submission exists but answers map is empty (shouldn't happen ideally)
                const initialAnswers: Record<string, string> = {};
                fetchedQuestions.forEach(q => initialAnswers[q.id] = '');
                setAnswers(initialAnswers);
            }
		} else if (fetchedQuestions.length > 0) {
            // No submission found, initialize for taking the assessment
			const initialAnswers: Record<string, string> = {};
			fetchedQuestions.forEach(q => initialAnswers[q.id] = '');
			setAnswers(initialAnswers);
			setHasSubmitted(false);
			setIsReviewMode(false);
		}
	}, [scoreQueryData, fetchedQuestions]);
	console.log("fetched questions: ", fetchedQuestions[2])


	const handleAnswerChange = (questionId: string, value: string) => {
		if (isReviewMode || hasSubmitted) return

		setAnswers(prevAnswers => ({
			...prevAnswers,
			[questionId]: value,
		}))
	}

	const handleSubmit = async () => {
		if (hasSubmitted) {
			setIsReviewMode(true);
			toast.info('You have already submitted this assessment. Viewing results.');
			return;
		}

        // Validate all questions have an answer
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
				body: {
					assessmentId: currAssessmentId,
					answers: answers, // Convert answers record to string array
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
		return ( <div className='ml-72 mr-10 mt-10 h-screen flex justify-center items-center'> <Spinner /> </div> )
	}
	if (isError || !assessmentData?.data) {
		return ( <div className='ml-72 mr-10 mt-10 h-screen flex justify-center items-center'> <p className='text-xl text-red-500'> Error loading assessment: {JSON.stringify(error) || 'Assessment data not found.'} </p> </div> )
	}

	const answeredQuestionsCount = Object.values(answers).filter(ans => ans && ans.trim() !== '').length;
    const allQuestionsAnsweredForSubmission = answeredQuestionsCount === fetchedQuestions.length;
    const currentDisplayScore = (scoreQueryData?.data as ScoreDataDetails | undefined)?.score;

	return (
		<div className='ml-72 mr-10 mt-10 pb-20'>
			<div className='flex flex-col'>
				<div className='w-full p-8 overflow-auto'>
					{/* Header with Title and Score (same as before) */}
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
									style={{ width: `${(answeredQuestionsCount / fetchedQuestions.length) * 100}%` }}
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
                            const studentResponse = answers[question.id]; // This is now a string (optionId or text)

							return (
								<div key={question.id} id={`question-wrapper-${questionIndex}`}>
									<div className='flex items-center mb-2'>
                                        <span className='font-semibold mr-2 text-lg'>
											{questionIndex + 1}.
										</span>
                                        {question.question_type === 'short_answer' && (
                                            <MessageSquareText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                        )}
										<p className='text-lg'>{question.text}</p>
                                    </div>

									{question.question_type === 'multiple_choice' ? (
										<RadioGroup
											value={studentResponse || ''}
											onValueChange={(value) =>
												handleAnswerChange(question.id, value)
											}
											disabled={isReviewMode || hasSubmitted}
										>
											{question.answers.map((answerOption: AnswerOptionType) => {
												let optionStyle = 'bg-gray-50 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
												let feedbackIcon = null

												if (isReviewMode && studentResponse !== undefined) {
													const isSelectedByStudent = String(answerOption.id) === studentResponse;
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
												} else if (studentResponse === String(answerOption.id)) {
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
															} text-gray-700 dark:text-gray-300`}
														>
															{answerOption.text}
														</label>
														{isReviewMode && studentResponse !== undefined && feedbackIcon}
													</div>
												)
											})}
										</RadioGroup>
									) : question.question_type === 'short_answer' ? (
										<div className="mt-2">
											<Textarea
												placeholder="Type your answer here..."
												value={studentResponse || ''} // studentResponse is answers[question.id]
												onChange={(e) => handleAnswerChange(question.id, e.target.value)}
												disabled={isReviewMode || hasSubmitted}
												className="min-h-[100px] p-3 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
											/>
											{isReviewMode && question.model_answer && (
												<div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900 dark:border-blue-700">
													<p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">Model Answer:</p>
													<p className="text-sm text-gray-700 dark:text-gray-300">{question.model_answer}</p>
												</div>
											)}
										</div>
									) : null}
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
