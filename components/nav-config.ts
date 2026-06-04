export interface NavItem {
  href: string;
  label: string;
  icon: string;
  /** Show in the compact mobile bottom bar */
  primary?: boolean;
}

/** Single source of truth for sidebar + bottom nav, in display order. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dārzs", icon: "nature_people", primary: true },
  { href: "/kalendars", label: "Kalendārs", icon: "calendar_month", primary: true },
  { href: "/celvedis", label: "Ceļvedis", icon: "local_library", primary: true },
  { href: "/pukes", label: "Puķes", icon: "local_florist", primary: true },
  { href: "/planotajs", label: "Plānotājs", icon: "architecture" },
  { href: "/kaitekli", label: "Kaitēkļi", icon: "pest_control" },
  { href: "/topi", label: "Topi", icon: "trending_up" },
  { href: "/receptes", label: "Receptes", icon: "compost" },
  { href: "/kopiena", label: "Kopiena", icon: "groups" },
  { href: "/dienasgramata", label: "Dienasgrāmata", icon: "menu_book" },
  { href: "/meness", label: "Mēness", icon: "brightness_3" },
];

export const NAV_FOOTER: NavItem[] = [
  { href: "/macies", label: "Kas ir Mēness sēja?", icon: "school" },
  { href: "/raksti", label: "Raksti", icon: "article" },
  { href: "/augi", label: "Augu enciklopēdija", icon: "eco" },
  { href: "/regioni", label: "Reģioni", icon: "map" },
  { href: "/par", label: "Par mums", icon: "info" },
  { href: "/iestatijumi", label: "Iestatījumi", icon: "settings" },
];
