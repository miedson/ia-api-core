const CPF_LENGTH = 11
const CPF_BASE_DIGITS_COUNT = 9

const CPF_FIRST_CHECK_DIGIT_WEIGHT = 10
const CPF_SECOND_CHECK_DIGIT_WEIGHT = 11

const CNPJ_LENGTH = 14

const CNPJ_FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const CNPJ_SECOND_WEIGHTS = [6, ...CNPJ_FIRST_WEIGHTS]

export const onlyDigits = (value: string) => value.replace(/\D/g, '')

const calculateWeightedSum = (value: string, weights: number[]) =>
  weights.reduce((sum, weight, i) => sum + Number(value[i]) * weight, 0)

export function validateCPF(value: string): boolean {
  const cpf = onlyDigits(value)

  if (cpf.length !== CPF_LENGTH) return false
  if (/^(\d)\1+$/.test(cpf)) return false

  const firstSum = Array.from(
    { length: CPF_BASE_DIGITS_COUNT },
    (_, i) => CPF_FIRST_CHECK_DIGIT_WEIGHT - i,
  ).reduce((sum, weight, i) => sum + Number(cpf[i]) * weight, 0)

  let firstCheckDigit = (firstSum * 10) % 11
  if (firstCheckDigit === 10) firstCheckDigit = 0

  if (firstCheckDigit !== Number(cpf[9])) return false

  const secondSum = Array.from(
    { length: CPF_BASE_DIGITS_COUNT + 1 },
    (_, i) => CPF_SECOND_CHECK_DIGIT_WEIGHT - i,
  ).reduce((sum, weight, i) => sum + Number(cpf[i]) * weight, 0)

  let secondCheckDigit = (secondSum * 10) % 11
  if (secondCheckDigit === 10) secondCheckDigit = 0

  return secondCheckDigit === Number(cpf[10])
}

export function validateCNPJ(value: string): boolean {
  const cnpj = onlyDigits(value)

  if (cnpj.length !== CNPJ_LENGTH) return false
  if (/^(\d)\1+$/.test(cnpj)) return false

  const firstSum = calculateWeightedSum(cnpj, CNPJ_FIRST_WEIGHTS)

  let firstCheckDigit = firstSum % 11
  firstCheckDigit = firstCheckDigit < 2 ? 0 : 11 - firstCheckDigit

  if (firstCheckDigit !== Number(cnpj[12])) return false

  const secondSum = calculateWeightedSum(cnpj, CNPJ_SECOND_WEIGHTS)

  let secondCheckDigit = secondSum % 11
  secondCheckDigit = secondCheckDigit < 2 ? 0 : 11 - secondCheckDigit

  return secondCheckDigit === Number(cnpj[13])
}
