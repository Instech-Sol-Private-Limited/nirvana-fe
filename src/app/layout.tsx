import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "../styles/globals.css";

const roboto = Roboto({
  weight: "400",
  variable: "--font-roboto",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gulf Schooling — An Online One-Stop Portal",
  description:
    "Gulf Schooling is an online one-stop portal for all education institutions in the gulf.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${montserrat.variable} overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
