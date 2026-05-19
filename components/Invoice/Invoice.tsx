"use client";

/**
 * Invoice — Pansari Inn
 * ─────────────────────
 * Professional print-ready invoice component.
 *
 * Layout:
 *  • Header  : flex row, logo+brand left / invoice meta right, max 90px
 *  • Addresses: always 2-col grid; right col shows "Same as billing" note when identical
 *  • Table   : dark green header, alternating row bg, 8px 12px padding
 *  • Totals  : right-aligned 280px block, payment badge below grand total
 *  • Footer  : single tight row, thank-you left / email right
 *  • Print   : @media print strips shadows/backgrounds, 15mm margins, 13px base
 */

import Image from 'next/image';
import React from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type PaymentStatus = 'paid' | 'unpaid' | 'pending';

export interface InvoiceItem {
  id: number;
  nameEn: string;
  size?: string;
  price: number;
  quantity: number;
  img?: string;
}

export interface AddressBlock {
  name: string;
  address: string;
  city: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  deliveryNote?: string;
}

export interface InvoiceData {
  orderId: string;
  orderDate: string;
  dueDate?: string;
  estimatedDelivery?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  billingAddress: AddressBlock;
  shippingAddress: AddressBlock;
  companyName?: string;
  companyTagline?: string;
  companyEmail?: string;
  logoUrl?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BRAND_GREEN = '#1a6b3a';
const BRAND_GREEN_LIGHT = '#e8f5ee';

const STATUS_STYLES: Record<PaymentStatus, { bg: string; color: string; label: string }> = {
  paid:    { bg: '#dcfce7', color: '#166534', label: 'PAID'    },
  unpaid:  { bg: '#fee2e2', color: '#991b1b', label: 'UNPAID'  },
  pending: { bg: '#fef3c7', color: '#92400e', label: 'PENDING' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `PKR\u00a0${n.toLocaleString()}`;
}

function isSameAddress(a: AddressBlock, b: AddressBlock): boolean {
  return (
    a.name    === b.name    &&
    a.address === b.address &&
    a.city    === b.city    &&
    (a.postalCode ?? '') === (b.postalCode ?? '')
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CompanyLogo({ logoUrl, companyName }: { logoUrl?: string; companyName: string }) {
  if (logoUrl) {
    return (
      <div style={{ width: 44, height: 44, position: 'relative', flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}>
        <Image src={logoUrl} alt={companyName} fill style={{ objectFit: 'contain' }} sizes="44px" />
      </div>
    );
  }
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 8,
      background: BRAND_GREEN, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 15, fontWeight: 800, flexShrink: 0,
      letterSpacing: '-0.5px', userSelect: 'none',
    }}>
      {getInitials(companyName)}
    </div>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: 999,
      fontSize: 10, fontWeight: 800,
      letterSpacing: '0.8px', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: s.color, display: 'inline-block', flexShrink: 0,
      }} />
      {s.label}
    </span>
  );
}

function PaymentBadge({ method }: { method: string }) {
  return (
    <span style={{
      display: 'inline-block',
      background: '#f3f4f6', color: '#6b7280',
      padding: '3px 10px', borderRadius: 999,
      fontSize: 10, fontWeight: 600,
      letterSpacing: '0.3px',
    }}>
      via {method}
    </span>
  );
}

