
// @ts-nocheck
import { Users } from 'lucide-react'
import { EllipsisVertical } from './Icons'
import { Card, CardFooter, CardHeader, CardTitle } from './ui/card'
import {  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger  } from './ui/dropdown-menu'

const ClassroomCard = ({ classroom, router, onArchiveToggle, onDelete }) => (
	<div
		className='w-full mb-2 hover:border hover:border-primary hover:rounded-xl transition duration-300 cursor-pointer'
		onClick={() => router.push(`/teacher/classroom/${classroom.id}/announcement`)}
	>
		<Card>
			<CardHeader className='flex flex-row justify-between'>
				<CardTitle>{classroom.name}</CardTitle>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<EllipsisVertical className='h-4 w-4' />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							className='hover:bg-muted cursor-pointer'
							onClick={(e) => {
								e.stopPropagation()
								onArchiveToggle(classroom.id, classroom.is_archived)
							}}
						>
							{classroom.is_archived ? 'Unarchive' : 'Archive'}
						</DropdownMenuItem>
						<DropdownMenuItem
							className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
							onClick={(e) => {
								e.stopPropagation()
								onDelete(classroom.id)
							}}
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>

			<CardFooter>
				<div className='flex items-center w-full justify-between'>
					<div className='flex items-center'>
						<Users size={20} className='mr-2' />
						<p>{classroom.members?.length}</p>
					</div>
					<p>{classroom.courseNo}</p>
				</div>
			</CardFooter>
		</Card>
	</div>
)

export default ClassroomCard;