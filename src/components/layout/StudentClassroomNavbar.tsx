'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { usePathname, useRouter } from 'next/navigation'

import { StudentRightSideBarItems } from '@/constants/StudentSideBarItems'
import { setCurrClassroomId } from '@/store/features/classroomSlice'
import { cn } from '@/lib/utils'

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const StudentClassroomNavbar = () => {
  const dispatch = useDispatch()
  const currPath = usePathname()
  const basePath = currPath.split('/')
  const router = useRouter()

  // Set current classroom ID
  useEffect(() => {
    dispatch(setCurrClassroomId(basePath[3]))
  }, [currPath])

  const handleRouting = (newRoute: string) => {
    const pathCopy = [...basePath]
    let lastPopped = ''
    while (pathCopy[pathCopy.length - 1] !== 'classroom') {
      lastPopped = pathCopy.pop() as string
    }
    pathCopy.push(lastPopped)
    pathCopy.push(newRoute)
    router.push(pathCopy.join('/'))
  }

  return (
    <div className='pt-10 md:pl-96'>
      {/* Desktop Nav */}
      <div className='hidden md:flex'>
        <NavigationMenu>
          <NavigationMenuList>
            {StudentRightSideBarItems.map((item, i) => (
              <div key={i}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'cursor-pointer',
                    {
                      'bg-accent text-accent-foreground': currPath.includes(
                        item.text.toLowerCase(),
                      ),
                    },
                  )}
                  onClick={() => handleRouting(item.path)}
                >
                  <div className='inline-flex justify-center items-center gap-x-2'>
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

      {/* Mobile Dropdown */}
      <div className='flex md:hidden justify-end pr-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='flex items-center gap-x-2'>
              <Menu className='w-5 h-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {StudentRightSideBarItems.map((item, i) => (
              <DropdownMenuItem
                key={i}
                onClick={() => handleRouting(item.path)}
                className={cn('cursor-pointer', {
                  'bg-accent text-accent-foreground': currPath.includes(
                    item.text.toLowerCase(),
                  ),
                })}
              >
                <div className='inline-flex items-center gap-x-2'>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default StudentClassroomNavbar
