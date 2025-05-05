'use client'

export const useLocalStorage = (key: string) => {
  const isBrowser = typeof window !== 'undefined'

  const setItem = (value: unknown) => {
    if (!isBrowser) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log(`useLocalStorage error: ${error}`)
    }
  }

  const getItem = () => {
    if (!isBrowser) return undefined
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : undefined
    } catch (error) {
      console.log(`useLocalStorage error: ${error}`)
      return undefined
    }
  }

  const removeItem = () => {
    if (!isBrowser) return
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.log(`useLocalStorage error: ${error}`)
    }
  }

  return { setItem, getItem, removeItem }
}
