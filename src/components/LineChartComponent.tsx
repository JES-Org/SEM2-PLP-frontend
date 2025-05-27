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
  Label,
  ReferenceLine,
} from 'recharts'

import '@/styles/LineChartContainer.css'

type ScoreData = { studentName: string; result: number }[];

import type { TooltipProps } from 'recharts';

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-md shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{`${payload[0].payload.studentName}`}</p>
        <p className="font-bold text-lg text-indigo-600">
          Score: {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

const LineChartComponent = ({ data }: { data: ScoreData }) => {
  const averageScore = data && data.length > 0 
    ? data.reduce((sum, item) => sum + item.result, 0) / data.length 
    : 0;
  
  const maxScore = data && data.length > 0
    ? Math.max(...data.map(item => item.result))
    : 20;
  
  const yAxisMax = Math.ceil(maxScore * 1.1);
  
  const sortedData = [...data].sort((a, b) => a.result - b.result);
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">No score data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg font-medium text-center mb-6 text-gray-800">
        Student Score Distribution
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={sortedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            hide={true} 
            dataKey="studentName" 
            padding={{ left: 20, right: 20 }}
          />
          <YAxis 
            domain={[0, yAxisMax]} 
            tickCount={5}
            allowDecimals={false}
            stroke="#94a3b8"
          >
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: '#64748b', fontSize: 14 }}
              value="Score"
            />
          </YAxis>
          <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
          <Legend
            verticalAlign="top"
            height={40}
            iconType="circle"
            formatter={(value) => <span className="text-gray-700 font-medium">Student Scores</span>}
          />
          
          <ReferenceLine 
            y={averageScore} 
            stroke="#9333ea" 
            strokeDasharray="3 3"
            strokeWidth={2}>
            <Label 
              value={`Avg: ${averageScore.toFixed(1)}`} 
              position="right"
              fill="#9333ea"
              fontSize={12}
            />
          </ReferenceLine>
          
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          
          <Line
            type="monotone"
            dataKey="result"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4, fill: 'white' }}
            activeDot={{
              r: 8,
              stroke: '#8884d8',
              strokeWidth: 2,
              fill: '#c4b5fd'
            }}
            name="Student Scores"
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LineChartComponent
