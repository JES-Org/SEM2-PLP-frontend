import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface AdminStudentListProps {
	name: string;
	department?: string;
}
const AdminStudentList = ({name, department}: AdminStudentListProps) => {
	return (
		<div>
			<Card className="md:w-6/12 z-50 md:mx-auto mx-2 ">
				<CardContent className='flex items-center justify-between pr-10 py-2'>
					<div className='flex items-center space-x-3'>
					<Avatar>
						<AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div>{name}</div>
					</div>
					<div className='font-light text-gray-500'>{department}</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default AdminStudentList