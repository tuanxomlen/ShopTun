import { useState, useMemo } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { useSearchParams } from 'react-router-dom'
import { categories, flashSaleIds } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'

export default function Home({ search }) {
  const { products } = useStore()
  const [params, setParams] = useSearchParams()
  const activeCat = params.get('cat') || ''
  const [sort, setSort] = useState('popular')

  const flashSaleProducts = flashSaleIds.map((id) => products.find((p) => p.id === id))

  const filtered = useMemo(() => {
    let list = [...products]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    if (activeCat) {
      list = list.filter((p) => p.category === activeCat)
    }
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'newest': list.sort((a, b) => b.id - a.id); break
      default: list.sort((a, b) => b.sold - a.sold)
    }
    return list
  }, [search, activeCat, sort])

  return (
    <div>
      {!search && (
        <div className="hero">
          <div className="hero-text">
            <h1>Săn deal mỗi ngày cùng Shoptun</h1>
            <p>Hàng ngàn sản phẩm giá tốt, giao nhanh, đổi trả dễ dàng.</p>
          </div>
          <div className="hero-badge">
            <span className="hero-badge-percent">Giảm đến 60%</span>
            <span>cho đơn hàng đầu tiên</span>
          </div>
        </div>
      )}

      {!search && (
        <section className="feature-strip">
          <div className="feature-card"><span className="feature-icon">🚚</span><div><strong>Giao nhanh</strong><span>Nhận hàng đúng hẹn</span></div></div>
          <div className="feature-card"><span className="feature-icon">🛡️</span><div><strong>Thanh toán an toàn</strong><span>Bảo mật thông tin</span></div></div>
          <div className="feature-card"><span className="feature-icon">↩️</span><div><strong>Đổi trả dễ dàng</strong><span>Trong 7 ngày</span></div></div>
          <div className="feature-card"><span className="feature-icon">💬</span><div><strong>Hỗ trợ 24/7</strong><span>Luôn có người hỗ trợ</span></div></div>
        </section>
      )}

      {!search && !activeCat && (
        <section className="flash-sale">
          <div className="flash-sale-head">
            <h2>⚡ Flash Sale</h2>
            <CountdownTimer hours={4} />
          </div>
          <div className="flash-sale-row">
            {flashSaleProducts.map((p) => (
              <div key={p.id} className="flash-item">
                <ProductCard product={p} />
                <div className="sold-bar">
                  <div className="sold-bar-fill" style={{ width: `${Math.min(95, (p.sold % 100) + 40)}%` }} />
                </div>
                <p className="sold-text">Đã bán {p.sold}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!search && (
        <section className="cat-grid">
          {categories.map((c) => (
            <button
              key={c.id}
              className={`cat-tile ${activeCat === c.id ? 'active' : ''}`}
              onClick={() => setParams(activeCat === c.id ? {} : { cat: c.id })}
            >
              <span className="cat-emoji">{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </section>
      )}

      <section>
        <div className="section-head">
          <h2>{search ? `Kết quả cho "${search}"` : activeCat ? categories.find((c) => c.id === activeCat)?.name : 'Gợi ý hôm nay'}</h2>
          <div className="sort-bar">
            {[
              ['popular', 'Phổ biến'],
              ['newest', 'Mới nhất'],
              ['price-asc', 'Giá thấp → cao'],
              ['price-desc', 'Giá cao → thấp'],
            ].map(([key, label]) => (
              <button
                key={key}
                className={sort === key ? 'sort-btn active' : 'sort-btn'}
                onClick={() => setSort(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">Không tìm thấy sản phẩm phù hợp.</p>
        ) : (
          <div className="grid">
            {filtered.map((p) => <ProductCard product={p} key={p.id} />)}
          </div>
        )}
      </section>
    </div>
  )
}
