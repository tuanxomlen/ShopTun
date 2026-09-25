export const formatVnd = (n) => Math.round(n).toLocaleString('vi-VN') + '₫'

export const formatSold = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k'
  return String(n)
}
