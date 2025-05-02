import React from 'react'

import RightSidebar from '@/components/RightSideBar'

interface LayoutProps {
	role: string
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ role = 'teacher', children }) => {
	return (
		<div className='layout bg-slate-100'>
			<div className='content'>{children}</div>
		</div>
	)
}

export default Layout
