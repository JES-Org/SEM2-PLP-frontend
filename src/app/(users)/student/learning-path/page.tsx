'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useGetAllLearningPathsQuery } from '@/store/chatbot/chatbotApi'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import LearningPathCard from '@/components/LearningPathCard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'


const LearningPathPage = () => {
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const router = useRouter()

	const {data, isLoading, isFetching, isError} = useGetAllLearningPathsQuery(currUser?.id!)

	return (
		<div className='ml-72 h-screen'>
			<Button
				className='fixed bottom-6 right-6 rounded-full p-0 h-12 w-12 flex items-center justify-center bg-primary text-primary-foreground animate-bounce'
				onClick={() => router.push('/student/learning-path/generate')}
			>
				<Plus className='text-primary-foreground' />
			</Button>
			<Tabs defaultValue='Ongoing' className='mx-4 my-4'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='Ongoing'>Ongoing</TabsTrigger>
					<TabsTrigger value='Completed'>Completed</TabsTrigger>
				</TabsList>
				<TabsContent
					value='Ongoing'
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
				>
					{data?.learningPaths.map(
						(path: any, i: number) =>
							!path.isCompleted && (
								<LearningPathCard
									key={i}
									userId={currUser?.id}
									id={path.learningPathId}
									title={path.learningPathTitle}
									deadline={path.deadline}
									isCompleted={path.isCompleted}
									content={path.content}
								/>
							),
					)}
				</TabsContent>
				<TabsContent
					value='Completed'
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
				>
					{data?.learningPaths.map(
						(path: any, i: number) =>
							path.isCompleted && (
								<LearningPathCard
									key={i}
									userId={currUser?.id}
									id={path.learningPathId}
									title={path.learningPathTitle}
									deadline={path.deadline}
									isCompleted={path.isCompleted}
									content={path.content}
								/>
							),
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}
export default LearningPathPage
