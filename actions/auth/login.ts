'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import getSupabaseRouteAndActionClient from '@/utils/supabase/getSupabaseRouteAndActionClient';
import { LoginSchema } from '@/zod/login';

function formatZodError(zodError: any): string {
  // Check if the error is indeed a ZodError with issues
  if (zodError && zodError.issues && Array.isArray(zodError.issues)) {
    const errorMessages = zodError.issues.map((issue: any) => {
      // For each issue, return a string describing the error
      return `Expected ${issue.expected} for ${issue.path.join(
        '.'
      )} but received ${issue.received}: ${issue.message}`;
    });
    // Join all error messages into a single string
    return errorMessages.join('. ');
  } else {
    // If the error format is unexpected, return a generic message
    return 'An unknown error occurred';
  }
}

export async function login(prevState: {}, formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const parsed = LoginSchema.safeParse(data);

    if (!parsed.success) {
      const errorMessage = formatZodError(parsed.error);
      return {
        error: errorMessage,
      };
    }

    const supabase = await getSupabaseRouteAndActionClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    return { error: 'Error logging in' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
