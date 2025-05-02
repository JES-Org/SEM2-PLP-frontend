import TeacherClassroomNavbar from '@/components/layout/TeacherClassroomNavbar'

interface LayoutProps {
	role: string
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ role = 'teacher', children }) => {
	return (
		<div>
			<TeacherClassroomNavbar />
			<div>{children}</div>
		</div>
	)
}

export default Layout
