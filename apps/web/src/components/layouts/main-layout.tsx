import type { ReactNode } from "react";
import { Header } from "../header";

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({children}: MainLayoutProps) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <footer>
        footer
      </footer>
    </>
  )
}