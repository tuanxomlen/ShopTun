export const categories = [
  { id: 'ao', name: 'Áo', emoji: '👕' },
  { id: 'quan', name: 'Quần', emoji: '👖' },
  { id: 'giay', name: 'Giày', emoji: '👟' },
  { id: 'phukien', name: 'Phụ kiện', emoji: '🎒' },
]

const mkReviews = (seed) => ([
  { author: 'Minh T.', rating: 5, comment: 'Chất lượng tốt, đúng mô tả, giao nhanh.' },
  { author: 'Ngọc H.', rating: 4, comment: 'Ổn trong tầm giá, đóng gói cẩn thận.' },
  { author: 'Quang D.', rating: seed % 2 === 0 ? 5 : 3, comment: 'Sẽ ủng hộ shop lần sau.' },
])

export const products = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85', name: 'Áo thun cotton basic', category: 'ao', price: 99000, originalPrice: 159000, emoji: '👕', color: '#fde8e4', rating: 4.8, reviewCount: 2140, sold: 4200, freeship: true, stock: 50,
    desc: '100% cotton co giãn nhẹ, thấm hút mồ hôi tốt, form unisex mặc thoải mái cả ngày. Phù hợp mặc đi học, đi làm hoặc phối đồ thể thao.',
    variants: { colors: ['Trắng', 'Đen', 'Xám'], sizes: ['S', 'M', 'L', 'XL'] }, reviews: mkReviews(1) },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85', name: 'Quần jean slimfit co giãn', category: 'quan', price: 259000, originalPrice: 399000, emoji: '👖', color: '#e3ecfb', rating: 4.6, reviewCount: 856, sold: 1800, freeship: true, stock: 30,
    desc: 'Form slimfit tôn dáng, vải denim pha spandex co giãn 4 chiều, không bai gối sau thời gian dài sử dụng.',
    variants: { colors: ['Xanh đậm', 'Xanh nhạt', 'Đen'], sizes: ['29', '30', '31', '32', '33'] }, reviews: mkReviews(2) },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85', name: 'Giày sneaker năng động', category: 'giay', price: 449000, originalPrice: 699000, emoji: '👟', color: '#fff3d6', rating: 4.9, reviewCount: 3210, sold: 6100, freeship: true, stock: 20,
    desc: 'Đế cao su non siêu nhẹ, êm chân cả ngày, thiết kế trẻ trung dễ phối nhiều phong cách.',
    variants: { colors: ['Trắng', 'Đen', 'Trắng-đỏ'], sizes: ['38', '39', '40', '41', '42'] }, reviews: mkReviews(3) },
  { id: 4, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85', name: 'Balo laptop chống nước', category: 'phukien', price: 199000, originalPrice: 259000, emoji: '🎒', color: '#e5f7ec', rating: 4.7, reviewCount: 1290, sold: 2500, freeship: false, stock: 40,
    desc: 'Vải chống nước, ngăn riêng laptop 15.6 inch có đệm, nhiều ngăn phụ tiện lợi cho đi học đi làm.',
    variants: { colors: ['Đen', 'Xám', 'Xanh navy'], sizes: ['Freesize'] }, reviews: mkReviews(4) },
  { id: 5, imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85', name: 'Mũ lưỡi trai unisex', category: 'phukien', price: 69000, originalPrice: 89000, emoji: '🧢', color: '#f2e9fb', rating: 4.5, reviewCount: 640, sold: 1500, freeship: false, stock: 60,
    desc: 'Chất liệu kaki thoáng khí, có thể điều chỉnh size, phù hợp cả nam và nữ.',
    variants: { colors: ['Đen', 'Trắng', 'Be'], sizes: ['Freesize'] }, reviews: mkReviews(5) },
  { id: 6, imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85', name: 'Đồng hồ thể thao thông minh', category: 'phukien', price: 349000, originalPrice: 599000, emoji: '⌚', color: '#e3f6f5', rating: 4.4, reviewCount: 980, sold: 1100, freeship: true, stock: 15,
    desc: 'Chống nước IP68, đo nhịp tim, theo dõi bước chân, pin dùng 7 ngày.',
    variants: { colors: ['Đen', 'Bạc'], sizes: ['Freesize'] }, reviews: mkReviews(6) },
  { id: 7, imageUrl: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=85', name: 'Áo khoác gió 2 lớp', category: 'ao', price: 189000, originalPrice: 320000, emoji: '🧥', color: '#eaf0fb', rating: 4.6, reviewCount: 730, sold: 1400, freeship: true, stock: 25,
    desc: 'Chống nước nhẹ, cản gió tốt, gọn nhẹ dễ mang theo khi đi phượt hoặc trời trở lạnh.',
    variants: { colors: ['Đen', 'Xanh rêu', 'Cam'], sizes: ['M', 'L', 'XL'] }, reviews: mkReviews(7) },
  { id: 8, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85', name: 'Kính râm chống UV', category: 'phukien', price: 89000, originalPrice: 149000, emoji: '🕶️', color: '#fdeee3', rating: 4.3, reviewCount: 410, sold: 900, freeship: false, stock: 35,
    desc: 'Tròng kính chống tia UV400, gọng nhẹ bền, đi kèm hộp và khăn lau chuyên dụng.',
    variants: { colors: ['Đen', 'Nâu trà'], sizes: ['Freesize'] }, reviews: mkReviews(8) },
  { id: 9, imageUrl: 'https://images.unsplash.com/photo-1627483298606-cd38c7e34b1b?auto=format&fit=crop&w=900&q=85', name: 'Quần short thể thao', category: 'quan', price: 79000, originalPrice: 129000, emoji: '🩳', color: '#fef0f0', rating: 4.5, reviewCount: 520, sold: 1750, freeship: false, stock: 45,
    desc: 'Vải thun lạnh co giãn, thoáng khí, phù hợp chạy bộ, gym hoặc mặc nhà.',
    variants: { colors: ['Đen', 'Xám', 'Xanh navy'], sizes: ['M', 'L', 'XL'] }, reviews: mkReviews(9) },
  { id: 10, imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=85', name: 'Giày sandal đi biển', category: 'giay', price: 129000, originalPrice: 199000, emoji: '🩴', color: '#e6f4fb', rating: 4.2, reviewCount: 380, sold: 860, freeship: true, stock: 30,
    desc: 'Đế êm chống trượt, quai bền chắc, phù hợp đi biển hoặc di chuyển hằng ngày.',
    variants: { colors: ['Đen', 'Xanh'], sizes: ['39', '40', '41', '42'] }, reviews: mkReviews(10) },
  { id: 11, imageUrl: 'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=85', name: 'Áo sơ mi công sở', category: 'ao', price: 169000, originalPrice: 259000, emoji: '👔', color: '#f5f0e6', rating: 4.6, reviewCount: 690, sold: 1200, freeship: true, stock: 28,
    desc: 'Vải kate mềm mịn, ít nhăn, form regular fit lịch sự phù hợp đi làm.',
    variants: { colors: ['Trắng', 'Xanh nhạt'], sizes: ['S', 'M', 'L', 'XL'] }, reviews: mkReviews(11) },
  { id: 12, imageUrl: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=85', name: 'Ốp lưng điện thoại chống sốc', category: 'phukien', price: 39000, originalPrice: 69000, emoji: '📱', color: '#eef2fb', rating: 4.4, reviewCount: 1520, sold: 5200, freeship: false, stock: 100,
    desc: 'Chất liệu silicon chống sốc 4 góc, bảo vệ toàn diện, thiết kế mỏng nhẹ.',
    variants: { colors: ['Trong suốt', 'Đen', 'Hồng'], sizes: ['Freesize'] }, reviews: mkReviews(12) },
]

