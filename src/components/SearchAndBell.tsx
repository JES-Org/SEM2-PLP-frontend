// components/SearchAndBell.tsx
import React from 'react'
import { Search } from 'lucide-react'
import { Input } from './ui/input'

interface Props {
	onSearchChange: (value: string) => void
}

const SearchAndBell = ({ onSearchChange }: Props) => {
	return (
		<div>
			<div className='relative flex items-center ml-7 mb-9'>
				<Search
					size={17}
					className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
				/>
				<Input
					placeholder='Search'
					onChange={(e) => onSearchChange(e.target.value)}
					className='py-2 md:px-16 px-10 mr-10 w-12/12'
				/>
			</div>
		</div>
	)
}

export default SearchAndBell
