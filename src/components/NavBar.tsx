'use client'

import React, { useEffect, useState } from 'react'

import { Cross1Icon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

const NavBar = () => {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true)
			} else {
				setIsScrolled(false)
			}
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	const toggle = () => {
		setIsOpen(!isOpen)
	}

	return (
		<nav
			className={`fixed top-0 left-0 w-full z-50 pt-7 pb-5 mb-5 ${
				isScrolled
					? 'bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg'
					: 'bg-transparent'
			}`}
		>
			<div className='w-full flex justify-between flex-wrap'>
				<div className='text-2xl font-bold md:ml-20 ml-3'>CustomEd</div>

				<div className='hidden md:flex flex-1 justify-end'>
					<div className='flex items-center'>
						<ul className='flex list-none'>
							<li className='mr-20'>
								<Link href='/auth/signin' className='bg-hover-blue hover:text-blue-500'>
									Login
								</Link>
							</li>
							<li className='mr-20'>
								<Link href='/auth/signup' className='bg-hover-blue hover:text-blue-500'>
									Register
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className='md:hidden flex items-center mr-5'>
					<button onClick={toggle}>
						{isOpen ? (
							<Cross1Icon width={30} height={30} />
						) : (
							<HamburgerMenuIcon width={30} height={30} />
						)}
					</button>
				</div>

				{isOpen && (
					<div className='md:hidden absolute top-full left-0 w-full bg-white z-50'>
						<div className='flex flex-col items-end mr-7 py-8'>
							<ul className='flex flex-col items-end'>
								<li className='my-3 relative'>
									<Link href='/auth/signin' className='bg-hover-blue hover:text-blue-500'>
										Login
									</Link>
								</li>
								<li className='my-3 relative'>
									<Link href='/auth/signup' className='bg-hover-blue hover:text-blue-500'>
										Register
									</Link>
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}

export default NavBar
