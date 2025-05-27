'use client'

import { useState } from 'react'

import DiscussionChat from '@/components/DiscussionChat'

const Forum = () => {
	const [typing, setTyping] = useState(false)
	return (
		<div className='md:pl-72 pl-3 h-[calc(100vh-5rem)]'>
			<DiscussionChat typing={typing} />
		</div>
	)
}
export default Forum
