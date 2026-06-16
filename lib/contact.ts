/**
 * lib/contact.ts
 * Contact form submission (no auth required).
 */

import apiClient from './axios';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const submitContact = async (data: ContactPayload): Promise<{ success: boolean; message: string; data: { id: number } }> => {
  const res = await apiClient.post<{ success: boolean; message: string; data: { id: number } }>(
    '/contact',
    data,
  );
  return res.data;
};
