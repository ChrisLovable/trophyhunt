"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Target, Crosshair, MapPin, Trophy, Users } from "lucide-react";
import { LS_LANG, type Lang } from "@/lib/app/use-lang";

const tabs = [
  { href: "/rifle", icon: Target, label: "Rifle", af: "Geweer" },
  { href: "/ballistics", icon: Crosshair, label: "Ballistics", af: "Ballistiek" },
  { href: "/hunt-log", icon: MapPin, label: "Hunt Log", af: "Jag Log" },
  { href: "/measurements", icon: Trophy, label: "Trophy", af: "Trofee" },
  { href: "/community", icon: Users, label: "Community", af: "Gemeenskap" },
];

export default function BottomNav() {
  const path = usePathname();
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const l = localStorage.getItem(LS_LANG) as Lang | null;
    if (l) setLang(l);
  }, [path]);

  return (
    <nav className="th-bottom-nav flex items-center h-16">
      {tabs.map(({ href, icon: Icon, label, af }) => {
        const active = path.startsWith(href);
        return (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center gap-0.5">
            <Icon size={20} style={{ color: active ? "#C8A96E" : "#5A6040" }} strokeWidth={active ? 2 : 1.5} />
            <span style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 600, color: active ? "#C8A96E" : "#5A6040", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.52rem", textAlign: "center", lineHeight: 1.1 }}>
              {lang === "en" ? label : af}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
