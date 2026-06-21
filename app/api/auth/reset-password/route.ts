import { NextRequest, NextResponse } from 'next/server';
import { laravelErrorMessage, laravelPost } from '@/lib/laravel-server';

interface ResetPasswordRequestBody {
  token?: string;
  email?: string;
  password?: string;
}

interface ResetPasswordApiResponse {
  success: boolean;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ResetPasswordApiResponse>> {
  try {
    const body = (await request.json()) as ResetPasswordRequestBody;
    const token = (body.token ?? '').trim();
    const email = (body.email ?? '').trim();
    const password = body.password ?? '';

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and password are required.' },
        { status: 400 },
      );
    }

    const result = await laravelPost('/reset-password', {
      token,
      email,
      password,
      password_confirmation: password,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          message: laravelErrorMessage(result.data, 'Unable to reset password.'),
        },
        { status: result.status === 404 ? 503 : result.status },
      );
    }

    return NextResponse.json(
      {
        success: result.data.success ?? true,
        message: result.data.message ?? 'Password reset successfully.',
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
