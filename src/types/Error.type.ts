import { SerializedError } from '@reduxjs/toolkit'

export interface ExtendedError extends SerializedError {
	staus: number
	data: {
		isSuccess?: boolean
		message?: string
		data?: any
		errors?: string[]
	}
}
