'use server'

import { isValidContactSubject } from '@/lib/contact-data'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { ContactState } from './types'

const MAX_MESSAGE_LENGTH = 4000

export async function submitContactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      error:
        'Contact form is temporarily unavailable. Please message us on Instagram in the meantime.',
    }
  }

  const fullName = String(formData.get('full_name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const subject = String(formData.get('subject') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!fullName || !email || !message) {
    return { ok: false, error: 'Name, email, and message are required.' }
  }

  if (!isValidContactSubject(subject)) {
    return { ok: false, error: 'Please select a subject.' }
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: `Message must be ${MAX_MESSAGE_LENGTH.toLocaleString()} characters or fewer.`,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error: insertError } = await supabase.from('contact_messages').insert({
    full_name: fullName,
    email,
    subject,
    message,
  })

  if (insertError) {
    console.error('submitContactAction insert', insertError)
    return { ok: false, error: 'Could not send your message. Please try again.' }
  }

  return { ok: true, success: true }
}
