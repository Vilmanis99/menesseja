export interface NavItem {
  href: string;
  label: string;
  icon: string;
  /** Show in the compact mobile bottom bar */
  primary?: boolean;
}

/** Single source of truth for sidebar + drawer + bottom nav, in display order.
 *  Content sections first; Raksti + Augu enciklopēdija promoted out of the old
 *  footer group so our main content is actually discoverable. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dārzs", icon: "nature_people", primary: true },
  { href: "/kalendars", label: "Kalendārs", icon: "calendar_month", primary: true },
  { href: "/pukes", label: "Puķes", icon: "local_florist", primary: true },
  { href: "/kaitekli", label: "Kaitēkļi", icon: "pest_control", primary: true },
  { href: "/raksti", label: "Raksti", icon: "article" },
  { href: "/augi", label: "Augu enciklopēdija", icon: "eco" },
  { href: "/celvedis", label: "Sējas ceļvedis", icon: "local_library" },
  { href: "/receptes", label: "Receptes", icon: "compost" },
  { href: "/topi", label: "Topi", icon: "trending_up" },
  { href: "/planotajs", label: "Plānotājs", icon: "architecture" },
  { href: "/kopiena", label: "Kopiena", icon: "groups" },
  { href: "/dienasgramata", label: "Dienasgrāmata", icon: "menu_book" },
  { href: "/meness", label: "Mēness", icon: "brightness_3" },
];

/** Secondary / utility links — shown below a divider in the sidebar and drawer. */
export const NAV_FOOTER: NavItem[] = [
  { href: "/macies", label: "Kas ir Mēness sēja?", icon: "school" },
  { href: "/regioni", label: "Reģioni", icon: "map" },
  { href: "/par", label: "Par mums", icon: "info" },
  { href: "/iestatijumi", label: "Iestatījumi", icon: "settings" },
];
