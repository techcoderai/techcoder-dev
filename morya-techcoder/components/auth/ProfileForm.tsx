"use client";

import { useActionState, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormMessage } from "@/components/auth/AuthUi";
import { updateDisplayName, type ProfileFormState } from "@/app/(site)/account/actions";
import { DISPLAY_NAME_MAX_LENGTH } from "@/lib/engagement/validation";

export function ProfileForm({ displayName }: { displayName: string }) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(updateDisplayName, {
    status: "idle",
  });
  const { refreshProfile } = useAuth();
  const id = useId();

  // Keep the navbar avatar/name in sync after a successful save.
  useEffect(() => {
    if (state.status === "saved") void refreshProfile();
  }, [state, refreshProfile]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Field
        id={id}
        name="displayName"
        label="Display name"
        defaultValue={displayName}
        maxLength={DISPLAY_NAME_MAX_LENGTH}
        autoComplete="name"
        hint="Shown publicly next to your responses."
        required
        disabled={pending}
      />
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="btn-primary focus-ring px-5 py-2.5 text-sm disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <div aria-live="polite">
          {state.status === "saved" && <FormMessage tone="success">{state.message}</FormMessage>}
          {state.status === "error" && <FormMessage tone="error">{state.message}</FormMessage>}
        </div>
      </div>
    </form>
  );
}

export function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await signOut();
        router.push("/");
        router.refresh();
      }}
      className="focus-ring inline-flex items-center gap-2 rounded text-sm font-medium text-tc-text-muted transition-colors duration-[var(--tc-dur)] hover:text-tc-primary"
    >
      <LogOut size={15} aria-hidden="true" />
      Sign out
    </button>
  );
}
