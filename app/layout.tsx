import type { Metadata } from "next";
import {
  Geist, Geist_Mono, Outfit, Bricolage_Grotesque, Instrument_Serif
 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import Nav from "@/components/nav/page";
import { auth, signIn, signOut } from "@/auth";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
 
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  style: ['normal'], subsets: ['latin'], variable: '--font-instrument-serif',
  weight: "400"
});

const bricolageGrotesque = Bricolage_Grotesque({
  style: ['normal'], subsets: ['latin'], variable: '--font-bricolage-grotesque',
  weight: "400"
});

export const metadata: Metadata = {
  title: "Contribution Analyzer | GitHub · AI · Insights",
  description: "Turn commit history into analytical summaries. Pick a repo, branch, and developer—get a detailed report with features, impact, and key areas.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const handleSignIn = async () => {
    "use server";
    await signIn("github", { redirectTo: "/" });
  };
  const handleSignOut = async () => {
    "use server";
    await signOut();
  };
  return (
    <html lang="en" className={outfit.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable}   ${instrumentSerif.variable} ${bricolageGrotesque.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav session={session} onSignIn={handleSignIn} onSignOut={handleSignOut} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
