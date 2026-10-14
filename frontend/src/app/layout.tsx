import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TERRATECH OS Industrial | SSOMA & Operaciones",
  description: "Sistema Operativo Industrial de Control de Acreditaciones, Pases de Mina, SSOMA y Checklists Pre-Uso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased dark`}
    >
      <head>
        {/* Anti-FOUC script para salas de control y despachos en modo oscuro */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('terratech-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-slate-50 dark:bg-black text-slate-900 dark:text-[#EDEDED] font-sans selection:bg-white selection:text-black min-h-screen flex flex-col transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
