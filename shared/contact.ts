import { z } from 'zod'

export const contactSubjects = ['A session with Shannon', 'Something else'] as const

export const contactFieldsSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(200, 'Please use 200 characters or fewer.'),
  email: z.string().trim().email('Please enter a valid email address.').max(254),
  phone: z.string().trim().max(100, 'Please use 100 characters or fewer.').default(''),
  subject: z.enum(contactSubjects),
  message: z
    .string()
    .trim()
    .min(10, 'Please write at least 10 characters.')
    .max(10000, 'Please use 10,000 characters or fewer.'),
  consent: z.boolean().refine((value) => value, 'Please agree so Shannon can reply to your message.')
})

export const contactSchema = contactFieldsSchema.extend({
  honeypot: z.string().max(1000).default(''),
  turnstileToken: z.string().min(1).max(2048)
})

export function contactEmail(data: z.output<typeof contactSchema>, from: string, to: string) {
  return {
    from,
    to: [to],
    reply_to: data.email,
    subject: `[Website enquiry] ${data.subject}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || 'Not provided'}`,
      `Subject: ${data.subject}`,
      'Consent to reply to this enquiry: yes',
      '',
      data.message
    ].join('\n')
  }
}
