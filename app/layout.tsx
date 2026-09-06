import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/DisplayContext";

const geologica = Geologica({
  weight: "400",
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CFS Data Stats",
  description: "Track health data efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geologica.variable} h-full antialiased`}
    >
      <body className="scrollbar-gutter-stable min-h-full flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
