export function calcPercentageOf(percent: number, total: number): number {
  if (isNaN(percent) || isNaN(total)) return 0
  return (percent / 100) * total
}

export function calcWhatPercent(portion: number, total: number): number {
  if (isNaN(portion) || isNaN(total) || total === 0) return 0
  return (portion / total) * 100
}

export interface PercentageChangeResult {
  percentChange: number
  isIncrease: boolean
  difference: number
}

export function calcPercentageChange(fromVal: number, toVal: number): PercentageChangeResult {
  if (isNaN(fromVal) || isNaN(toVal) || fromVal === 0) {
    return { percentChange: 0, isIncrease: toVal >= fromVal, difference: toVal - fromVal }
  }
  const diff = toVal - fromVal
  const percentChange = (diff / Math.abs(fromVal)) * 100
  return {
    percentChange,
    isIncrease: diff >= 0,
    difference: diff,
  }
}

export interface DiscountResult {
  originalPrice: number
  primaryDiscountAmount: number
  couponDiscountAmount: number
  totalDiscountAmount: number
  taxAmount: number
  finalPrice: number
  effectiveSavingsPercent: number
}

export function calcDiscount(
  originalPrice: number,
  discountValue: number,
  isPercent: boolean,
  extraCouponPercent = 0,
  taxPercent = 0
): DiscountResult {
  const orig = Math.max(0, originalPrice)
  const disc = Math.max(0, discountValue)
  const coupon = Math.max(0, extraCouponPercent)
  const tax = Math.max(0, taxPercent)

  const primaryDiscountAmount = isPercent ? (disc / 100) * orig : Math.min(orig, disc)
  const priceAfterPrimary = Math.max(0, orig - primaryDiscountAmount)

  const couponDiscountAmount = (coupon / 100) * priceAfterPrimary
  const priceAfterCoupon = Math.max(0, priceAfterPrimary - couponDiscountAmount)

  const taxAmount = (tax / 100) * priceAfterCoupon
  const finalPrice = priceAfterCoupon + taxAmount

  const totalDiscountAmount = primaryDiscountAmount + couponDiscountAmount
  const effectiveSavingsPercent = orig > 0 ? (totalDiscountAmount / orig) * 100 : 0

  return {
    originalPrice: orig,
    primaryDiscountAmount,
    couponDiscountAmount,
    totalDiscountAmount,
    taxAmount,
    finalPrice,
    effectiveSavingsPercent,
  }
}

export interface AgeResult {
  years: number
  months: number
  days: number
  totalMonths: number
  totalWeeks: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  nextBirthday: {
    daysRemaining: number
    dayOfWeek: string
    dateString: string
  }
}

export function calcAge(birthDateStr: string, targetDateStr?: string): AgeResult | null {
  if (!birthDateStr) return null

  const birthDate = new Date(birthDateStr)
  if (isNaN(birthDate.getTime())) return null

  const targetDate = targetDateStr ? new Date(targetDateStr) : new Date()
  if (isNaN(targetDate.getTime())) return null

  if (targetDate < birthDate) return null

  let years = targetDate.getFullYear() - birthDate.getFullYear()
  let months = targetDate.getMonth() - birthDate.getMonth()
  let days = targetDate.getDate() - birthDate.getDate()

  if (days < 0) {
    months--
    // Days in previous month of targetDate
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  // Total time metrics
  const diffTimeMs = targetDate.getTime() - birthDate.getTime()
  const totalDays = Math.floor(diffTimeMs / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months
  const totalHours = totalDays * 24
  const totalMinutes = totalHours * 60

  // Next birthday calculation
  const currentYear = targetDate.getFullYear()
  let nextBday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate())
  if (nextBday < targetDate) {
    nextBday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate())
  }

  const msToNext = nextBday.getTime() - targetDate.getTime()
  const daysRemaining = Math.max(0, Math.ceil(msToNext / (1000 * 60 * 60 * 24)))

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayOfWeek = dayNames[nextBday.getDay()]

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    nextBirthday: {
      daysRemaining,
      dayOfWeek,
      dateString: nextBday.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    },
  }
}
