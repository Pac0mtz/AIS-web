import { useState } from 'react'
import type { FormEvent } from 'react'

export function useEmailDraft(subject: string) {
  const [notice, setNotice] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const lines = Array.from(form.querySelectorAll<HTMLElement>('[data-email-label]'))
      .map(field => [field.dataset.emailLabel || '', (field as HTMLInputElement).value.trim()] as const)
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
    setNotice('Your email app will open a draft. Review it and press Send there.')
    window.location.href = `${form.action}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }
  return { notice, submit }
}
