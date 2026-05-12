import { NextRequest, NextResponse } from 'next/server';

// Promo codes are stored server-side only — never exposed to the client
interface PromoResult {
  valid: boolean;
  type: 'percentage' | 'fixed' | 'freeship' | null;
  value: number;
  message: string;
}

// In production, these would come from a database
const PROMO_CODES: Record<string, { type: 'percentage' | 'fixed' | 'freeship'; value: number }> = {
  SAVE10:   { type: 'percentage', value: 10  },
  SAVE20:   { type: 'percentage', value: 20  },
  WELCOME:  { type: 'fixed',      value: 100 },
  FREESHIP: { type: 'freeship',   value: 0   },
};

export async function POST(request: NextRequest): Promise<NextResponse<PromoResult>> {
  try {
    const body = await request.json() as { code?: string; subtotal?: number };
    const code = (body.code ?? '').toUpperCase().trim();
    const subtotal = typeof body.subtotal === 'number' ? body.subtotal : 0;

    if (!code) {
      return NextResponse.json({ valid: false, type: null, value: 0, message: 'Please enter a promo code' });
    }

    const promo = PROMO_CODES[code];

    if (!promo) {
      return NextResponse.json({ valid: false, type: null, value: 0, message: 'Invalid promo code' });
    }

    let discountAmount = 0;
    let message = '';

    if (promo.type === 'percentage') {
      discountAmount = Math.round((subtotal * promo.value) / 100);
      message = `${promo.value}% discount applied! You saved PKR ${discountAmount.toLocaleString()}`;
    } else if (promo.type === 'fixed') {
      discountAmount = Math.min(promo.value, subtotal);
      message = `PKR ${discountAmount.toLocaleString()} discount applied!`;
    } else if (promo.type === 'freeship') {
      discountAmount = 0; // shipping discount handled on frontend
      message = 'Free shipping applied!';
    }

    return NextResponse.json({
      valid: true,
      type: promo.type,
      value: discountAmount,
      message,
    });
  } catch {
    return NextResponse.json({ valid: false, type: null, value: 0, message: 'Something went wrong' }, { status: 500 });
  }
}
