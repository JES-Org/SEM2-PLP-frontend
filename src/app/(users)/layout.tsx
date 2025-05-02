'use client'

import React from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'

import LeftSidebar from '@/components/LeftSideBar'

interface LayoutProps {
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const role = getCurrUser().role == 0 ? 'student' : 'teacher'

	return (
		<div>
			<LeftSidebar role={role} />
			<div>{children}</div>
		</div>
	)
}

export default Layout
