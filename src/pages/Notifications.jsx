import { useState } from 'react'

const initial = [
 {id:1, icon:'🎁', title:'Voucher mới dành cho bạn', text:'Giảm 30K cho đơn từ 199K. Hạn dùng hôm nay.', time:'10 phút trước', unread:true},
 {id:2, icon:'🚚', title:'Đơn hàng đang được giao', text:'Đơn #ST26092501 đang trên đường đến bạn.', time:'1 giờ trước', unread:true},
 {id:3, icon:'⚡', title:'Flash Sale bắt đầu', text:'Nhiều sản phẩm đang giảm đến 60%.', time:'3 giờ trước', unread:false},
 {id:4, icon:'❤️', title:'Sản phẩm bạn thích đang giảm giá', text:'Kiểm tra danh sách yêu thích để không bỏ lỡ deal.', time:'Hôm qua', unread:false},
]
export default function Notifications(){
 const [items,setItems]=useState(initial)
 const readAll=()=>setItems(x=>x.map(i=>({...i,unread:false})))
 return <div className="notice-page"><div className="section-head"><h1 className="page-title">Thông báo</h1><button className="sort-btn" onClick={readAll}>Đánh dấu đã đọc</button></div>
 <div className="notice-list">{items.map(i=><button className={`notice-item ${i.unread?'unread':''}`} key={i.id} onClick={()=>setItems(x=>x.map(n=>n.id===i.id?{...n,unread:false}:n))}><span className="notice-icon">{i.icon}</span><span><b>{i.title}</b><small>{i.text}</small><em>{i.time}</em></span>{i.unread&&<i/>}</button>)}</div></div>
}
