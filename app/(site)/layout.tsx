import { ViewTransition } from 'react'
import Navbar from '@/components/navbar'
import ScrollToTopButton from '@/components/scroll-to-top-button'

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen bg-brand-void"
        tabIndex={-1}
      >
        <ViewTransition enter="page-fade" exit="page-fade" default="none">
          {children}
        </ViewTransition>
      </main>
      <ScrollToTopButton />
    </>
  )
}
