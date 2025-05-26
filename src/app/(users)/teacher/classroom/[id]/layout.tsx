import TeacherClassroomNavbar from '@/components/layout/TeacherClassroomNavbar'

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({children }:LayoutProps) => {
	return (
		<div>
			<TeacherClassroomNavbar />
			<div>{children}</div>
		</div>
	)
}

export default Layout
