import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import { cn } from "./lib/utils";
import Provider from "./_trpc/Provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(
        "relative h-full font-sans antialiased",
        inter.className
      )}>
        <main className='relative min-h-screen flex flex-col'>
          <Provider>
            <NavBar />
            <div className="flex-grow flex-1">
              {children}
            </div>
          </Provider>
        </main>

        <Toaster position='top-center' richColors />
      </body>
    </html>
  );
}
