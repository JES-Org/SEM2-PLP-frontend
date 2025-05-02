import StudentClassroomNavbar from '@/components/layout/StudentClassroomNavbar'

interface LayoutProps {
	role: string
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ role = 'student', children }) => {
	return (
		<div>
			<StudentClassroomNavbar />
			<div>{children}</div>
		</div>
	)
}

export default Layout
