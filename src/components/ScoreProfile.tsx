import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

const ScoreProfile = () => {
	return (
		<Card className='flex items-center justify-between md:px-3 pt-5 mb-1 w-full'>
			<CardContent className='flex justify-between items-center w-full'>
				<div className='flex items-center mr-2'>
					<Avatar className='mr-2'>
						<AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<span>Henon Solomon</span>
				</div>
				<div className='2xl:text-md text-sm'>20/20</div>
			</CardContent>
		</Card>
	)
}

export default ScoreProfile
