import { SideBarItem } from '@/types/SideNavItems'
import {
	Megaphone,
	MessageSquare,
	School,
	TabletSmartphone,
	User,
	Waypoints,
} from 'lucide-react'

export const StudentSideBarItems: SideBarItem[] = [
	{
		id: '1',
		text: 'Classroom',
		icon: <School size={25} />,
		path: '/student/classroom/classroom-list',
	},
	{
		id: '2',
		text: 'Learning Paths',
		icon: <Waypoints size={25} />,
		path: '/student/learning-path',
	},
	{
		id: '3',
		text: 'Profile',
		icon: <User size={25} />,
		path: '/student/profile',
	},
]
export const StudentRightSideBarItems: SideBarItem[] = [
	{
		id: '1',
		text: 'Announcement',
		icon: <Megaphone size={16} />,
		path: '/announcement',
	},
	{
		id: '2',
		text: 'Discussion',
		icon: <MessageSquare size={16} />,
		path: '/discussion',
	},
	{
		id: '3',
		text: 'Assessment',
		icon: <TabletSmartphone size={16} />,
		path: '/assessment',
	},
	{
		id: '4',
		text: 'Students',
		icon: <User size={16} />,
		path: '/students',
	},
]
