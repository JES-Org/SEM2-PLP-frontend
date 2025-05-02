import AllProviders from '@/providers/AllProviders'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

import StudentOnboardingDialog from '@/components/StudentOnboardingDialog'
import { Toaster } from '@/components/ui/sonner'
import TeacherOnboardingDialog from '@/components/TeacherOnboardingDialog'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'CustomEd',
	description: `A personalized learning path generator for students. Includes other classroom features such as announcement 
								, discussion forum, assessment with analytics, and more.`,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<AllProviders>
				<Toaster position='top-center' richColors />
				<StudentOnboardingDialog />
				<TeacherOnboardingDialog />
				<body className={inter.className}>{children}</body>
			</AllProviders>
		</html>
	)
}
