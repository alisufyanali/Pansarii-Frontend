"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiArrowLeftLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiAlertLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { api, getApiErrorMessage, isAxiosError } from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { DeviceContent } from '@/hooks/useDeviceDetection';
import ProfileLayout from '@/components/Desktop/Sections/profile/ProfileLayout';

// ── Validation ────────────────────────────────────────────────────────────────

const schema = z
  .object({
    current_password:      z.string().min(1, 'Current password is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol/special character'),
    password_confirmation: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

type FormValues = z.infer<typeof schema>;

// ── Shared form component ─────────────────────────────────────────────────────

function ChangePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const { user, updateMustChangePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [backendErrors, setBackendErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [show, setShow] = useState({ current: false, next: false, confirm: false });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setApiError('');
    setBackendErrors({});

    // Client check: phone number ke barabar nahi
    const cleanPhone = user?.phone ? user.phone.replace(/\D/g, '') : '';
    const cleanPwd = values.password.replace(/\D/g, '');
    if (user?.phone && (values.password === user.phone || (cleanPhone && cleanPwd && cleanPhone === cleanPwd))) {
      setBackendErrors(prev => ({
        ...prev,
        password: 'Password aapke phone number ke barabar nahi ho sakta',
      }));
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/change-password', {
        current_password:      values.current_password,
        password:              values.password,
        password_confirmation: values.password_confirmation,
      });
      toast.success('Password changed successfully.');
      updateMustChangePassword(false);
      reset();
      onSuccess?.();
      router.push('/profile');
    } catch (err) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { errors?: Record<string, string[]>; message?: string } | undefined;
        if (data?.errors) {
          const mapped: Partial<Record<keyof FormValues, string>> = {};
          if (data.errors.current_password?.[0]) mapped.current_password = data.errors.current_password[0];
          if (data.errors.password?.[0]) mapped.password = data.errors.password[0];
          if (data.errors.password_confirmation?.[0]) mapped.password_confirmation = data.errors.password_confirmation[0];
          setBackendErrors(mapped);
        }
      }
      const msg = getApiErrorMessage(err);
      setApiError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full pl-10 pr-10 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
      hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Must change password warning banner */}
      {user?.must_change_password && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm flex items-start gap-2.5">
          <RiAlertLine className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Security ke liye password badalna zaroori hai.</p>
            <p className="text-xs text-amber-700 mt-0.5">Purana password aapka registered phone number hai.</p>
          </div>
        </div>
      )}

      {apiError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* Current password */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          Current Password
        </label>
        <div className="relative">
          <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={show.current ? 'text' : 'password'}
            autoComplete="current-password"
            disabled={isLoading}
            placeholder="Enter current password"
            {...register('current_password')}
            className={inputCls(!!errors.current_password || !!backendErrors.current_password)}
          />
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Toggle visibility"
          >
            {show.current ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
          </button>
        </div>
        {(errors.current_password?.message || backendErrors.current_password) && (
          <p className="mt-1 text-xs text-red-500">
            {backendErrors.current_password || errors.current_password?.message}
          </p>
        )}
      </div>

      {/* New password */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          New Password
        </label>
        <div className="relative">
          <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={show.next ? 'text' : 'password'}
            autoComplete="new-password"
            disabled={isLoading}
            placeholder="Enter new password"
            {...register('password')}
            className={inputCls(!!errors.password || !!backendErrors.password)}
          />
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Toggle visibility"
          >
            {show.next ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
          </button>
        </div>

        {/* Persistent password rules info */}
        <div className="mt-1.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-500 space-y-0.5">
          <p className="font-semibold text-gray-700">Password rules:</p>
          <p>• Kam az kam 8 characters (min 8 characters)</p>
          <p>• Uppercase aur lowercase letters (A-Z, a-z)</p>
          <p>• Kam az kam ek symbol / special character (!@#$%^&*)</p>
          <p>• Phone number ke barabar nahi ho sakta</p>
        </div>

        {(errors.password?.message || backendErrors.password) && (
          <p className="mt-1 text-xs text-red-500">
            {backendErrors.password || errors.password?.message}
          </p>
        )}
      </div>

      {/* Confirm new password */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          Confirm New Password
        </label>
        <div className="relative">
          <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={show.confirm ? 'text' : 'password'}
            autoComplete="new-password"
            disabled={isLoading}
            placeholder="Repeat new password"
            {...register('password_confirmation')}
            className={inputCls(!!errors.password_confirmation || !!backendErrors.password_confirmation)}
          />
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Toggle visibility"
          >
            {show.confirm ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
          </button>
        </div>
        {(errors.password_confirmation?.message || backendErrors.password_confirmation) && (
          <p className="mt-1 text-xs text-red-500">
            {backendErrors.password_confirmation || errors.password_confirmation?.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-green-700 hover:bg-green-600 active:bg-green-800 text-white text-sm font-bold rounded-2xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : 'Update Password'}
      </button>
    </form>
  );
}

// ── Mobile view ───────────────────────────────────────────────────────────────

function MobileChangePassword() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-poppins">
      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 flex items-center gap-3 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          aria-label="Go back"
        >
          <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
        </button>
        <h1 className="text-base font-bold text-gray-900">Change Password</h1>
      </div>

      <div className="px-4 pt-6 space-y-4">
        {/* Info banner */}
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
          <p className="text-xs text-green-700 font-medium leading-relaxed">
            Choose a strong password with at least 8 characters. You will be redirected to your profile after a successful change.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <ChangePasswordForm />
        </div>

        <p className="text-center text-xs text-gray-400">
          Forgot your current password?{' '}
          <Link href="/forgot-password" className="text-green-700 font-semibold underline underline-offset-2">
            Reset it here
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Desktop view ──────────────────────────────────────────────────────────────

function DesktopChangePassword() {
  return (
    <ProfileLayout title="Change Password" subtitle="Update your account login credentials">
      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <RiLockPasswordLine className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Password Security</h2>
              <p className="text-xs text-gray-400">Use at least 8 characters with letters and numbers</p>
            </div>
          </div>

          <ChangePasswordForm />

          <p className="mt-5 text-xs text-gray-400 text-center">
            Forgot your current password?{' '}
            <Link href="/forgot-password" className="text-green-700 font-semibold hover:underline">
              Reset it here
            </Link>
          </p>
        </div>
      </div>
    </ProfileLayout>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function ChangePasswordPage() {
  return (
    <DeviceContent
      mobile={<MobileChangePassword />}
      desktop={<DesktopChangePassword />}
    />
  );
}
