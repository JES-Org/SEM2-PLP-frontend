'use client'

import * as React from 'react'

import { StudentRightSideBarItems } from '@/constants/StudentSideBarItems'
import { setCurrClassroomId } from '@/store/features/classroomSlice'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import { cn } from '@/lib/utils'

import {
	NavigationMenu,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'

const StudentClassroomNavbar = () => {
	const dispatch = useDispatch()
	const currPath = usePathname()
	const basePath = currPath.split('/')
	console.log(currPath)
	dispatch(setCurrClassroomId(basePath[3]))

	// console.log(`currPath ${currPath}`)
	// console.log(basePath)
	const router = useRouter()

	const handleRouting = (newRoute: string) => {
		let lastPopped = ''
		while (basePath[basePath.length - 1] !== 'classroom') {
			lastPopped = basePath.pop() as string
		}
		// console.log(basePath)
		// console.log(lastPopped, newRoute)
		basePath.push(lastPopped)
		basePath.push(newRoute)
		router.push(basePath.join('/'))
	}
	return (
		<div className='pl-96 pt-10'>
			<NavigationMenu>
				<NavigationMenuList>
					{StudentRightSideBarItems.map((item, i) => (
						<div key={i}>
							<NavigationMenuLink
								className={cn(navigationMenuTriggerStyle(), 'cursor-pointer', {
									'bg-accent text-accent-foreground': currPath.includes(
										item.text.toLowerCase(),
									),
								})}
								onClick={() => handleRouting(item.path)}
							>
								<div
									className={cn(
										'inline-flex justify-center items-center gap-x-2',
									)}
								>
									{item.icon}
									<p>{item.text}</p>
								</div>
							</NavigationMenuLink>
							<Separator orientation='vertical' />
						</div>
					))}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	)
}

export default StudentClassroomNavbar
