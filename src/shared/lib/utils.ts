import { twMerge } from 'tailwind-merge'
import type { TClassValue } from './types'

export function cn(...inputs: TClassValue[]) {
  const tokens: string[] = []
  const visit = (value: TClassValue): void => {
    if (!value) return
    if (typeof value === 'string' || typeof value === 'number') tokens.push(String(value))
    else if (Array.isArray(value)) value.forEach(visit)
    else
      Object.entries(value).forEach(([key, enabled]) => {
        if (enabled) tokens.push(key)
      })
  }
  inputs.forEach(visit)
  return twMerge(tokens.join(' '))
}
