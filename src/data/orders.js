export function formatPaid(amount) {
  const fixed = Number(amount).toFixed(2);
  return amount === 0 ? `$00.00` : `$${fixed}`;
}

export const ORDERS = [
  {
    id: '10482',
    placed: 'Sept 12, 2026',
    delivered: 'Sept 18, 2026',
    status: 'Delivered',
    note: 'Left at the front door.',
    lines: [
      { name: '3g Strawberry White Chocolate Bar', kind: 'MICRODOSE', qty: 2, paid: 0, delivered: 'Sept 18, 2026', cartId: 'strawberry-white-3g', price: 65, slug: 'strawberry-white' },
      { name: '3g Blueberry Dark Chocolate Bar', kind: 'MICRODOSE', qty: 1, paid: 0, delivered: 'Sept 18, 2026', cartId: 'blueberry-dark-3g', price: 65, slug: 'blueberry-dark' },
      { name: 'Berry Happy Microdose Set', kind: 'GIFT SET', qty: 1, paid: 0, delivered: 'Sept 18, 2026', cartId: 'berry-happy-set', price: 120, slug: 'berry-happy-set' },
    ],
    address: ['Jordan Smith', '123 Queen St W, Unit 4', 'Toronto, ON M5H 2M9', 'Canada'],
    payment: 'Paid via Interac e-Transfer',
    subtotal: 0,
    shipping: 0,
    tax: 0,
  },
  {
    id: '10451',
    placed: 'Aug 3, 2026',
    delivered: 'Aug 8, 2026',
    status: 'Delivered',
    note: 'Left at the front door.',
    lines: [
      { name: '3g Hazelnut Milk Chocolate Bar', kind: 'MICRODOSE', qty: 1, paid: 60, delivered: 'Aug 8, 2026', cartId: 'hazelnut-milk-3g', price: 65, slug: 'hazelnut-milk' },
    ],
    address: ['Jordan Smith', '123 Queen St W, Unit 4', 'Toronto, ON M5H 2M9', 'Canada'],
    payment: 'Paid via Interac e-Transfer',
    subtotal: 60,
    shipping: 0,
    tax: 0,
  },
  {
    id: '10438',
    placed: 'June 18, 2026',
    delivered: null,
    status: 'Processing',
    note: 'We are preparing this order.',
    lines: [
      { name: '3g Blueberry Dark Chocolate Bar', kind: 'MICRODOSE', qty: 1, paid: 60, delivered: '—', cartId: 'blueberry-dark-3g', price: 65, slug: 'blueberry-dark' },
    ],
    address: ['Jordan Smith', '123 Queen St W, Unit 4', 'Toronto, ON M5H 2M9', 'Canada'],
    payment: 'Paid via Interac e-Transfer',
    subtotal: 60,
    shipping: 0,
    tax: 0,
  },
];

const LINE_TEMPLATES = [
  { name: '3g Strawberry White Chocolate Bar', kind: 'MICRODOSE', cartId: 'strawberry-white-3g', price: 65, slug: 'strawberry-white' },
  { name: '3g Blueberry Dark Chocolate Bar', kind: 'MICRODOSE', cartId: 'blueberry-dark-3g', price: 65, slug: 'blueberry-dark' },
  { name: 'Berry Happy Microdose Set', kind: 'GIFT SET', cartId: 'berry-happy-set', price: 120, slug: 'berry-happy-set' },
  { name: '3g Hazelnut Milk Chocolate Bar', kind: 'MICRODOSE', cartId: 'hazelnut-milk-3g', price: 65, slug: 'hazelnut-milk' },
];

export const HISTORY_ORDERS = [
  { id: '10482', placed: 'Sept 12, 2026', items: 3, status: 'Shipped', total: 0 },
  { id: '10377', placed: 'Aug 20, 2026', items: 1, status: 'Delivered', total: 0 },
  { id: '10251', placed: 'July 29, 2026', items: 2, status: 'Delivered', total: 0 },
  { id: '10188', placed: 'June 03, 2026', items: 1, status: 'Cancelled', total: 0 },
  { id: '09964', placed: 'Dec 18, 2025', items: 4, status: 'Delivered', total: 0 },
  { id: '09781', placed: 'Oct 02, 2025', items: 2, status: 'Delivered', total: 0 },
  { id: '09640', placed: 'Sept 14, 2025', items: 2, status: 'Delivered', total: 0 },
  { id: '09512', placed: 'Aug 02, 2025', items: 1, status: 'Shipped', total: 0 },
  { id: '09488', placed: 'July 19, 2025', items: 3, status: 'Delivered', total: 0 },
  { id: '09320', placed: 'June 11, 2025', items: 1, status: 'Cancelled', total: 0 },
  { id: '09201', placed: 'May 08, 2025', items: 2, status: 'Delivered', total: 0 },
  { id: '09044', placed: 'April 22, 2025', items: 1, status: 'Delivered', total: 0 },
  { id: '08910', placed: 'March 15, 2025', items: 2, status: 'Delivered', total: 0 },
  { id: '08755', placed: 'Feb 02, 2025', items: 1, status: 'Shipped', total: 0 },
  { id: '08620', placed: 'Jan 18, 2025', items: 3, status: 'Delivered', total: 0 },
  { id: '08490', placed: 'Dec 09, 2024', items: 1, status: 'Cancelled', total: 0 },
  { id: '08311', placed: 'Nov 21, 2024', items: 2, status: 'Delivered', total: 0 },
  { id: '08102', placed: 'Oct 04, 2024', items: 1, status: 'Delivered', total: 0 },
];

const MONTHS = {
  Jan: 0, Feb: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, Aug: 7, Sept: 8, Oct: 9, Nov: 10, Dec: 11,
};

export function placedTime(value) {
  const [month, day, year] = value.replace(',', '').split(' ');
  return new Date(Number(year), MONTHS[month], Number(day)).getTime();
}

function historyDetail(row) {
  const note = row.status === 'Shipped'
    ? 'On the way.'
    : row.status === 'Cancelled'
      ? 'This order was cancelled.'
      : 'Left at the front door.';
  return {
    id: row.id,
    placed: row.placed,
    delivered: row.status === 'Delivered' ? row.placed : null,
    status: row.status,
    note,
    lines: Array.from({ length: row.items }, (_, index) => {
      const template = LINE_TEMPLATES[index % LINE_TEMPLATES.length];
      return { ...template, qty: 1, paid: 0, delivered: row.status === 'Delivered' ? row.placed : '—' };
    }),
    address: ['Jordan Smith', '123 Queen St W, Unit 4', 'Toronto, ON M5H 2M9', 'Canada'],
    payment: 'Paid via Interac e-Transfer',
    subtotal: 0,
    shipping: 0,
    tax: 0,
  };
}

export function getOrder(id) {
  const known = ORDERS.find((order) => order.id === id);
  if (known) return known;
  const row = HISTORY_ORDERS.find((order) => order.id === id);
  return row ? historyDetail(row) : null;
}
