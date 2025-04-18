/*
<ai_context>
This layout provides a shared header and basic structure for (marketing) routes.
</ai_context>
*/

import Header from "@/components/header"

export default function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1">{children}</div>
    </div>
  )
}
