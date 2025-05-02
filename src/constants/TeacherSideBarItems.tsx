import { SideBarItem } from '@/types/SideNavItems'
import {
	BarChart3,
	Megaphone,
	MessageSquare,
	MessagesSquare,
	School,
	TabletSmartphone,
	User,
	Users,
} from 'lucide-react'

export const TeacherSideBarItems: SideBarItem[] = [
	{
		id: '1',
		text: 'Classroom',
		icon: <School size={25} />,
		path: '/teacher/classroom/classroom-list',
	},
	{
		id: '2',
		text: 'Profile',
		icon: <User size={25} />,
		path: '/teacher/profile',
	},
	{
		id: '3',
		text: 'Messages',
		icon: <MessagesSquare size={25} />,
		path: '/',
	},
]
export const TeacherRightSideBarItems: SideBarItem[] = [
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
		text: 'Analytics',
		icon: <BarChart3 size={16} />,
		path: '/analytics',
	},
	{
		id: '5',
		text: 'Students',
		icon: <Users size={16} />,
		path: '/students',
	},
]
