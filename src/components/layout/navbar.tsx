"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { Anton, Figtree } from "next/font/google";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchOverlay } from "@/components/layout/search-overlay";

const display = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const sans = Figtree({ subsets: ["latin"], display: "swap" });

const nav_link = [
  { label: "Jelajahi acara", href: "/events" },
  { label: "Bantuan", href: "/help" },
  { label: "Buat acara", href: "/organizer" },
  { label: "Hubungi sales", href: "/sales" },
  { label: "Masuk", href: "/login" },
] as const;

const countries = [
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "SG", name: "Singapura", flag: "🇸🇬" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "PH", name: "Filipina", flag: "🇵🇭" },
  { code: "US", name: "Amerika Serikat", flag: "🇺🇸" },
] as const;

type Country = (typeof countries)[number];

const SEARCH_PLACEHOLDER = "Cari acara, venue, atau kota";

function useHideOnScroll(onHide: () => void, threshold = 5, topOffset = 24) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y <= topOffset) setVisible(true);
      else if (delta > threshold) {
        setVisible(false);
        onHide();
      } else if (delta < -threshold) setVisible(true);

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHide, threshold, topOffset]);

  return visible;
}

function SearchTrigger({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={SEARCH_PLACEHOLDER}
      aria-haspopup="dialog"
      onClick={onClick}
      className={`relative flex h-12 items-center rounded-full bg-neutral-100 pl-14 pr-5 text-left text-[17px] text-neutral-600 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 ${className}`}
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
      />
      <span>{SEARCH_PLACEHOLDER}</span>
    </button>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("ID");
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const desktopCountryRef = useRef<HTMLDivElement>(null);
  const mobileCountryRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const visible = useHideOnScroll(closeMenu);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const selectedCountry =
    countries.find((country) => country.code === countryCode) ?? countries[0];

  useEffect(() => {
    if (!countryMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !desktopCountryRef.current?.contains(target) &&
        !mobileCountryRef.current?.contains(target)
      ) {
        setCountryMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCountryMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [countryMenuOpen]);

  const selectCountry = (country: Country) => {
    setCountryCode(country.code);
    setCountryMenuOpen(false);
  };

  const renderCountryPicker = (
    className: string,
    pickerRef: RefObject<HTMLDivElement | null>,
  ) => (
    <div ref={pickerRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        aria-label={`Pilih negara, saat ini ${selectedCountry.name}`}
        aria-haspopup="listbox"
        aria-expanded={countryMenuOpen}
        onClick={() => setCountryMenuOpen((open) => !open)}
        className="flex h-10 items-center gap-1.5 rounded-lg border border-black/20 px-2.5 text-[13px] font-semibold transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <span aria-hidden="true" className="text-base leading-none">
          {selectedCountry.flag}
        </span>
        <span>{selectedCountry.code}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform ${countryMenuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {countryMenuOpen && (
        <div
          role="listbox"
          aria-label="Pilih negara"
          className="absolute left-0 top-full z-[60] mt-2 w-56 overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 text-black shadow-xl"
        >
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              role="option"
              aria-selected={countryCode === country.code}
              onClick={() => selectCountry(country)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            >
              <span aria-hidden="true" className="text-lg">
                {country.flag}
              </span>
              <span className="flex-1">{country.name}</span>
              <span className="text-xs text-neutral-500">{country.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const closePanels = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={`${sans.className} fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white text-black transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav
          aria-label="Navigasi utama"
          className="mx-auto flex h-16 max-w-[1600px] items-center gap-2 px-4 md:h-21 md:gap-4 md:px-8 xl:gap-6 xl:px-10"
        >
          <Link
            href="/"
            aria-label="Aftertix, halaman utama"
            onClick={closePanels}
            className={`${display.className} shrink-0 text-[27px] uppercase leading-none tracking-[0.01em] md:text-[38px]`}
          >
            Aftertix
          </Link>

          <SearchTrigger
            onClick={() => setSearchOpen(true)}
            className="hidden min-w-45 flex-1 xl:flex xl:max-w-90"
          /> 

          {renderCountryPicker("hidden xl:block", desktopCountryRef)}

          <div className="ml-auto flex items-center gap-1 xl:hidden">
            {renderCountryPicker("", mobileCountryRef)}
            <button
              type="button"
              aria-label={searchOpen ? "Pencarian terbuka" : "Cari acara"}
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen(true);
                setMenuOpen(false);
              }}
              className="rounded-full p-2.5 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black lg:hidden"
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((v) => !v);
                setSearchOpen(false);
              }}
              className="rounded-full p-2.5 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="ml-auto hidden shrink-0 items-center gap-2 xl:flex">
            <div className="flex items-center gap-2">
              {nav_link.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex min-h-12 items-center rounded-xl px-3 py-3 text-[15px] font-semibold tracking-tight text-black/75 transition-colors hover:bg-black/10 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 active:scale-[0.99]"
                >
                  {label}
                </Link>
              ))}
            </div>

            <Button
              nativeButton={false}
              render={<Link href="/app" />}
              className="liquid-btn group relative flex h-12 shrink-0 justify-center overflow-hidden rounded-xl border-2 border-black bg-black px-7 text-center text-[13px] font-extrabold uppercase leading-[1.3] tracking-[0.08em] text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              <span aria-hidden="true" className="liquid-fill" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-black group-focus-visible:text-black">
                Touch to download
              </span>
            </Button>
          </div>
        </nav>

        {menuOpen && (
          <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-black/5 bg-white px-4 pb-5 pt-1 xl:hidden md:max-h-[calc(100dvh-5.25rem)] md:px-5">
            <div className="mx-auto flex max-w-xl flex-col">
              {nav_link.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closePanels}
                  className="border-b border-black/5 py-3.5 text-base font-medium leading-5 transition-colors hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                >
                  {label}
                </Link>
              ))}
              <Button
                nativeButton={false}
                render={<Link href="/app" onClick={closePanels} />}
                className="liquid-btn group relative mt-4 flex h-11 w-full justify-center overflow-hidden rounded-full border-2 border-black bg-black px-7 text-center text-[13px] font-extrabold uppercase leading-[1.3] tracking-[0.08em] text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <span aria-hidden="true" className="liquid-fill" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-black group-focus-visible:text-black">
                  Touch to download
                </span>
              </Button>
            </div>
          </div>
        )}
      </header>
      <SearchOverlay
        isOpen={searchOpen}
        onClose={closeSearch}
        className={sans.className}
      />
    </>
  );
}
