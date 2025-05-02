import React from "react"

interface SVGComponentProps extends React.SVGProps<SVGSVGElement> {}

export const EllipsisVertical = (props: SVGComponentProps) => {
	return (
		<svg
      {...props}
			xmlns='http://www.w3.org/2000/svg'
			fill='#1A1C1F'
			stroke='#1A1C1F'
			viewBox='0 0 512 512'
		>
			<circle cx='256' cy='256' r='48' />
			<circle cx='256' cy='416' r='48' />
			<circle cx='256' cy='96' r='48' />
		</svg>
	)
}
