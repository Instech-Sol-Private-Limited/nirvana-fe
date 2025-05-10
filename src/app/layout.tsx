// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { AuthProvider } from "@/context/AuthProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cyan-50`}
      >
        <AuthProvider>
          <div className="min-h-screen">
            <div className="">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Forum Dashboard</h1>

              <div className="bg-gray-900 overflow-hidden text-gray-100">
                <Navbar />

                <div className="flex flex-row">
                  <div className="hidden md:block">
                    <Sidebar />
                  </div>

                  <main className="flex-1 p-6">
                    {children}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}