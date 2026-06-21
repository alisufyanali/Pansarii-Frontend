import { NextRequest, NextResponse } from 'next/server';
import { laravelErrorMessage, laravelPost } from '@/lib/laravel-server';

interface ForgotPasswordRequestBody {
  email?: string;
}

interface ForgotPasswordApiResponse {
  success: boolean;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ForgotPasswordApiResponse>> {
  try {
    const body = (await request.json()) as ForgotPasswordRequestBody;
    const email = (body.email ?? '').trim();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 },
      );
    }

    const result = await laravelPost('/forgot-password', { email });

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          message: laravelErrorMessage(result.data, 'Unable to send reset link.'),
        },
        { status: result.status === 404 ? 503 : result.status },
      );
    }

    return NextResponse.json(
      {
        success: result.data.success ?? true,
        message: result.data.message ?? 'Password reset link sent successfully.',
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500 },
    );
  }
}
