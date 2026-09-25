import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Profile(){
 const {user,logout}=useAuth(); const {ids}=useWishlist(); const {totalQty}=useCart(); const navigate=useNavigate()
 if(!user) return <div className="profile-empty"><div className="profile-avatar">👤</div><h1>Bạn chưa đăng nhập</h1><p>Đăng nhập để xem đơn hàng, yêu thích và ưu đãi riêng.</p><Link className="btn-primary" to="/login">Đăng nhập</Link><Link className="btn-outline" to="/register">Tạo tài khoản</Link></div>
 return <div className="profile-page"><div className="profile-head"><div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div><div><h1>{user.name}</h1><p>{user.email || 'Thành viên ShopTun'}</p></div></div><div className="profile-menu"><Link to="/orders"><span>📦</span><b>Đơn hàng của tôi</b><small>Theo dõi lịch sử mua hàng</small></Link><Link to="/wishlist"><span>❤️</span><b>Yêu thích</b><small>{ids.length} sản phẩm</small></Link><Link to="/cart"><span>🛒</span><b>Giỏ hàng</b><small>{totalQty} sản phẩm</small></Link><Link to="/notifications"><span>🔔</span><b>Thông báo</b><small>Ưu đãi và cập nhật đơn hàng</small></Link></div><button className="logout-btn" onClick={()=>{logout();navigate('/')}}>Đăng xuất</button></div>
}
