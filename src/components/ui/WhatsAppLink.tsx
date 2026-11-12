'use client'

import type { ComponentProps, ReactNode } from 'react'
import { track } from '@/lib/analytics'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * The one WhatsApp link.
 *
 * Every "Ask on WhatsApp" control on the public site goes through here, so
 * each tap is counted once as a `whatsapp_click` event labelled with the
 * button that was tapped (`cta_location`) before WhatsApp opens. The message
 * the parent sends carries no code of any kind: attribution lives in the
 * aggregate daily counts, never in the chat.
 *
 * `location` is lower snake case (`hero`, `final_cta`, `centre_jubilee_hills`)
 * and is the label the admin dashboard groups by. Styling is the caller's:
 * pass the same classes a `ButtonLink` would carry (`btn btn-secondary`) or a
 * text-link class (`link`, `link-arrow`).
 */
export function WhatsAppLink({
  location,
  message,
  className,
  children,
  ...rest
}: {
  location: string
  message?: string
  className?: string
  children: ReactNode
} & Omit<ComponentProps<'a'>, 'href' | 'target' | 'rel' | 'onClick' | 'className' | 'children'>) {
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track('whatsapp_click', { cta_location: location })}
      {...rest}
    >
      {children}
    </a>
  )
}
