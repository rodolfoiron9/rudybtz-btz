import { describe, it, expect } from 'vitest'
import { formatDuration } from '@/lib/utils'

describe('Utils Functions', () => {
  describe('formatDuration', () => {
    it('should format seconds to MM:SS format', () => {
      expect(formatDuration(65)).toBe('1:05')
      expect(formatDuration(125)).toBe('2:05')
      expect(formatDuration(0)).toBe('0:00')
    })

    it('should handle edge cases', () => {
      expect(formatDuration(3661)).toBe('61:01') // Over 1 hour
      expect(formatDuration(59)).toBe('0:59')
      expect(formatDuration(60)).toBe('1:00')
    })

    it('should handle invalid inputs gracefully', () => {
      expect(formatDuration(-1)).toBe('0:00')
      expect(formatDuration(NaN)).toBe('0:00')
      expect(formatDuration(Infinity)).toBe('0:00')
    })
  })
})