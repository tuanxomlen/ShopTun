export const vouchers = {
  SALE10: { label: 'Giảm 10% tổng đơn', type: 'percent', value: 10 },
  FREESHIP: { label: 'Miễn phí vận chuyển (giảm 20.000₫)', type: 'flat', value: 20000 },
  SALE50K: { label: 'Giảm 50.000₫ cho đơn từ 300.000₫', type: 'flat', value: 50000, minTotal: 300000 },
}

export function applyVoucher(code, total) {
  const v = vouchers[code?.trim().toUpperCase()]
  if (!v) return { ok: false, message: 'Mã giảm giá không hợp lệ.' }
  if (v.minTotal && total < v.minTotal) {
    return { ok: false, message: `Đơn hàng cần tối thiểu ${v.minTotal.toLocaleString('vi-VN')}₫ để dùng mã này.` }
  }
  const discount = v.type === 'percent' ? Math.round(total * (v.value / 100)) : v.value
  return { ok: true, code: code.trim().toUpperCase(), label: v.label, discount: Math.min(discount, total) }
}
