'use client'

import { useState } from 'react'

import {
	useAddQuestionMutation,
	useDeleteQuestionMutation,
	useGetQuestionsQuery,
} from '@/store/assessment/assessmentApi'
import { Question } from '@/types/assessment/assessment.type'
import { CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const EditQuestions = () => {
	const currPath = usePathname().split('/')
	const currClassroomId = currPath[3]
	const currAssessmentId = currPath[5]
	const { data, isLoading, isFetching, isError, error } = useGetQuestionsQuery({
		classroomId: currClassroomId,
		assessmentId: currAssessmentId,
	})
	const fetchedQuestions = data?.data?.questions || []

	const [prepareAssessment, {}] = useAddQuestionMutation()
	const [deleteQuestion, {}] = useDeleteQuestionMutation()

	const [questions, setQuestions] = useState<Question[]>([
		// {
		// 	text: '',
		// 	weight: 1,
		// 	answers: [],
		// 	correctAnswerIndex: -1,
		// 	assessmentId: currAssessmentId as string,
		// 	tags: [],
		// },
	])

	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				text: '',
				weight: 1,
				answers: [],
				correctAnswerIndex: -1,
				assessmentId: currAssessmentId as string,
				tags: [],
			},
		])
	}

	const removeQuestion = (questionIndex: number) => {
		const updatedQuestions = [...questions]
		updatedQuestions.splice(questionIndex, 1)
		setQuestions(updatedQuestions)
	}

	const addOption = (questionIndex: number) => {
		const updatedQuestions = [...questions]
		updatedQuestions[questionIndex].answers.push('')
		setQuestions(updatedQuestions)
	}

	const removeOption = (questionIndex: number, optionIndex: number) => {
		const updatedQuestions = [...questions]
		updatedQuestions[questionIndex].answers.splice(optionIndex, 1)
		setQuestions(updatedQuestions)
	}

	const setCorrectAnswer = (questionIndex: number, optionIndex: number) => {
		const updatedQuestions = [...questions]
		updatedQuestions[questionIndex].correctAnswerIndex = optionIndex
		setQuestions(updatedQuestions)
	}

	const handleQuestionTextChange = (questionIndex: number, text: string) => {
		const updatedQuestions = [...questions]
		updatedQuestions[questionIndex].text = text
		setQuestions(updatedQuestions)
	}

	const handleOptionTextChange = (
		questionIndex: number,
		optionIndex: number,
		text: string,
	) => {
		const updatedQuestions = [...questions]
		updatedQuestions[questionIndex].answers[optionIndex] = text
		setQuestions(updatedQuestions)
	}

	const handleDeleteQuestion = async (questionId: string) => {
		try {
			await deleteQuestion({
				classroomId: currClassroomId,
				questionId,
			}).unwrap()
			// Optionally remove the question from the local state
      toast.success('Question deleted successfully')
		} catch (error) {
			// console.error('Failed to delete question')
      toast.error('Failed to delete question')
		}
	}

  const handleNewQuestions = async () => {
    for (let i = 0; i < questions.length; i++) {
			const question = questions[i]
			if (question.text === '') {
				toast.error(`Question ${i + 1} is empty`)
				return
			}
			if (question.correctAnswerIndex === -1) {
				toast.error(`Question ${i + fetchedQuestions.length + 1} has no correct answer`)
				return
			}
		}

		try {
			for (const question of questions) {
				await prepareAssessment({
					classroomId: currClassroomId,
					question: question,
				}).unwrap()
			}
			toast.success('Questions added successfully')
		} catch (error) {
			toast.error('Failed to add question')
		}
  }

	if (isLoading || isFetching) {
		return <div>Loading...</div>
	}

	if (isError) {
		return <div>Error loading questions</div>
	}

	return (
		<div className='ml-72 mr-24 mt-10'>
			<div className='w-full h-full flex flex-col'>
				<header className='bg-primary rounded-md text-white py-4 px-6'>
					<h1 className='text-primary-foreground text-2xl font-bold'>
						Edit Questions
					</h1>
				</header>
				{/* Make this div scrollable */}
				<div className='flex-1 overflow-auto p-6 space-y-6'>
					{fetchedQuestions.map((question, questionIndex) => (
						<div
							key={questionIndex}
							className='bg-secondary rounded-lg shadow-md p-4 flex gap-4'
						>
							<div className='text-gray-500 font-bold text-2xl'>
								{questionIndex + 1}.
							</div>
							<div className='flex-1 grid gap-4'>
								<div className='flex justify-between items-center gap-4'>
									<div className='text-lg font-semibold mb-2'>
										{question.text}
									</div>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => handleDeleteQuestion(question.id)}
									>
										<Trash2 className='h-4 w-4 text-gray-500' />
									</Button>
								</div>
								<div className='grid gap-2'>
									{question.answers.map((option, optionIndex) => (
										<div
											key={optionIndex}
											className={`rounded-full px-4 py-2 flex items-center gap-2 ${
												option.isCorrect ? 'bg-green-100' : 'bg-gray-100'
											}`}
										>
											<div className='text-gray-500 font-bold'>
												{String.fromCharCode(65 + optionIndex)}.
											</div>
											<div className='flex-1'>{option.text}</div>
											{option.isCorrect && (
												<CheckCircle2 className='h-4 w-4 text-green-500' />
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					))}
					{questions.map((question, questionIndex) => (
						<div
							key={questionIndex + fetchedQuestions.length}
							className='bg-secondary rounded-lg shadow-md p-4 flex gap-4'
						>
							<div className='text-gray-500 font-bold text-2xl'>
								{questionIndex + fetchedQuestions.length + 1}.
							</div>
							<div className='flex-1 grid gap-4'>
								<div className='flex justify-between items-center gap-4'>
									<Input
										value={question.text}
										onChange={(e) =>
											handleQuestionTextChange(questionIndex, e.target.value)
										}
										placeholder={`Question ${questionIndex + fetchedQuestions.length + 1}`}
										className='mb-2'
									/>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => removeQuestion(questionIndex)}
									>
										<Trash2 className='h-4 w-4 text-gray-500' />
									</Button>
								</div>
								<div className='grid gap-2'>
									{question.answers.map((option, optionIndex) => (
										<div
											key={optionIndex}
											className={`rounded-full px-4 py-2 flex items-center gap-2 ${
												question.correctAnswerIndex === optionIndex
													? 'bg-green-100'
													: 'bg-gray-100'
											}`}
										>
											<div className='text-gray-500 font-bold'>
												{String.fromCharCode(65 + optionIndex)}.
											</div>
											<Input
												value={option}
												onChange={(e) =>
													handleOptionTextChange(
														questionIndex,
														optionIndex,
														e.target.value,
													)
												}
												placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
												className='flex-1'
											/>
											<Button
												variant='ghost'
												size='icon'
												onClick={() => removeOption(questionIndex, optionIndex)}
											>
												<Trash2 className='h-4 w-4 text-gray-500' />
											</Button>
											<Button
												variant={
													question.correctAnswerIndex === optionIndex
														? 'default'
														: 'outline'
												}
												size='icon'
												onClick={() =>
													setCorrectAnswer(questionIndex, optionIndex)
												}
											>
												<CheckCircle2 className='h-4 w-4 text-gray-500' />
											</Button>
										</div>
									))}
									<Button
										variant='ghost'
										size='icon'
										onClick={() => addOption(questionIndex)}
									>
										<Plus className='h-6 w-6 text-gray-500' />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
        <div className='fixed bottom-6 right-6 w-1/2 flex justify-between'>
					<Button onClick={() => handleNewQuestions()}>Add questions</Button>
					<Button onClick={addQuestion}>
						<Plus className='h-6 w-6 text-white' />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default EditQuestions
