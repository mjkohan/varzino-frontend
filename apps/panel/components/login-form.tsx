"use client";

import { login, type LoginState } from "@/app/login/actions";
import { Button } from "@varzino/ui/components/button";
import { Field, Input } from "@varzino/ui/components/input";
import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="mt-8 flex flex-col gap-5" noValidate>
      <Field label="شماره همراه" htmlFor="phone">
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="username"
          dir="ltr"
          placeholder="09121234567"
          defaultValue={state.phone}
          required
          aria-invalid={state.error ? true : undefined}
          className="h-11 text-start"
        />
      </Field>
      <Field label="رمز عبور" htmlFor="password" error={state.error}>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            dir="ltr"
            required
            aria-invalid={state.error ? true : undefined}
            className="h-11 pe-11 text-start"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
            className="absolute inset-y-0 end-0 flex w-11 cursor-pointer items-center justify-center text-fg-muted transition-colors hover:text-fg"
          >
            {showPassword ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
          </button>
        </div>
      </Field>
      <Button type="submit" size="xl" className="mt-1 w-full" disabled={pending}>
        {pending ? "در حال ورود…" : "ورود"}
      </Button>
    </form>
  );
}
