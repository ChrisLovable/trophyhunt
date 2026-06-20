"use client";

import { useState, useEffect, useCallback } from "react";

export type Lang = "en" | "af";
export const LS_LANG = "trophyhunt_lang";

export function useLang() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const l = localStorage.getItem(LS_LANG) as Lang | null;
    if (l) setLang(l);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next: Lang = prev === "en" ? "af" : "en";
      localStorage.setItem(LS_LANG, next);
      return next;
    });
  }, []);

  return { lang, toggleLang };
}
