'use client'

import React from 'react'

import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import '@/styles/LineChartContainer.css'

const mockData = [
	{ name: 'John', result: 85 },
	{ name: 'Alice', result: 92 },
	{ name: 'Bob', result: 78 },
	{ name: 'Emma', result: 95 },
	{ name: 'Michael', result: 88 },
	{ name: 'Sophia', result: 90 },
	{ name: 'James', result: 83 },
	{ name: 'Olivia', result: 89 },
	{ name: 'William', result: 79 },
	{ name: 'Emily', result: 94 },
]

const LineChartComponent = () => {
	return (
		<div>
			<ResponsiveContainer width='100%' height={400}>
				<LineChart data={mockData}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis hide={true} dataKey='name' />
					<YAxis />
					<Tooltip />

					<Legend />
					<Line
						type='monotone'
						dataKey='result'
						stroke='#8884d8'
						activeDot={{
							r: 8,
						}}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default LineChartComponent
