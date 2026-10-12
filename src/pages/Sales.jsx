import { useStore } from '../context/StoreContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Sales() {
  const { products } = useStore()
  const deals = [...products].sort((a,b) => ((b.originalPrice-b.price)/b.originalPrice) - ((a.originalPrice-a.price)/a.originalPrice))
  return <div>
    <div className="page-banner sale-banner"><div><span className="eyebrow">SHOP TUN DEALS</span><h1>Săn Sales mỗi ngày</h1><p>Ưu đãi nổi bật, cập nhật liên tục và dễ tìm hơn.</p></div><strong>GIẢM ĐẾN 70%</strong></div>
    <div className="section-head"><h2>🔥 Deal đang giảm giá</h2><span className="subtle">{deals.length} sản phẩm</span></div>
    <div className="grid">{deals.map(p => <ProductCard key={p.id} product={p}/>)}</div>
  </div>
}
