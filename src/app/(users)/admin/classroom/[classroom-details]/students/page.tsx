'use client'

import React, { useState } from 'react'

import { UserRoundPlus, Users } from 'lucide-react'

import AdminStudentList from '@/components/AdminStudentList'
import SearchAndBell from '@/components/SearchAndBell'

const Page = () => {
	const [searchTerm, setSearchTerm] = useState('')
	return (
		<div className='pt-20'>
			<div className='flex justify-end item-center w-full space-x-3 my-6'>
				<SearchAndBell onSearchChange={setSearchTerm} />
			</div>
			<div className='flex justify-center item-center w-full space-x-3 my-6'>
				<UserRoundPlus size={30} />
				<div className='mx-auto text-3xl font-bold'>Teacher</div>
			</div>
			<div className='space-y-4'>
				<AdminStudentList name='Shad' />
			</div>
			<div className='flex space-x-3 justify-center item-center w-full my-6'>
				<Users size={30} />
				<div className='mx-auto text-3xl font-bold'>Student</div>
			</div>
			<div className='space-y-4'>
				<AdminStudentList name='Shad' />
				<AdminStudentList name='Shad' />
				<AdminStudentList name='Shad' />
			</div>
		</div>
	)
}

export default Page
