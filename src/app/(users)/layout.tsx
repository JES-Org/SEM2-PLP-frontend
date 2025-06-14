'use client'

import React, { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useRouter } from 'next/navigation'

import LeftSidebar from '@/components/LeftSideBar'

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
	const router = useRouter()
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	console.log('Layout currUser', getCurrUser())
	const [currUser, setCurrUser] = useState<any>(null)

	useEffect(() => {
		const user = getCurrUser()
		if (!user) {
			router.push('/auth/signin')
		} else {
			setCurrUser(user)
		}
	}, [])

	if (!currUser) {
		return null
	}

	const role = currUser.role === 0 ? 'student' : 'teacher'

	return (
		<div>
			<LeftSidebar role={role} />
			<div>{children}</div>
		</div>
	)
}

export default Layout