function AddressCard({ title, addr, note }: { title: string; addr: AddressBlock; note?: string }) {
  return (
    <div>
      <p style={{
        fontSize: 9, fontWeight: 800, color: '#9ca3af',
        textTransform: 'uppercase', letterSpacing: '0.8px',
        marginBottom: 7, margin: '0 0 7px',
      }}>
        {title}
      </p>
      <p style={{ fontWeight: 700, fontSize: 13, color: '#111827', margin: '0 0 3px' }}>
        {addr.name}
      </p>
      <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.65, margin: 0 }}>
        {addr.address}<br />
        {addr.city}{addr.postalCode ? `, ${addr.postalCode}` : ''}
        {addr.phone    && <><br />{addr.phone}</>}
        {addr.email    && <><br />{addr.email}</>}
        {addr.deliveryNote && (
          <><br /><em style={{ color: '#9ca3af', fontSize: 11 }}>{addr.deliveryNote}</em></>
        )}
      </p>
      {note && (
        <p style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic', margin: '6px 0 0' }}>
          {note}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Invoice({ data }: { data: InvoiceData }) {
  const {
    orderId, orderDate, dueDate, estimatedDelivery,
    paymentStatus, paymentMethod,
    items, subtotal, discount, shipping, tax, total,
    billingAddress, shippingAddress,
    companyName    = 'Pansari Inn',
    companyTagline = 'Premium Quality Products',
    companyEmail   = 'support@pansariinn.com',
    logoUrl,
  } = data;

  const sameAddr = isSameAddress(billingAddress, shippingAddress);

  return (
    <>
      {/* ── Scoped styles (screen + print) ── */}
      <style>{`
        /* ── Screen wrapper ── */
        .inv-root {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 13px;
          color: #1f2937;
          background: #ffffff;
          max-width: 800px;
          margin: 0 auto;
          padding: 36px 36px 44px;
          box-sizing: border-box;
        }

        /* ── Table alternating rows ── */
        .inv-tbody tr:nth-child(odd) td {
          background: #f9fafb;
        }
        .inv-tbody tr:nth-child(even) td {
          background: #ffffff;
        }

        /* ── Print overrides ── */
        @media print {
          @page { margin: 15mm; }

          .inv-no-print { display: none !important; }

          .inv-root {
            background: #fff !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            font-size: 13px !important;
          }

          /* Keep header + address block on page 1 */
          .inv-page-anchor { page-break-inside: avoid; }

          /* Totals stay with last product row */
          .inv-totals { page-break-before: avoid; }

          /* Preserve table header green bg on print */
          .inv-thead th {
            background: ${BRAND_GREEN} !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Preserve status/payment badge colors */
          .inv-badge-paid    { background: #dcfce7 !important; color: #166534 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .inv-badge-unpaid  { background: #fee2e2 !important; color: #991b1b !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .inv-badge-pending { background: #fef3c7 !important; color: #92400e !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

          /* Strip alternating row backgrounds in print for ink saving */
          .inv-tbody tr:nth-child(odd) td,
          .inv-tbody tr:nth-child(even) td {
            background: #fff !important;
          }

          /* Address block: no background in print */
          .inv-addresses { background: transparent !important; border: 1px solid #e5e7eb !important; }
        }
      `}</style>

      <div className="inv-root">

        {/* ══════════════════════════════════════════════════════════
            HEADER — flex row, max 90px, logo+brand left / meta right
        ══════════════════════════════════════════════════════════ */}
        <div className="inv-page-anchor" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxHeight: 90,
          paddingBottom: 18,
          borderBottom: `3px solid ${BRAND_GREEN}`,
          marginBottom: 22,
        }}>

          {/* Left: logo square + company name + tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CompanyLogo logoUrl={logoUrl} companyName={companyName} />
            <div style={{ lineHeight: 1.25 }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: BRAND_GREEN, margin: 0, letterSpacing: '-0.3px' }}>
                {companyName.toUpperCase()}
              </p>
              <p style={{ fontSize: 10, color: '#9ca3af', margin: '2px 0 0', fontWeight: 400 }}>
                {companyTagline}
              </p>
            </div>
          </div>

          {/* Right: INVOICE title + order # + date + badge */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.8px' }}>
              INVOICE
            </p>
            <p style={{ fontSize: 12, color: '#374151', margin: '3px 0 1px', fontWeight: 600 }}>
              #{orderId}
            </p>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '1px 0 6px' }}>
              {orderDate}
              {dueDate && <span style={{ marginLeft: 8, color: '#6b7280' }}>· Due: {dueDate}</span>}
            </p>
            <StatusBadge status={paymentStatus} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ADDRESSES — always 2-col grid; right shows "same" note
        ══════════════════════════════════════════════════════════ */}
        <div className="inv-page-anchor inv-addresses" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          background: '#f9fafb',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          marginBottom: 24,
          overflow: 'hidden',
        }}>
          {/* Bill To */}
          <div style={{ padding: '14px 18px' }}>
            <AddressCard title="Bill To" addr={billingAddress} />
          </div>

          {/* Ship To — always rendered, shows note when same */}
          <div style={{
            padding: '14px 18px',
            borderLeft: '1px solid #e5e7eb',
          }}>
            {sameAddr ? (
              <div>
                <p style={{
                  fontSize: 9, fontWeight: 800, color: '#9ca3af',
                  textTransform: 'uppercase', letterSpacing: '0.8px',
                  margin: '0 0 7px',
                }}>
                  Ship To
                </p>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#111827', margin: '0 0 3px' }}>
                  {shippingAddress.name}
                </p>
                <p style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                  Same as billing address
                </p>
                {estimatedDelivery && (
                  <p style={{ fontSize: 11, color: '#6b7280', margin: '6px 0 0' }}>
                    Est. delivery: {estimatedDelivery}
                  </p>
                )}
              </div>
            ) : (
              <AddressCard
                title="Ship To"
                addr={shippingAddress}
                note={estimatedDelivery ? `Est. delivery: ${estimatedDelivery}` : undefined}
              />
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            PRODUCTS TABLE — dark header, alternating rows, 8px 12px
        ══════════════════════════════════════════════════════════ */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 12,
          marginBottom: 0,
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
        }}>
          <thead className="inv-thead">
            <tr>
              {[
                { label: '#',          align: 'left',  width: 32  },
                { label: 'Item',       align: 'left',  width: undefined },
                { label: 'Qty',        align: 'right', width: 48  },
                { label: 'Unit Price', align: 'right', width: 110 },
                { label: 'Total',      align: 'right', width: 110 },
              ].map(({ label, align, width }) => (
                <th key={label} style={{
                  background: BRAND_GREEN,
                  color: '#ffffff',
                  padding: '8px 12px',
                  textAlign: align as React.CSSProperties['textAlign'],
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  whiteSpace: 'nowrap',
                  width: width ?? undefined,
                }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="inv-tbody">
            {items.map((item, idx) => (
              <tr key={`${item.id}-${item.size ?? idx}`}>
                <td style={{ padding: '8px 12px', color: '#9ca3af', verticalAlign: 'middle' }}>
                  {idx + 1}
                </td>
                <td style={{ padding: '8px 12px', fontWeight: 500, color: '#111827', verticalAlign: 'middle' }}>
                  {item.nameEn}
                  {item.size && (
                    <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 6, fontWeight: 400 }}>
                      ({item.size})
                    </span>
                  )}
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'right', color: '#374151', verticalAlign: 'middle' }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'right', color: '#374151', verticalAlign: 'middle' }}>
                  {fmt(item.price)}
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#111827', verticalAlign: 'middle' }}>
                  {fmt(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ══════════════════════════════════════════════════════════
            TOTALS — right-aligned 280px block, payment badge below
        ══════════════════════════════════════════════════════════ */}
        <div className="inv-totals" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: 16,
          borderTop: '1px solid #e5e7eb',
          marginTop: 0,
        }}>
          <div style={{ width: 280 }}>

            {/* Subtotal */}
            <div style={totalsRow}>
              <span style={totalsLabel}>Subtotal</span>
              <span style={totalsValue}>{fmt(subtotal)}</span>
            </div>

            {/* Discount — conditional */}
            {discount > 0 && (
              <div style={totalsRow}>
                <span style={totalsLabel}>Discount</span>
                <span style={{ ...totalsValue, color: BRAND_GREEN }}>− {fmt(discount)}</span>
              </div>
            )}

            {/* Shipping */}
            <div style={totalsRow}>
              <span style={totalsLabel}>Shipping</span>
              <span style={totalsValue}>{shipping === 0 ? 'FREE' : fmt(shipping)}</span>
            </div>

            {/* Tax — conditional */}
            {tax > 0 && (
              <div style={totalsRow}>
                <span style={totalsLabel}>Tax</span>
                <span style={totalsValue}>{fmt(tax)}</span>
              </div>
            )}

            {/* Grand Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `2px solid #111827`,
              marginTop: 10,
              paddingTop: 10,
            }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>Grand Total</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: BRAND_GREEN }}>{fmt(total)}</span>
            </div>

            {/* Payment method badge — below grand total, right-aligned */}
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <PaymentBadge method={paymentMethod} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FOOTER — tight single row, thank-you left / email right
        ══════════════════════════════════════════════════════════ */}
        <div style={{
          marginTop: 28,
          paddingTop: 12,
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#9ca3af',
          lineHeight: 1,
        }}>
          <span>Thank you for shopping with <strong style={{ color: '#6b7280' }}>{companyName}</strong>!</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {/* Mail icon — inline SVG, no extra dependency */}
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
              <path d="M2 7l8 5 8-5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {companyEmail}
          </span>
        </div>

      </div>
    </>
  );
}

// ── Shared totals row styles ──────────────────────────────────────────────────

const totalsRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 7,
};

const totalsLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
};

const totalsValue: React.CSSProperties = {
  fontSize: 12,
  color: '#374151',
  fontWeight: 500,
};
