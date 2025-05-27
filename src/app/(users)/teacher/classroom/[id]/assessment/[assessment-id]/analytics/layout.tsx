import React from 'react'

import RightSidebar from '@/components/RightSideBar'

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<div className='layout bg-slate-100'>
			<div className='content'>{children}</div>
		</div>
	)
}

export default Layout
