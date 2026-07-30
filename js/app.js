
document.addEventListener("DOMContentLoaded",()=>{
const body=document.body,drawer=document.querySelector(".cart-drawer"),backdrop=document.querySelector(".drawer-backdrop"),bagButtons=document.querySelectorAll("[data-open-cart]"),close=document.querySelector("[data-close-cart]"),itemsEl=document.querySelector(".cart-items"),counts=document.querySelectorAll("[data-cart-count]"),totalEl=document.querySelector("[data-cart-total]"),toast=document.querySelector(".toast"),hero=document.querySelector(".hero"),glow=document.querySelector(".hero-glow");
let cart=JSON.parse(localStorage.getItem("caressCart")||"[]");
const money=n=>`€${Number(n).toFixed(2)}`;
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function save(){localStorage.setItem("caressCart",JSON.stringify(cart))}
function render(){
let count=cart.reduce((s,i)=>s+i.qty,0);counts.forEach(x=>x.textContent=count);
if(itemsEl)itemsEl.innerHTML=cart.length?cart.map((i,n)=>`<div class="cart-item"><div><h4>${escapeHtml(i.name)}</h4><small>Qty ${i.qty}</small><br><button class="remove-item" data-remove="${n}">Remove</button></div><div class="cart-item-price">${money(i.price*i.qty)}</div></div>`).join(""):`<div class="empty-cart"><p>Your curated selection awaits.</p><p>Drag a product to the bag or browse the collection.</p></div>`;
let total=cart.reduce((s,i)=>s+i.price*i.qty,0);if(totalEl)totalEl.textContent=money(total)
}
function openCart(){drawer?.classList.add("open");backdrop?.classList.add("open");body.classList.add("drawer-open")}
function closeCart(){drawer?.classList.remove("open");backdrop?.classList.remove("open");body.classList.remove("drawer-open")}
function toastMsg(msg){if(!toast)return;toast.textContent=msg;toast.classList.add("show");clearTimeout(window.ct);window.ct=setTimeout(()=>toast.classList.remove("show"),2200)}
function add(p){let x=cart.find(i=>i.id===p.id);x?x.qty++:cart.push({...p,qty:1});save();render();toastMsg(`${p.name} added to your selection`)}
bagButtons.forEach(b=>b.addEventListener("click",openCart));close?.addEventListener("click",closeCart);backdrop?.addEventListener("click",closeCart);document.addEventListener("keydown",e=>e.key==="Escape"&&closeCart());
document.addEventListener("click",e=>{let a=e.target.closest("[data-add-to-cart]"),r=e.target.closest("[data-remove]");if(a)add({id:a.dataset.id,name:a.dataset.name,price:Number(a.dataset.price)});if(r){cart.splice(Number(r.dataset.remove),1);save();render()}});
document.querySelectorAll(".product-card").forEach(card=>{card.addEventListener("dragstart",e=>{card.classList.add("dragging");e.dataTransfer.setData("application/json",JSON.stringify({id:card.dataset.id,name:card.dataset.name,price:Number(card.dataset.price)}))});card.addEventListener("dragend",()=>card.classList.remove("dragging"))});
document.querySelectorAll("[data-cart-drop]").forEach(t=>{t.addEventListener("dragover",e=>{e.preventDefault();t.classList.add("drag-target-active")});t.addEventListener("dragleave",()=>t.classList.remove("drag-target-active"));t.addEventListener("drop",e=>{e.preventDefault();t.classList.remove("drag-target-active");try{let p=JSON.parse(e.dataTransfer.getData("application/json"));add(p);openCart()}catch(_){}})});
window.addEventListener("scroll",()=>document.querySelector(".site-header")?.classList.toggle("scrolled",scrollY>20));
let io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(x=>io.observe(x));
if(hero&&glow&&matchMedia("(pointer:fine)").matches){hero.addEventListener("pointermove",e=>{let r=hero.getBoundingClientRect();glow.style.left=`${e.clientX-r.left}px`;glow.style.top=`${e.clientY-r.top}px`;glow.style.opacity="1"});hero.addEventListener("pointerleave",()=>glow.style.opacity="0")}
let pre=document.getElementById("preloader");if(pre)window.addEventListener("load",()=>{pre.style.opacity="0";setTimeout(()=>pre.remove(),700)});
render();
});
