"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { site, telLink, whatsappLink } from "@/lib/site";

type WhatsAppLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel" | "onClick"
> & {
  message?: string;
};

/** A real link without JavaScript, with device-aware opening and recovery when hydrated. */
export function WhatsAppLink({
  message,
  children,
  className = "",
  ...props
}: WhatsAppLinkProps) {
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const [help, setHelp] = useState<{ blocked: boolean; embedded: boolean } | null>(null);

  function openChat(event: MouseEvent<HTMLAnchorElement>) {
    // Preserve the browser's normal new-tab / copy-link / keyboard behaviour.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const mobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const url = whatsappLink(message, mobile ? "app" : "web");
    let tab: Window | null = null;
    let opened = false;

    try {
      // Open synchronously during the click to retain user activation. Opening a
      // blank tab first lets us detect a blocked popup; the noopener window.open
      // feature returns null even on success. Sever the opener BEFORE navigation.
      tab = window.open("about:blank", "_blank");
      if (tab) {
        tab.opener = null;
        tab.location.replace(url);
        opened = true;
      }
    } catch {
      try {
        tab?.close();
      } catch {
        // A restrictive preview may also prevent access to the popup window.
      }
    }

    // We cannot inspect an external tab or determine whether the app is installed.
    // Leave useful recovery options on the site rather than claiming a chat opened.
    setHelp({ blocked: !opened, embedded: window.self !== window.top });
  }

  function closeHelp() {
    setHelp(null);
    triggerRef.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <a
        {...props}
        ref={triggerRef}
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        data-whatsapp-link="true"
        className={`${className} cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mpesa`}
        onClick={openChat}
      >
        {children}
      </a>
      {help
        ? createPortal(
            <WhatsAppHelp
              message={message}
              blocked={help.blocked}
              embedded={help.embedded}
              onClose={closeHelp}
            />,
            document.body,
          )
        : null}
    </>
  );
}

function WhatsAppHelp({
  message,
  blocked,
  embedded,
  onClose: onDismiss,
}: {
  message?: string;
  blocked: boolean;
  embedded: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const numberId = useId();
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  function onClose() {
    // Release the modal's inert background before restoring focus to its trigger.
    dialogRef.current?.close();
    onDismiss();
  }

  async function copyNumber() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(site.phoneE164);
      setCopyStatus("Number copied. Paste it into a new WhatsApp chat.");
    } catch {
      numberRef.current?.focus();
      numberRef.current?.select();
      setCopyStatus("Copy the selected number, then paste it into a new WhatsApp chat.");
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-3xl border border-stone-200 bg-white p-0 text-stone-900 shadow-2xl backdrop:bg-forest-900/60"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-mpesa-dark">
              {site.shortName}
            </p>
            <h2 id={titleId} className="mt-1 font-display text-2xl font-semibold">
              Chat on WhatsApp
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close WhatsApp help"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-xl text-stone-600 hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-mpesa"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          {blocked
            ? "Your browser blocked the new tab. Choose an option below to continue in this tab."
            : "If WhatsApp didn’t open, try the app or WhatsApp Web below."}
        </p>
        <p className="mt-2 text-sm font-semibold text-forest-700">{site.phoneDisplay}</p>

        <div className="mt-5 grid gap-3">
          <a
            href={whatsappLink(message, "app")}
            target="_top"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-mpesa px-5 py-3 text-sm font-semibold text-white transition hover:bg-mpesa-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mpesa"
          >
            Open WhatsApp
          </a>
          <a
            href={whatsappLink(message, "web")}
            target="_top"
            rel="noopener noreferrer"
            className="btn-secondary !min-h-12 !text-sm"
          >
            Use WhatsApp Web
          </a>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-stone-500">
          {embedded
            ? "WhatsApp cannot load inside this preview. These options open it in the main browser tab."
            : "These options open in your current tab. You may need to sign in to WhatsApp Web."}
        </p>

        <div className="mt-5 border-t border-stone-200 pt-4">
          <label htmlFor={numberId} className="label">Or start a chat with our number</label>
          <div className="flex gap-2">
            <input
              ref={numberRef}
              id={numberId}
              readOnly
              value={site.phoneE164}
              onFocus={(event) => event.currentTarget.select()}
              className="input min-w-0 !px-3 !py-2 font-mono !text-sm"
            />
            <button
              type="button"
              onClick={copyNumber}
              className="shrink-0 cursor-pointer rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-mpesa"
            >
              Copy number
            </button>
          </div>
          <p role="status" aria-live="polite" className="mt-2 text-xs text-stone-600">
            {copyStatus}
          </p>
          <a href={telLink} className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-forest-700 underline underline-offset-4">
            Call {site.phoneDisplay} instead
          </a>
        </div>
      </div>
    </dialog>
  );
}