// Các sản phẩm mở rộng cho ShopTun
const moreProducts = [
  ['Áo polo nam premium','ao',149000,229000,'https://images.unsplash.com/photo-1625910513413-5fc45e37b9b4?auto=format&fit=crop&w=900&q=85'],
  ['Áo hoodie unisex basic','ao',219000,329000,'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85'],
  ['Áo len cổ tròn','ao',179000,269000,'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85'],
  ['Áo tanktop thể thao','ao',89000,139000,'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85'],
  ['Quần kaki nam ống đứng','quan',199000,299000,'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=85'],
  ['Quần jogger basic','quan',159000,239000,'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=85'],
  ['Quần short kaki','quan',119000,179000,'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=85'],
  ['Sneaker trắng tối giản','giay',389000,599000,'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85'],
  ['Sneaker chạy bộ nhẹ','giay',429000,649000,'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85'],
  ['Giày loafer nam','giay',329000,499000,'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=85'],
  ['Túi đeo chéo thời trang','phukien',129000,199000,'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85'],
  ['Túi tote canvas','phukien',79000,119000,'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85'],
  ['Ví da mini','phukien',99000,159000,'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85'],
  ['Thắt lưng da nam','phukien',109000,169000,'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=85'],
  ['Tai nghe bluetooth','phukien',259000,399000,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85'],
  ['Bình nước thể thao 750ml','phukien',89000,129000,'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85'],
  ['Ba lô mini đi học','phukien',159000,239000,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85'],
  ['Dép quai ngang unisex','giay',79000,119000,'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=85'],
  ['Áo thun oversize graphic','ao',119000,189000,'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85'],
  ['Quần cargo streetwear','quan',239000,359000,'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=900&q=85'],
]
const expandedProducts = moreProducts.map(([name, category, price, originalPrice, imageUrl], index) => ({
  id: 100 + index, imageUrl, name, category, price, originalPrice, emoji: category === 'ao' ? '👕' : category === 'quan' ? '👖' : category === 'giay' ? '👟' : '🎒', color: '#eef5f5', rating: Number((4.2 + (index % 8) * 0.1).toFixed(1)), reviewCount: 120 + index * 73, sold: 300 + index * 145, freeship: index % 2 === 0, stock: 20 + index, desc: `Sản phẩm ${name.toLowerCase()} của ShopTun, thiết kế trẻ trung, dễ phối đồ và phù hợp sử dụng hằng ngày.`, variants: { colors: ['Đen', 'Trắng', 'Xám'], sizes: ['M', 'L', 'XL'] }, reviews: mkReviews(index + 20) }))
products.push(...expandedProducts)

export const flashSaleIds = [3, 6, 1, 12]

export const findProduct = (id) => products.find((p) => p.id === Number(id))

export const discountPercent = (p) =>
  Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
