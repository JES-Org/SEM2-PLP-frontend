import StudentClassroomNavbar from '@/components/layout/StudentClassroomNavbar'

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<div>
			<StudentClassroomNavbar />
			<div>{children}</div>
		</div>
	)
}

export default Layout
