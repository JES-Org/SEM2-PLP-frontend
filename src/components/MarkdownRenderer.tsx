/* eslint-disable react/no-children-prop */
import Link from 'next/link'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import gfm from 'remark-gfm'

const MarkdownRenderer = ({ content }: any) => {
	return (
		<ReactMarkdown
			children={content}
			remarkPlugins={[remarkBreaks, gfm]}
      components={{ a: CustomLink }}
		/>
	)
}

export default MarkdownRenderer

const CustomLink = ({
	children,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
	return (
		<Link
			href={props.href as string}
			className='text-blue-500 font-semibold underline underline-offset-2 cursor-pointer'
		>
			{children}
		</Link>
	)
}
