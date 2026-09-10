import { z } from 'zod'
import { parseISO, isBefore, isAfter } from 'date-fns'
import formCodesData from '../data/form-codes.json'

// TypeScript interfaces
interface FormCode {
  code: string
  validFrom: string
  validUntil: string
  formType: string
}

interface ValidationResponse {
  valid: boolean
  error?: string
  details?: z.ZodError
}

// Zod schema for request body validation
const validateCodeRequestSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  formType: z.string().min(1, 'Form type is required')
})

export default defineEventHandler(async (event): Promise<ValidationResponse> => {
  // Only allow POST requests
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return {
      valid: false,
      error: 'Method not allowed. Only POST requests are supported.'
    }
  }

  try {
    // Read from request body
    const body = await readBody(event)
    const validationResult = validateCodeRequestSchema.safeParse(body)

    if (!validationResult.success) {
      setResponseStatus(event, 400)
      return {
        valid: false,
        error: 'Validation failed',
        details: validationResult.error
      }
    }

    const { code, formType } = validationResult.data

    // Use imported form codes data (bundled in build)
    const formCodes: FormCode[] = formCodesData

    // Find matching code (case-insensitive comparison)
    const matchingCode = formCodes.find(
      (fc) => fc.code.toLowerCase() === code.toLowerCase() && fc.formType.toLowerCase() === formType.toLowerCase()
    )
    console.log('matchingCode', matchingCode)
    if (!matchingCode) {
      setResponseStatus(event, 404)
      return {
        valid: false,
        error: 'Code is not valid'
      }
    }

    // Parse dates using date-fns for consistent UTC handling
    // Append 'T00:00:00Z' to ensure UTC parsing of date-only strings, then normalize to start of day
    const parseUTCDate = (dateString: string): Date => {
      const parsed = parseISO(`${dateString}T00:00:00Z`)
      // Ensure we're working with UTC dates at start of day
      return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate(), 0, 0, 0, 0))
    }

    // Get today's date in UTC for consistent comparison
    const now = new Date()
    const todayUTCString = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`
    const today = parseUTCDate(todayUTCString)
    const validFromDate = parseUTCDate(matchingCode.validFrom)
    const validUntilDate = parseUTCDate(matchingCode.validUntil)
    console.log('today', today)
    console.log('validFromDate', validFromDate)
    console.log('validUntilDate', validUntilDate)
    // Check if today is before validFrom (not yet valid)
    // Code is valid only if today >= validFrom
    if (isBefore(today, validFromDate)) {
      setResponseStatus(event, 400)
      return {
        valid: false,
        error: 'Code is not yet valid'
      }
    }

    // Check if today is after validUntil (expired)
    // Code is valid only if today <= validUntil
    if (isAfter(today, validUntilDate)) {
      setResponseStatus(event, 400)
      return {
        valid: false,
        error: 'Code has expired'
      }
    }

    // Code is valid
    setResponseStatus(event, 200)
    return {
      valid: true
    }
  } catch (error) {
    setResponseStatus(event, 500)
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }
  }
})
