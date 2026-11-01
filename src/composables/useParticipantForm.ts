import { reactive } from 'vue'
import type { ParticipantFormData } from '@/types/participant'
import { isRequired, isValidEmail, isValidPhone, isValidBirthDate } from '@/utils/validation'

export interface ParticipantFormErrors {
  name: string
  dateOfBirth: string
  email: string
  phone: string
}

type FieldName = keyof ParticipantFormErrors

const EMPTY_ERRORS: ParticipantFormErrors = {
  name: '',
  dateOfBirth: '',
  email: '',
  phone: ''
}

export function useParticipantForm(
  initial: ParticipantFormData,
  isEmailTaken: (email: string) => boolean
) {
  const form = reactive<ParticipantFormData>({ ...initial })
  const errors = reactive<ParticipantFormErrors>({ ...EMPTY_ERRORS })
  const touched = reactive<Record<FieldName, boolean>>({
    name: false,
    dateOfBirth: false,
    email: false,
    phone: false
  })

  function validateField(field: FieldName): boolean {
    const value = form[field]
    let message = ''

    if (!isRequired(value)) {
      message = "Це поле є обов'язковим."
    } else if (field === 'email' && !isValidEmail(value)) {
      message = 'Введіть коректну електронну адресу.'
    } else if (field === 'email' && isEmailTaken(value)) {
      message = 'Учасник з такою електронною поштою вже існує.'
    } else if (field === 'phone' && !isValidPhone(value)) {
      message = 'Телефон повинен бути у форматі +380XXXXXXXXX.'
    } else if (field === 'dateOfBirth' && !isValidBirthDate(value)) {
      message = 'Дата народження не може бути сьогоднішньою або у майбутньому.'
    }

    errors[field] = message
    return message === ''
  }

  function validateAll(): boolean {
    let valid = true
    for (const field of Object.keys(errors) as FieldName[]) {
      touched[field] = true
      if (!validateField(field)) valid = false
    }
    return valid
  }

  function handleBlur(field: FieldName): void {
    touched[field] = true
    validateField(field)
  }

  function resetForm(data: ParticipantFormData): void {
    Object.assign(form, data)
    for (const field of Object.keys(errors) as FieldName[]) {
      errors[field] = ''
      touched[field] = false
    }
  }

  return { form, errors, touched, validateField, validateAll, handleBlur, resetForm }
}
