import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: {
    template: '%s | Kevlar',
    default: 'Kevlar — Component Scaffold for Mantine v9',
  },
  description:
    'Force conscious decisions about every dimension of user interaction. 108 components. 17 targets. Zero excuses.',
}

const navbar = (
  <Navbar
    logo={<span style={{ fontWeight: 800, fontSize: 18 }}>Kevlar</span>}
    projectLink="https://github.com/unlikefraction/kevlar"
  />
)

const footer = (
  <Footer>
    <span>MIT {new Date().getFullYear()} unlikefraction</span>
  </Footer>
)

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/unlikefraction/kevlar/tree/main/docs"
          footer={footer}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
