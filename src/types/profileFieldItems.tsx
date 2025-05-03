export interface profileFieldItems {
	icon: React.ReactNode
	text: string
	value: string
	setError: (error: string) => void
	onChange: (value: string) => void
}
export interface nonEditableProfileFieldItems {
	icon: React.ReactNode
	text: string
	value: string
}
