import { NextRequest, NextResponse } from 'next/server';
import { laravelErrorMessage, laravelPost, validateRequestOrigin } from '@/lib/laravel-server';

interface ResetPasswordRequestBody {
  token?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

interface ResetPasswordApiResponse {
  success: boolean;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ResetPasswordApiResponse>> {
  const csrfError = validateRequestOrigin(request);
  if (csrfError) return csrfError as NextResponse<ResetPasswordApiResponse>;

  try {
    const body = (await request.json()) as ResetPasswordRequestBody;
    const token                = (body.token ?? '').trim();
    const email                = (body.email ?? '').trim();
    const password             = body.password ?? '';
    const password_confirmation = body.password_confirmation ?? '';

    if (!token || !password || !password_confirmation) {
      return NextResponse.json(
        { success: false, message: 'Token, password, and password confirmation are required.' },
        { status: 400 },
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match.' },
        { status: 422 },
      );
    }

    const result = await laravelPost('/reset-password', {
      token,
      email,
      password,
      password_confirmation,
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
