import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StoryCraft AI - 故事工坊",
  description: "AI驱动的故事图文创作助手",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
