"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <BottomNav />
        </QueryClientProvider>
      </body>
    </html>
  );
}
