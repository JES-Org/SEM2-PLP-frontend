"use client"
import React from 'react'

import { Check, Tally5 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

const TestCenterCard = () => {
	return (
		<div className='w-full flex justify-center mt-20'>
			<Card className="md:w-7/12 lg:w-8/12 md:ml-60">
				<CardHeader>
					<CardTitle className="text-xl mb-4">Application of Integration</CardTitle>
					<CardDescription>
						Description: assesses interdisciplinary knowledge for a
						comprehensive understanding of students' learning.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex space-x-3 items-center'>
						<Tally5 size={32} />
						<p>10/15</p>
					</div>
				</CardContent>
				<CardFooter>
					<div className='flex items-center justify-between w-full'>
						<div className='flex space-x-3 items-center'>
							<span>Status: </span>
							<Check size={24} />
						</div>
						<Button>View</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}

export default TestCenterCard
