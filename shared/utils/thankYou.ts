export type ThankYouVariant = 'free' | 'paid'
export type ThankYouLocale = 'en' | 'nl'
export type ThankYouCopy = {
  statusLabel: string
  heading: string
  message: string
  helpText: string
  downloadsHeading: string
}
export type ThankYouDocument = Partial<ThankYouCopy> & {
  messageText?: string
  productSlug?: string
  variant: ThankYouVariant
  locale: ThankYouLocale
}

export function defaultThankYouCopy(variant: ThankYouVariant, locale: ThankYouLocale): ThankYouCopy {
  return locale === 'nl'
    ? {
        statusLabel: 'Bestelling ontvangen',
        heading: variant === 'free' ? 'Je cadeau staat voor je klaar' : 'Bedankt voor je bestelling',
        message:
          variant === 'free'
            ? 'Bedankt dat je deze stap voor jezelf zet. Je kunt hieronder je bestanden downloaden.'
            : 'Je bestelling is ontvangen. Hieronder vind je je downloads en de volgende stappen.',
        helpText: 'Je ontvangt ook een bevestiging per e-mail.',
        downloadsHeading: 'Je downloads'
      }
    : {
        statusLabel: 'Order received',
        heading: variant === 'free' ? 'Your gift is ready' : 'Thank you for your order',
        message:
          variant === 'free'
            ? 'Thank you for taking this step for yourself. You can download your files below.'
            : 'Your order has been received. Your downloads and next steps are below.',
        helpText: 'You will also receive a confirmation email.',
        downloadsHeading: 'Your downloads'
      }
}

export function resolveThankYouCopy(
  documents: ThankYouDocument[],
  slug: string,
  variant: ThankYouVariant,
  locale: ThankYouLocale
): ThankYouCopy {
  const copy = defaultThankYouCopy(variant, locale)
  for (const productSlug of ['', slug]) {
    const document = documents.find(
      (item) => (item.productSlug || '') === productSlug && item.variant === variant && item.locale === locale
    )
    if (!document) {
      continue
    }
    for (const key of Object.keys(copy) as Array<keyof ThankYouCopy>) {
      const value = (key === 'message' ? document.messageText || document.message : document[key])?.trim()
      if (value) {
        copy[key] = value
      }
    }
  }
  return copy
}
