import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../../lib/authSession.js';
import { useCart } from '../../context/CartContext';
import Stay from '../../shared/Stay';
import { ORDERS, formatPaid } from '../../data/orders';

const FAVOURITES = [
  { slug: 'strawberry-white', name: 'Strawberry White Chocolate', cartId: 'strawberry-white-3g', price: 65 },
  { slug: 'blueberry-dark', name: 'Blueberry Dark Chocolate', cartId: 'blueberry-dark-3g', price: 65 },
  { slug: 'hazelnut-milk', name: 'Hazelnut Milk Chocolate', cartId: 'hazelnut-milk-3g', price: 65 },
];

function readName() {
  return getStoredUser()?.firstName || 'Jordan';
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="font-gelica text-[32px] font-normal text-[#1A2744] md:text-[40px]">{title}</h2>
      <p className="mt-2 font-sans text-sm text-[#5C6B82]">{subtitle}</p>
    </div>
  );
}

function SaveButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 cursor-pointer bg-[#3E6EAE] px-4 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-[#355f98]"
    >
      {label}
    </button>
  );
}

export default function AccountMain() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [name, setName] = useState(readName);
  const [email, setEmail] = useState('jordan@email.com');
  const [saved, setSaved] = useState('');
  const [editingShip, setEditingShip] = useState(false);
  const [address, setAddress] = useState('12 Queen Street, Toronto, ON M5V 2T6');
  const [draftAddress, setDraftAddress] = useState(address);

  const markSaved = (key) => {
    setSaved(key);
    window.setTimeout(() => setSaved(''), 1600);
  };

  const logout = () => {
    clearAuthSession();
    navigate('/');
  };

  return (
    <div className="bg-[#FEFBF6] pt-24 text-[#1A2744]">
      <section className="mx-auto w-full max-w-[1080px] px-4 pt-8 md:px-8 md:pt-12">
        <div className="grid items-center gap-6 rounded-[8px] bg-[#D7E5F2] p-6 md:grid-cols-[1.15fr_0.85fr] md:p-10">
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-[#4372B8]">MY ACCOUNT</p>
            <h1 className="mt-3 font-gelica text-[36px] leading-tight font-normal text-[#4372B8] md:text-[44px]">
              Welcome back,<br />{name}
            </h1>
            <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-[#4372B8]/80">
              Pick up your rewards, track a delivery, or reorder a bar you loved.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/chocolates" className="bg-white px-5 py-2.5 font-sans text-sm font-medium text-[#4372B8]">
                Shop Again
              </Link>
              <button
                type="button"
                onClick={logout}
                className="cursor-pointer border border-[#4372B8] bg-transparent px-5 py-2.5 font-sans text-sm font-medium text-[#4372B8]"
              >
                Log Out
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              ['Rewards', '1,250', '10 points = $1 off'],
              ['Orders', '8', 'since you joined'],
              ['Member since', 'March 2025', 'thanks for stopping in'],
            ].map(([label, value, caption]) => (
              <div key={label} className="rounded-[6px] bg-[#FFFBF8] px-5 py-3.5">
                <p className="font-sans text-[10px] font-semibold tracking-[0.16em] text-[#7A8BA3] uppercase">{label}</p>
                <p className="mt-1 font-gelica text-[28px] leading-none text-[#1A2744]">{value}</p>
                <p className="mt-1 font-sans text-xs text-[#7A8BA3]">{caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1080px] px-4 py-16 md:px-8">
        <SectionTitle title="Your Orders" subtitle="Track a delivery or reorder a bar you loved." />
        <div className="divide-y divide-[#C9D4E4] border-y border-[#C9D4E4]">
          {ORDERS.map((order) => (
            <article key={order.id} className="py-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#D9D9D9] text-[#8A8A8A]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4">
                    <rect x="4" y="5" width="16" height="14" rx="1.5" />
                    <path d="M8 5.5V4.5h8v1" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-sans text-sm font-semibold">Order #{order.id}</p>
                      <p className="font-sans text-xs text-[#7A8BA3]">Placed {order.placed} · {order.lines.length} {order.lines.length === 1 ? 'item' : 'items'}</p>
                    </div>
                    <p className="font-sans text-sm font-semibold">{formatPaid(order.subtotal + order.shipping + order.tax)}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 font-sans text-[11px] font-semibold ${order.status === 'Shipped' ? 'bg-[#F6E7A8] text-[#3E5A30]' : 'border border-[#C5D0E0] text-[#4372B8]'}`}>
                      {order.status}
                    </span>
                    <span className={`rounded-full px-3 py-1 font-sans text-[11px] font-semibold ${order.status === 'Shipped' ? 'bg-[#F6E7A8] text-[#3E5A30]' : 'border border-[#4372B8] text-[#4372B8]'}`}>
                      Track
                    </span>
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="font-sans text-xs text-[#4372B8] underline-offset-2 hover:underline"
                    >
                      View Order
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/account/orders" className="inline-block border border-[#4372B8] px-5 py-2 font-sans text-sm text-[#4372B8]">
            View All Orders
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[720px] px-4 pb-16 md:px-8">
        <SectionTitle title="Your Details" subtitle="Update your name, email, or password any time." />
        <div className="mb-8 border-t border-[#C9D4E4] pt-8">
          <div className="mb-2 flex items-center justify-between">
            <label className="font-sans text-sm font-semibold text-[#4372B8]" htmlFor="account-name">Name</label>
          </div>
          <input
            id="account-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-[#C9D4E4] bg-transparent py-2 font-sans text-sm outline-none focus:border-[#4372B8]"
          />
          <SaveButton label={saved === 'name' ? 'Saved' : 'Save Changes'} onClick={() => markSaved('name')} />
        </div>

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <label className="font-sans text-sm font-semibold text-[#4372B8]" htmlFor="account-email">Email Address</label>
            <span className="font-sans text-xs text-[#4372B8]">{email}</span>
          </div>
          <input
            id="account-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-[#C9D4E4] bg-transparent py-2 font-sans text-sm outline-none focus:border-[#4372B8]"
          />
          <SaveButton label={saved === 'email' ? 'Saved' : 'Save Changes'} onClick={() => markSaved('email')} />
        </div>

        <div className="mb-8">
          <p className="mb-3 font-sans text-sm font-semibold text-[#4372B8]">Password</p>
          <label className="font-sans text-[11px] font-semibold tracking-[0.12em] text-[#7A8BA3] uppercase" htmlFor="current-password">Current password</label>
          <input id="current-password" type="password" defaultValue="password" className="mb-4 w-full border border-[#E7D48A] bg-[#F6E7A8] px-3 py-2 font-sans text-sm outline-none" />
          <label className="font-sans text-[11px] font-semibold tracking-[0.12em] text-[#7A8BA3] uppercase" htmlFor="new-password">New password</label>
          <input id="new-password" type="password" placeholder="New password" className="mb-4 w-full border-b border-[#C9D4E4] bg-transparent py-2 font-sans text-sm outline-none focus:border-[#4372B8]" />
          <label className="font-sans text-[11px] font-semibold tracking-[0.12em] text-[#7A8BA3] uppercase" htmlFor="confirm-password">Confirm password</label>
          <input id="confirm-password" type="password" placeholder="Confirm password" className="w-full border-b border-[#C9D4E4] bg-transparent py-2 font-sans text-sm outline-none focus:border-[#4372B8]" />
          <SaveButton label={saved === 'password' ? 'Saved' : 'Save Changes'} onClick={() => markSaved('password')} />
        </div>

        <div className="border-t border-[#C9D4E4] pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-sans text-sm font-semibold text-[#4372B8]">Shipping Information</p>
              {!editingShip && <p className="mt-1 font-sans text-sm text-[#5C6B82]">{address}</p>}
            </div>
            <button
              type="button"
              onClick={() => {
                setDraftAddress(address);
                setEditingShip((open) => !open);
              }}
              className="cursor-pointer font-sans text-sm text-[#4372B8]"
            >
              Edit
            </button>
          </div>
          {editingShip && (
            <div className="mt-4">
              <input
                value={draftAddress}
                onChange={(e) => setDraftAddress(e.target.value)}
                className="w-full border-b border-[#C9D4E4] bg-transparent py-2 font-sans text-sm outline-none focus:border-[#4372B8]"
              />
              <SaveButton
                label={saved === 'ship' ? 'Saved' : 'Save Changes'}
                onClick={() => {
                  setAddress(draftAddress);
                  setEditingShip(false);
                  markSaved('ship');
                }}
              />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1080px] px-4 pb-16 md:px-8">
        <SectionTitle title="Your Favourites" subtitle="The bars you keep coming back to." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FAVOURITES.map((bar) => (
            <article key={bar.slug}>
              <Link to={`/chocolates/${bar.slug}`} className="flex aspect-square items-center justify-center bg-[#D9D9D9] text-[#8A8A8A]">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="9" cy="10" r="1.4" fill="currentColor" />
                  <path d="M4 16l4.5-3.5 3 2.5 3-2.5L21 16" />
                </svg>
              </Link>
              <h3 className="mt-3 font-sans text-sm font-semibold">{bar.name}</h3>
              <p className="font-sans text-xs text-[#7A8BA3]">3g Bar</p>
              <button
                type="button"
                onClick={() => addToCart({
                  id: bar.cartId,
                  name: `3g ${bar.name} Bar`,
                  price: bar.price,
                  type: bar.slug,
                })}
                className="mt-3 w-full cursor-pointer border border-[#4372B8] py-2.5 font-sans text-sm text-[#4372B8]"
              >
                Reorder
              </button>
            </article>
          ))}
        </div>
      </section>

      <Stay />
    </div>
  );
}
