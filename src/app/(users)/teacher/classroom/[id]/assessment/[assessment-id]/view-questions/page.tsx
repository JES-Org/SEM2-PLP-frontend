'use client'

import { useEffect, useState } from 'react'

import {
	useAddQuestionMutation,
	useDeleteQuestionMutation,
	useGetQuestionsQuery,
} from '@/store/assessment/assessmentApi'
// Use the more detailed AssessmentQuestion type for new questions as well,
// or a custom type that includes question_type, model_answer, etc.
// Let's assume your Question type in assessment.type.ts is updated or you use AssessmentQuestion
import { AssessmentQuestion as LocalQuestionFormType, AssessmentAnswer as LocalAnswerFormType, AssessmentQuestion as FetchedQuestionType } from '@/types/assessment/assessment.type'
import { CheckCircle2, MessageSquareText, Plus, Radio, Trash2 } from 'lucide-react' // Added MessageSquareText
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group' // Renamed to avoid conflict
import { Textarea } from '@/components/ui/textarea'
import Spinner from '@/components/Spinner'


const EditQuestions = () => {
	const currPath = usePathname().split('/')
	const currClassroomId = currPath[3]
	const currAssessmentId = currPath[5]

	const {
        data: assessmentAPIData,
        isLoading: isLoadingFetched,
        isFetching: isFetchingFetched,
        isError: isErrorFetched,
        error: errorFetched
    } = useGetQuestionsQuery({
		classroomId: currClassroomId,
		assessmentId: currAssessmentId,
	})
	const fetchedQuestions: FetchedQuestionType[] = assessmentAPIData?.data?.questions || []

	const [addQuestionMutation, { isLoading: isAddingQuestion }] = useAddQuestionMutation()
	const [deleteQuestionMutation, { isLoading: isDeletingQuestion }] = useDeleteQuestionMutation()

    // State for NEW questions being added/edited on this page
	const [newQuestions, setNewQuestions] = useState<LocalQuestionFormType[]>([])

	const addNewQuestionUI = () => { // Renamed from addQuestion to avoid confusion
		const newId = `temp-client-${Date.now()}`;
        const newAnswerId1 = `temp-ans-${newId}-1`;
        const newAnswerId2 = `temp-ans-${newId}-2`;
		setNewQuestions([
			...newQuestions,
			{
				id: newId, // Temporary client-side ID
				text: '',
				weight: 1,
				question_type: 'multiple_choice', // Default
				answers: [ // For MCQ: array of objects
                    { id: newAnswerId1, text: '', is_correct: false, questionId: newId, createdAt: '', updatedAt: '' },
                    { id: newAnswerId2, text: '', is_correct: false, questionId: newId, createdAt: '', updatedAt: '' }
                ],
				// correctAnswerIndex: -1, // We'll rely on is_correct in answers array
				assessmentId: currAssessmentId as string,
				tags: [],
				model_answer: '',
                // Fill other required fields from AssessmentQuestion if necessary
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // assessment: currAssessmentId, // If your type needs it
			},
		])
	}

	const removeNewQuestion = (questionIndex: number) => {
		setNewQuestions(newQuestions.filter((_, idx) => idx !== questionIndex));
	}

    const handleNewQuestionChange = (index: number, field: keyof LocalQuestionFormType, value: any) => {
        const updatedQuestions = newQuestions.map((q, i) => {
            if (i === index) {
                const updatedQ = { ...q, [field]: value };
                if (field === 'question_type') {
                    const newId = `temp-client-${Date.now()}`;
                    const newAnswerId1 = `temp-ans-${newId}-1`;
                    const newAnswerId2 = `temp-ans-${newId}-2`;
                    if (value === 'multiple_choice') {
                        updatedQ.model_answer = '';
                        updatedQ.answers = [
                            { id: newAnswerId1, text: '', is_correct: false, questionId: newId, createdAt: '', updatedAt: '' },
                            { id: newAnswerId2, text: '', is_correct: false, questionId: newId, createdAt: '', updatedAt: '' }
                        ];
                    } else if (value === 'short_answer') {
                        updatedQ.answers = [];
                    }
                }
                return updatedQ;
            }
            return q;
        });
        setNewQuestions(updatedQuestions);
    };

	const addOptionToNewQuestion = (questionIndex: number) => {
		const updatedQ = [...newQuestions];
        const question = updatedQ[questionIndex];
		if (question.question_type === 'multiple_choice') {
            const newAnswerId = `temp-ans-${question.id}-${question.answers.length + 1}`;
			question.answers.push({ id: newAnswerId, text: '', is_correct: false, questionId: question.id, createdAt: '', updatedAt: '' });
			setNewQuestions(updatedQ);
		}
	}

	const removeOptionFromNewQuestion = (questionIndex: number, optionIndex: number) => {
		const updatedQ = [...newQuestions];
        const question = updatedQ[questionIndex];
        if (question.question_type === 'multiple_choice') {
            question.answers.splice(optionIndex, 1);
		    setNewQuestions(updatedQ);
        }
	}

	const handleOptionTextChangeForNewQuestion = (
		questionIndex: number,
		optionIndex: number,
		text: string,
	) => {
		const updatedQ = [...newQuestions];
        const question = updatedQ[questionIndex];
        if (question.question_type === 'multiple_choice') {
		    question.answers[optionIndex].text = text;
		    setNewQuestions(updatedQ);
        }
	}

	const setCorrectAnswerForNewQuestion = (questionIndex: number, optionIndex: number) => {
		const updatedQ = [...newQuestions];
        const question = updatedQ[questionIndex];
        if (question.question_type === 'multiple_choice') {
            question.answers.forEach((ans, idx) => {
                ans.is_correct = idx === optionIndex;
            });
		    setNewQuestions(updatedQ);
        }
	}

	const handleDeleteFetchedQuestion = async (questionId: string) => {
		try {
			await deleteQuestionMutation({
				classroomId: currClassroomId,
				questionId,
                assessmentId: currAssessmentId,
			}).unwrap()
      toast.success('Question deleted successfully')
		} catch (error) {
      toast.error('Failed to delete question')
		}
	}

	const handleSubmitNewQuestions = async () => {
		if (newQuestions.length === 0) {
			toast.info('No new questions to add.');
			return;
		}

		for (let i = 0; i < newQuestions.length; i++) {
			const q = newQuestions[i];
			if (q.text.trim() === '') {
				toast.error(`New Question ${i + 1} text is empty`);
				return;
			}
			if (q.question_type === 'multiple_choice') {
				if (!q.answers || q.answers.length < 2) {
					toast.error(`New Question ${i + 1} (MCQ) must have at least 2 options.`);
					return;
				}
				if (q.answers.some(ans => ans.text.trim() === '')) {
					toast.error(`New Question ${i + 1} (MCQ) has an empty option.`);
					return;
				}
				if (!q.answers.some(ans => ans.is_correct)) {
					toast.error(`New Question ${i + 1} (MCQ) must have a correct answer selected.`);
					return;
				}
			}
            // No specific validation for short answer model_answer for now, can be added
		}

		try {
			for (const newQuestion of newQuestions) {
                const payloadForBackend = {
                    assessmentId: newQuestion.assessmentId,
                    text: newQuestion.text,
                    weight: newQuestion.weight,
                    tags: newQuestion.tags || [],
                    question_type: newQuestion.question_type,
                    model_answer: newQuestion.question_type === 'short_answer' ? newQuestion.model_answer : undefined,
                    answers: newQuestion.question_type === 'multiple_choice' ? newQuestion.answers.map(a => a.text) : [],
                    correctAnswerIndex: newQuestion.question_type === 'multiple_choice' ? newQuestion.answers.findIndex(a => a.is_correct) : -1,
                };
				await addQuestionMutation({
					classroomId: currClassroomId,
					question: payloadForBackend as any, // Cast as any if payloadForBackend doesn't perfectly match Question type for mutation
				}).unwrap();
			}
			toast.success(`${newQuestions.length} new question(s) added successfully`);
			setNewQuestions([]);
		} catch (error: any) {
			toast.error(error?.data?.message || error?.data?.errors?.[0] || 'Failed to add new questions');
		}
	};

	if (isLoadingFetched || isFetchingFetched) {
		return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
	}
	if (isErrorFetched) {
		return <div className="flex justify-center items-center h-screen text-red-500">Error loading questions: {JSON.stringify(errorFetched)}</div>;
	}

	return (
		<div className='md:ml-72 pl-3 mr-24 mt-10 pb-20'>
			<div className='w-full h-full flex flex-col'>
				<header className='bg-primary rounded-md text-white py-4 px-6 mb-6'>
					<h1 className='text-primary-foreground text-2xl font-bold'>
						Edit Questions for: {assessmentAPIData?.data?.name || 'Assessment'}
					</h1>
				</header>

				<h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">Existing Questions</h2>
				{fetchedQuestions.length === 0 && <p className="text-gray-500 dark:text-gray-400 mb-4">No questions found for this assessment yet.</p>}
				<div className='space-y-6 mb-10'>
					{fetchedQuestions.map((question, questionIndex) => (
						<div
							key={question.id || `fetched-${questionIndex}`}
							className='bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 '
						>
							<div className="flex justify-between items-start">
								<div>
									<div className='flex items-center mb-2'>
										<span className='text-gray-600 dark:text-gray-400 font-bold text-xl mr-2'>
											{questionIndex + 1}.
										</span>
										{question.question_type === 'short_answer' && (
											<MessageSquareText className="h-5 w-5 mr-2 text-blue-500" />
										)}
										<p className='text-lg font-medium text-gray-800 dark:text-gray-200'>{question.text}</p>
									</div>
									{question.question_type === 'multiple_choice' && question.answers && (
										<div className='grid gap-2 pl-8'>
											{question.answers.map((option, optionIndex) => (
												<div
													key={option.id || `fetched-opt-${optionIndex}`}
													className={`flex items-center p-2 rounded ${
														option.is_correct ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-700'
													}`}
												>
													<span className='text-gray-500 dark:text-gray-400 font-semibold mr-2'>
														{String.fromCharCode(65 + optionIndex)}.
													</span>
													<span className="text-gray-700 dark:text-gray-300">{option.text}</span>
													{option.is_correct && (
														<CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-400 ml-auto' />
													)}
												</div>
											))}
										</div>
									)}
									{question.question_type === 'short_answer' && question.model_answer && (
										<div className="pl-8 mt-2">
											<p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Model Answer:</p>
											<p className="text-sm text-gray-700 dark:text-gray-300 italic">{question.model_answer}</p>
										</div>
									)}
								</div>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => handleDeleteFetchedQuestion(question.id!)}
                                    disabled={isDeletingQuestion}
								>
									<Trash2 className='h-5 w-5 text-red-500 hover:text-red-700' />
								</Button>
							</div>
						</div>
					))}
				</div>

				<h2 className="text-xl font-semibold mb-3 mt-6 text-gray-700 dark:text-gray-300">Add New Questions</h2>
				<div className='space-y-8'>
					{newQuestions.map((question, questionIndex) => (
						<div
							key={question.id}
							className='bg-secondary dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700'
						>
							<div className='flex justify-between items-center mb-4'>
								<Label className='text-gray-600 dark:text-gray-400 font-bold text-xl'>
									New Question {questionIndex + 1}
								</Label>
								<Button variant='ghost' size='icon' onClick={() => removeNewQuestion(questionIndex)} >
									<Trash2 className='h-5 w-5 text-gray-500 hover:text-red-600' />
								</Button>
							</div>

							<div className="mb-4">
								<Label htmlFor={`qtype-${question.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Type</Label>
								<RadioGroup
									id={`qtype-${question.id}`}
									value={question.question_type}
									onValueChange={(value) => handleNewQuestionChange(questionIndex, 'question_type', value as LocalQuestionFormType['question_type'])}
									className="flex space-x-4"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="multiple_choice" id={`mcq-${question.id}`} />
										<Label htmlFor={`mcq-${question.id}`} className="font-normal text-gray-700 dark:text-gray-300">Multiple Choice</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="short_answer" id={`sa-${question.id}`} />
										<Label htmlFor={`sa-${question.id}`} className="font-normal text-gray-700 dark:text-gray-300">Short Answer</Label>
									</div>
								</RadioGroup>
							</div>

							<div className="mb-4">
								<Label htmlFor={`qtext-${question.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Text</Label>
								<Textarea
									id={`qtext-${question.id}`}
									value={question.text}
									onChange={(e) => handleNewQuestionChange(questionIndex, 'text', e.target.value)}
									placeholder={`Enter text for Question ${questionIndex + 1}`}
									className='min-h-[80px] p-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
								/>
							</div>

							{question.question_type === 'multiple_choice' && (
								<div className="space-y-3 pl-4 border-l-2 border-blue-500 py-2">
									<Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Answer Options</Label>
									{question.answers.map((option, optionIndex) => (
										<div key={option.id || optionIndex} className='flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded'>
											<span className='text-gray-500 dark:text-gray-400 font-semibold'>
												{String.fromCharCode(65 + optionIndex)}.
											</span>
											<Input
												value={option.text}
												onChange={(e) =>
													handleOptionTextChangeForNewQuestion(
														questionIndex,
														optionIndex,
														e.target.value,
													)
												}
												placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
												className='flex-1 p-2 border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200'
											/>
											<Button
												variant={option.is_correct ? 'default' : 'outline'}
												size='icon'
												onClick={() => setCorrectAnswerForNewQuestion(questionIndex, optionIndex)}
                                                className={option.is_correct ? 'bg-green-500 hover:bg-green-600' : ''}
                                                title="Mark as correct"
											>
												<CheckCircle2 className={`h-5 w-5 ${option.is_correct ? 'text-white' : 'text-gray-500'}`} />
											</Button>
											{question.answers.length > 2 && (
												<Button variant='ghost' size='icon' onClick={() => removeOptionFromNewQuestion(questionIndex, optionIndex)} title="Remove option" >
													<Trash2 className='h-4 w-4 text-red-500' />
												</Button>
											)}
										</div>
									))}
									{question.answers.length < 5 && (
										<Button variant='outline' size='sm' onClick={() => addOptionToNewQuestion(questionIndex)} className="mt-2 border-dashed border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400" >
											<Plus className='h-4 w-4 mr-2' /> Add Option
										</Button>
									)}
								</div>
							)}

							{question.question_type === 'short_answer' && (
								<div className="mb-4">
									<Label htmlFor={`qmodel-${question.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Answer (Optional)</Label>
									<Textarea
										id={`qmodel-${question.id}`}
										value={question.model_answer || ''}
										onChange={(e) => handleNewQuestionChange(questionIndex, 'model_answer', e.target.value)}
										placeholder="Enter the ideal short answer for review purposes"
										className='min-h-[80px] p-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
									/>
								</div>
							)}

                            <div className="mt-4">
                                <Label htmlFor={`qweight-${question.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight/Points</Label>
                                <Input
                                    id={`qweight-${question.id}`}
                                    type="number"
                                    min="1"
                                    value={question.weight}
                                    onChange={(e) => handleNewQuestionChange(questionIndex, 'weight', parseInt(e.target.value) || 1)}
                                    className="w-24 p-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>
						</div>
					))}
				</div>

				<div className='sticky bottom-0 bg-background dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4 items-center'>
					<Button onClick={addNewQuestionUI} variant="outline">
						<Plus className='h-5 w-5 mr-2' /> Add Another New Question
					</Button>
					<Button
                        onClick={handleSubmitNewQuestions}
                        disabled={newQuestions.length === 0 || isAddingQuestion}
                        className="min-w-[150px]"
                    >
						{isAddingQuestion ? <Spinner /> : `Save ${newQuestions.length} New Question(s)`}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default EditQuestions
