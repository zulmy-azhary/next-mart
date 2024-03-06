import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme.provider";
import { ModalProvider } from "@/providers/modal.provider";
import "./tailwind.css";
import { Toaster } from "@/components/ui/sonner";

const openSans = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Next Mart | Home",
    template: "Next Mart | %s",
  },
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={openSans.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster position="bottom-center" richColors/>
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
