import React from 'react'

import { Department } from '@/types/admin'
import { FolderTree } from 'lucide-react'

import AdminCard from '@/components/AdminCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import AdminStudentList from '@/components/AdminStudentList'
const departments: Department[] = [
	{ name: 'Marketing' },
	{ name: 'Sales' },
	{ name: 'Engineering' },
	{ name: 'Human Resources' },
	{ name: 'Finance' },
	{ name: 'Information Technology' },
	{ name: 'Customer Service' },
	{ name: 'Operations' },
	{ name: 'Product Management' },
	{ name: 'Research & Development' },
]

const Page = () => {
	return (
		<div>
			<div className='flex items-center space-x-3 justify-end pr-10 pt-10'>
				<Avatar>
					<AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<div> Dibora</div>
			</div>
			<div className='flex items-center justify-center space-x-5 font-bold my-20'>
				<FolderTree className='w-10 h-10' />
				<span className='text-4xl'>Department</span>
			</div>
			<div className='mx-auto md:w-11/12 md:pl-56'>
				<div className='grid grid-cols-12'>
					{departments.map((department, index) => (
						<div key={index} className='md:col-span-6 col-span-12 md:mr-6 md:ml-0 mx-2 mb-6'>
							<AdminCard name={department.name} />
						</div>
					))}
				</div>
			</div>
		
		</div>
	)
}

export default Page
