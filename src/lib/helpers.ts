import { format, isValid,formatDistanceToNowStrict } from 'date-fns'

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

export const toLocalDateTime = (dateStr: string) => {
  const date = new Date(Date.parse(dateStr));

  if (!isValid(date)) {
    console.warn("Invalid date in toLocalDateTime:", dateStr);
    return "Invalid date/time";
  }

  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const timeAgo = (dateStr: string) => {
  const date = new Date(dateStr)

  if (!isValid(date)) {
    console.warn("Invalid date in timeAgo:", dateStr)
    return "Invalid time"
  }

  const diff = formatDistanceToNowStrict(date, {
    addSuffix: true,
    roundingMethod: 'floor',
  })

  if (diff.startsWith('0 seconds ') || diff === 'less than a minute ago') {
    return 'just now'
  }

  return diff
}
