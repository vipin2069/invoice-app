export const FIELD_CONFIG = [
  { key: 'qty', label: 'Qty' },
  { key: 'price', label: 'Price' },
  { key: 'discountPercent', label: 'Discount%' },
  { key: 'discount', label: 'Discount' },
  { key: 'taxPercent', label: 'Tax%' },
  { key: 'tax', label: 'Tax' },
  { key: 'totalPrice', label: 'Total Price' },
];

export const INITIAL_FORM = {
  qty: '1.00',
  price: '0.00',
  discountPercent: '0.00',
  discount: '0.00',
  taxPercent: '0.00',
  tax: '0.00',
  totalPrice: '0.00',
};

export const toNumber = (value) => {
  const parsed = Number.parseFloat(String(value).replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export const asFixed2 = (value) => round2(value).toFixed(2);

export const recalculateForm = (rawForm, changedField) => {
  const qty = toNumber(rawForm.qty);
  const price = toNumber(rawForm.price);
  const subtotal = qty * price;

  let discountPercent = toNumber(rawForm.discountPercent);
  let discount = toNumber(rawForm.discount);
  let taxPercent = toNumber(rawForm.taxPercent);
  let tax = toNumber(rawForm.tax);
  let totalPrice = toNumber(rawForm.totalPrice);

  if (changedField === 'discountPercent' || changedField === 'qty' || changedField === 'price') {
    discount = (subtotal * discountPercent) / 100;
  }

  if (changedField === 'discount') {
    discountPercent = subtotal === 0 ? 0 : (discount / subtotal) * 100;
  }

  let taxable = subtotal - discount;

  if (
    changedField === 'taxPercent' ||
    changedField === 'qty' ||
    changedField === 'price' ||
    changedField === 'discount' ||
    changedField === 'discountPercent'
  ) {
    tax = (taxable * taxPercent) / 100;
  }

  if (changedField === 'tax') {
    taxPercent = taxable === 0 ? 0 : (tax / taxable) * 100;
  }

  if (changedField === 'totalPrice') {
    tax = totalPrice - taxable;
    taxPercent = taxable === 0 ? 0 : (tax / taxable) * 100;
  }

  taxable = subtotal - discount;
  totalPrice = taxable + tax;

  const nextForm = {
    qty: asFixed2(qty),
    price: asFixed2(price),
    discountPercent: asFixed2(discountPercent),
    discount: asFixed2(discount),
    taxPercent: asFixed2(taxPercent),
    tax: asFixed2(tax),
    totalPrice: asFixed2(totalPrice),
  };

  if (changedField && Object.prototype.hasOwnProperty.call(nextForm, changedField)) {
    nextForm[changedField] = String(rawForm[changedField] ?? '');
  }

  return nextForm;
};

export const money = (value) => `$${asFixed2(toNumber(value))}`;
