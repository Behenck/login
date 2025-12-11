import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({children}: MainLayoutProps) {
  return (
    <>
      <header>
        <h1>Navbar</h1>
      </header>
      <main>
        {children}
      </main>
      <footer>
        footer
      </footer>
    </>
  )
}