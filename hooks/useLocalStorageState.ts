import { useEffect, useState } from "react"

export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item !== null) {
        setState(JSON.parse(item))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsHydrated(true)
    }
  }, [key])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state, isHydrated])

  return [state, setState, isHydrated] as const
}
