import { SideBarItem } from '@/types/SideNavItems'
import {
	Megaphone,
	MessageSquare,
	School,
	User,
	UsersRound,
} from 'lucide-react'

export const AdminSideBarItems: SideBarItem[] = [
	{
		id: '1',
		text: 'Classroom',
		icon: <School size={25} />,
		path: '/',
	},
	{
		id: '2',
		text: 'Profile',
		icon: <User size={25} />,
		path: '/',
	},
	{
		id: '3',
		text: 'Messages',
		icon: <MessageSquare size={25} />,
		path: '/',
	},
]
export const AdminRightSideBarItems: SideBarItem[] = [
	{
		id: '1',
		text: 'Announcement',
		icon: <Megaphone size={25} />,
		path: '/',
	},
	{
		id: '2',
		text: 'Forum',
		icon: <MessageSquare size={25} />,
		path: '/',
	},
	{
		id: '2',
		text: 'Student',
		icon: <UsersRound size={25} />,
		path: '/',
	},
]
