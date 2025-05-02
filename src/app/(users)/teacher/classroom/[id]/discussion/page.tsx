'use client'

import { useState } from 'react'

import DiscussionChat from '@/components/DiscussionChat'

const Forum = () => {
	const [typing, setTyping] = useState(false)
	return (
		<div className='pl-72'>
			<DiscussionChat typing={typing} />
		</div>
	)
}
export default Forum
