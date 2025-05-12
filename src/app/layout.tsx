import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forum Dashboard",
  description: "Thread forum dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} bg-cyan-50`}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-900 overflow-hidden text-gray-100">
            <Navbar />
            <main className="flex flex-row flex-1 pt-28 p-6">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}