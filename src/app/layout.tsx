import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Purity Matters | Confidential Pastoral Care & Anonymous Q&A",
  description:
    "Ask anonymous questions regarding sexual purity, habit loops, guilt, and emotional healing. Receive compassionate, biblically rooted pastoral guidance in complete confidentiality.",
  keywords: [
    "Purity Matters",
    "Anonymous Pastoral Counseling",
    "Christian Purity",
    "Freedom from Addiction",
    "Biblical Counseling",
    "Emotional Healing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased bg-[#EBECEF]">
      <body className="min-h-screen text-[#202328] bg-[#EBECEF] font-sans selection:bg-[#F6CE46] selection:text-[#202328]">
        {children}
      </body>
    </html>
  );
}
