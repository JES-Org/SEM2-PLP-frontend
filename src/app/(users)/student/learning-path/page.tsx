'use client'

import { useEffect } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useGetAllLearningPathsQuery } from '@/store/chatbot/chatbotApi'
import { Plus } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import LearningPathCard from '@/components/LearningPathCard'
import LearningPathDeleteDialog from '@/components/LearningPathDeleteDialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const LearningPathPage = () => {
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const router = useRouter()

	const { data, isLoading, isFetching, isError, refetch } =
		useGetAllLearningPathsQuery(currUser?.id!)
	const completedPaths =
		data?.learningPaths.filter((path) => path.completion_percentage === 100) ||
		[]
	const ongoingPaths =
		data?.learningPaths.filter((path) => path.completion_percentage < 100) || []
	console.log('paths data ', data)
	return (
		<div className='ml-72 h-screen'>
			<LearningPathDeleteDialog />
			<Button
				className='fixed bottom-6 right-6 rounded-full p-0 h-12 w-12 flex items-center justify-center bg-primary text-primary-foreground'
				onClick={() => router.push('/student/learning-path/generate')}
			>
				<Plus className='text-primary-foreground' />
			</Button>
			<Tabs defaultValue='Ongoing' className='mx-4 my-4'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='Ongoing'>
						Ongoing ({ongoingPaths.length})
					</TabsTrigger>
					<TabsTrigger value='Completed'>
						Completed ({completedPaths.length})
					</TabsTrigger>
				</TabsList>
				<TabsContent
					value='Ongoing'
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
				>
					{ongoingPaths.length > 0 ? (
						ongoingPaths.map((path) => (
							<LearningPathCard
								key={path.id}
								path={path}
								userId={currUser?.id}
							/>
						))
					) : (
						<div className='flex items-center my-40  mx-auto text-muted-foreground italic'>
							No Learning path yet !!
						</div>
					)
					}
				</TabsContent>
					<TabsContent
						value='Completed'
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
					>
						{completedPaths.length > 0 ? (
							completedPaths.map((path) => (
							<LearningPathCard
								key={path.id}
								path={path}
								userId={currUser?.id}
							/>
							))
							) : (
					<div className='flex items-center my-40  mx-60 w-full text-muted-foreground italic'>
						No completed learning paths yet.
					</div>
				)
					}
					</TabsContent>
				
			</Tabs>
		</div>
	)
}
export default LearningPathPage
