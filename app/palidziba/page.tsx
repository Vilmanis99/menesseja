import { redirect } from "next/navigation";

// The Help section was merged into the educational "Kas ir Mēness sēja?" page.
export default function PalidzibaPage() {
  redirect("/macies");
}
