import { NextRequest, NextResponse } from 'next/server';

interface ResetPasswordRequestBody {
  token?: string;
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
    const password = body.password ?? '';

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and password are required.' },
        { status: 400 },
      );
    }

    // TODO: Implement actual reset-password logic (verify token + update password)
    return NextResponse.json(
      { success: true, message: 'Password reset successfully.' },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500 },
    );
  }
}
