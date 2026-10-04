export const orderExample = {
  number: '№731',
  listPrice: 299_000,
  purchaseCost: 229_000,
  extraCost: 22_000,
  baselineDiscount: 5,
  targetMargin: 10,
} as const

export function calculateOrder(discountPercent: number) {
  const safeDiscount = Math.min(15, Math.max(0, discountPercent))
  const revenue = Math.round(orderExample.listPrice * (1 - safeDiscount / 100))
  const totalCost = orderExample.purchaseCost + orderExample.extraCost
  const profit = revenue - totalCost
  const margin = (profit / revenue) * 100
  const minimumPrice = Math.ceil(totalCost / (1 - orderExample.targetMargin / 100))

  return {
    revenue,
    totalCost,
    profit,
    margin,
    minimumPrice,
    atRisk: margin < orderExample.targetMargin,
  }
}

export const formatRubles = (value: number) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`
export const formatPercent = (value: number) =>
  `${new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)}%`
