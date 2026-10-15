"use client";

import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthFlow, type AuthView } from "@/components/auth/AuthFlow";
import { authPanelClass } from "@/components/auth/AuthUi";
import { safeNextPath } from "@/lib/engagement/validation";

export type OpenAuthOptions = {
  view?: AuthView;
  /** Where email links and Google return to. Defaults to the current page. */
  next?: string;
  /** Short line explaining why sign-in was requested. */
  reason?: string;
  /** The reader closed the dialog without signing in. */
  onDismiss?: () => void;
  /** The page is about to leave for Google. */
  onBeforeRedirect?: () => void;
};

type ModalState = Omit<OpenAuthOptions, "view" | "next"> & {
  view: AuthView;
  next: string;
  pathname: string;
  opener: HTMLElement | null;
};

type AuthModalContextValue = { openAuth: (options?: OpenAuthOptions) => void };

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

/**
 * Hosts the site-wide sign-in dialog. UI state only: the session itself stays
 * in AuthProvider, and the forms are the same ones the /auth/* pages render.
 */
export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [modal, setModal] = useState<ModalState | null>(null);

  // Navigating away (Back, or a link in the dialog) leaves the flow behind.
  if (modal && modal.pathname !== pathname) setModal(null);

  const openAuth = useCallback(
    (options: OpenAuthOptions = {}) => {
      const here = `${window.location.pathname}${window.location.search}`;
      const active = document.activeElement;
      setModal({
        ...options,
        view: options.view ?? "sign-in",
        next: safeNextPath(options.next ?? (pathname.startsWith("/auth") ? "/" : here)),
        pathname,
        opener: active instanceof HTMLElement && active !== document.body ? active : null,
      });
    },
    [pathname]
  );

  const value = useMemo(() => ({ openAuth }), [openAuth]);

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {modal && (
        <AuthDialog
          modal={modal}
          onViewChange={(view) => setModal((m) => m && { ...m, view })}
          onDismiss={() => {
            modal.onDismiss?.();
            setModal(null);
          }}
          onSignedIn={() => {
            setModal(null);
            router.refresh();
          }}
        />
      )}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside <AuthModalProvider>");
  return ctx;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function AuthDialog({
  modal,
  onViewChange,
  onDismiss,
  onSignedIn,
}: {
  modal: ModalState;
  onViewChange: (view: AuthView) => void;
  onDismiss: () => void;
  onSignedIn: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pressStartedOnBackdrop = useRef(false);
  const headingId = useId();
  const { opener, view } = modal;

  // showModal() makes the page inert and puts the dialog in the top layer.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    const root = document.documentElement;
    const { overflow, scrollbarGutter } = root.style;
    const hasScrollbar = window.innerWidth > root.clientWidth;
    root.style.overflow = "hidden";
    if (hasScrollbar) root.style.scrollbarGutter = "stable";
    return () => {
      root.style.overflow = overflow;
      root.style.scrollbarGutter = scrollbarGutter;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [opener]);

  // Precise pointers start in the first field; touch starts on the heading so
  // the keyboard doesn't cover the dialog before the reader has read it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const field = window.matchMedia("(pointer: fine)").matches
      ? dialog.querySelector<HTMLInputElement>("input:not([disabled])")
      : null;
    (field ?? headingRef.current)?.focus();
  }, [view]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      className="auth-dialog"
      onCancel={(e) => {
        e.preventDefault();
        onDismiss();
      }}
      onClose={onDismiss}
      onKeyDown={onKeyDown}
      // Only a press that starts *and* ends on the backdrop dismisses, so
      // selecting text and releasing outside the panel never closes it.
      onPointerDown={(e) => {
        pressStartedOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressStartedOnBackdrop.current && e.target === e.currentTarget) onDismiss();
        pressStartedOnBackdrop.current = false;
      }}
    >
      <div className={cn(authPanelClass, "auth-dialog-panel relative m-auto")}>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          className="focus-ring absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-tc-text-light transition-colors duration-[var(--tc-dur)] hover:bg-tc-bg-elevated hover:text-tc-text sm:right-4 sm:top-4"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <AuthFlow
          view={view}
          next={modal.next}
          reason={modal.reason}
          onViewChange={onViewChange}
          onSignedIn={onSignedIn}
          onBeforeRedirect={modal.onBeforeRedirect}
          headingId={headingId}
          headingRef={headingRef}
          headingLevel="h2"
        />
      </div>
    </dialog>
  );
}
