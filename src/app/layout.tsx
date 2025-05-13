import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/core/Navbar";
import { AuthProvider } from "@/context/AuthProvider";
import "./globals.css";
import { ToastContainer } from "react-toastify";

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
      <body suppressHydrationWarning={true} className={`${poppins.variable}`}>
        <main className="w-full">
          <AuthProvider>
            <div className="min-h-screen bg-gray-900 overflow-hidden text-gray-100">
              <Navbar />
              <div className="flex flex-row flex-1 pt-28 p-6">
                {children}
              </div>
            </div>

            <ToastContainer position="top-right" theme="dark" autoClose={3000} />
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}