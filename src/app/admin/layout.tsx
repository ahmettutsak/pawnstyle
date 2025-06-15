import { redirect } from "next/navigation";
import ANavbar from "@/components/ANavbar";
import { Playfair_Display, Poppins } from "next/font/google";
import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = true;
  if (!isAdmin) redirect("/");

  return (
    <html lang="en">
      <body className={`${poppins.variable} ${playfair.variable} antialiased`}>
        <ANavbar />
        <main className="ml-60 p-8 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
