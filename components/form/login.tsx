'use client';

import { Button } from '@/components/ui/button';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AtSignIcon, KeyRoundIcon, SparklesIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useFormState } from 'react-dom';
import { LoadingFormUI } from '@/components/form/loading-disc';
import { login } from '@/actions/auth/login';
import { InputWIcon } from '@/components/ui/input-with-icon';
import { LoginSchema, TLoginSchema } from '@/zod/login';
import { useEffect, useRef } from 'react';

export const LoginForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(login, {
    error: '',
  });

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const errors = form.formState.errors;
  const control = form.control;
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = () => {
    form.handleSubmit(() => formRef?.current?.requestSubmit());
  };

  useEffect(() => {
    if (state.error) {
      toast({
        icon: 'error',
        description: state.error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div>
      <div className="flex flex-col text-center">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Login to your account
        </h1>
        <p className="text-sm text-muted-foreground mb-2">
          Enter your email and password below to login to your account
        </p>
      </div>
      <FormProvider {...form}>
        <form ref={formRef} action={formAction} onSubmit={onSubmit}>
          <div className="grid gap-2 p-3 mb-3 rounded-lg border shadow-sm relative">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div>
                    <FormLabel noErrorStyle>Email</FormLabel>
                    {errors.email && (
                      <FormMessage>{errors.email.message}</FormMessage>
                    )}
                  </div>
                  <FormControl>
                    <InputWIcon
                      placeholder="email@something.com"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      {...field}
                      icon={<AtSignIcon />}
                    />
                  </FormControl>
                </FormItem>
              )}
              disabled={isSubmitting}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div>
                    <FormLabel noErrorStyle>Password</FormLabel>
                    {errors.password && (
                      <>
                        <FormMessage>{errors.password.message}</FormMessage>
                      </>
                    )}
                  </div>
                  <FormControl>
                    <InputWIcon
                      type="password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      {...field}
                      icon={<KeyRoundIcon />}
                    />
                  </FormControl>
                </FormItem>
              )}
              disabled={isSubmitting}
            />

            <div className="flex flex-col-reverse justify-between sm:flex-row gap-2 mt-3">
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                variant={'default'}
                className="flex items-center gap-1"
                size={'sm'}
              >
                Login <SparklesIcon className="w-5 h-5" />
              </Button>
            </div>
            <LoadingFormUI />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
