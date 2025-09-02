import "./globals.css";
import Providers from "./providers";
import Sidebar from "./components/sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-100 dark:bg-gray-900 transition-colors">
        <Providers>
          <div className="flex">
            {/* Sidebar is always present */}
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
