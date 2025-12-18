import { ProtectedRoute } from "@/components/ProtectedRoute";
import "./globals.css";
import { NavBarComponent } from "@/components/NavBar";
import SidebarHamburger from "@/components/SideBarHamburguer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-white text-black dark:bg-gray-500 dark:text-white transition-colors"
    >
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
