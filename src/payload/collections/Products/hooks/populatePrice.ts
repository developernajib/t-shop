import type { FieldHook } from 'payload/types'

export const populatePrice: FieldHook = async ({ data, value }) => {
  if (typeof value === 'number') {
    return value
  }

  if (data?.priceJSON) {
    try {
      const parsed = JSON.parse(data.priceJSON)
      const unitAmount = parsed?.data?.[0]?.unit_amount
      if (typeof unitAmount === 'number') {
        return unitAmount
      }
    } catch {
      // fallback
    }
  }

  return value
}
