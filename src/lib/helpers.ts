import { format, isValid } from 'date-fns'

export const makeDateReadable = (dateStr: string) => {
  const date = new Date(Date.parse(dateStr))

  if (!isValid(date)) {
    console.warn("Invalid date in makeDateReadable:", dateStr)
    return "Invalid date"
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const extractTime = (dateStr: string) => {
  const date = new Date(Date.parse(dateStr))

  if (!isValid(date)) {
    console.warn("Invalid date in extractTime:", dateStr)
    return "Invalid time"
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })
}

export const toMonthAndDay = (dateString: string) => {
  const date = new Date(dateString)

  if (!isValid(date)) {
    console.warn("Invalid date in toMonthAndDay:", dateString)
    return "Invalid date"
  }

  return format(date, 'MMMM dd')
}
