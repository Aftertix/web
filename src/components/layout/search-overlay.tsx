"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
};

export function SearchOverlay({ isOpen, onClose, className = "" }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-[100] bg-black/60 px-5 pt-[clamp(96px,16vh,160px)] backdrop-blur-sm md:px-8 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Cari acara"
            className="mx-auto w-full max-w-[760px]"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <form
              action="/"
              method="get"
              role="search"
              className="flex h-14 items-center gap-4 rounded-full bg-white px-5 text-black shadow-2xl md:h-14 md:px-6"
            >
              <Search aria-hidden="true" className="h-5 w-5 shrink-0" />
              <label htmlFor="event-search" className="sr-only">
                Cari acara, venue, atau kota
              </label>
              <input
                ref={inputRef}
                id="event-search"
                type="text"
                inputMode="search"
                enterKeyHint="search"
                name="q"
                placeholder="Cari acara, venue, atau kota"
                className="h-full min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-neutral-500"
              />
              <button
                type="button"
                aria-label="Tutup pencarian"
                onClick={onClose}
                className="shrink-0 rounded-full p-1 text-neutral-400 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <X className="h-6 w-6" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
