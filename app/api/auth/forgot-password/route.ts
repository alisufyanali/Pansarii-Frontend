import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Implement actual forgot-password logic (email reset link)
    return NextResponse.json(
      { success: true, message: 'Password reset link sent successfully.' },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500 },
    );
  }
}
