"use server"

import { searchPhysiciansAction } from "@/actions/db/physicians-actions"
import { Suspense } from "react"
import { ResultsPageSkeleton } from "./_components/results-page-skeleton"
import { ResultsClientContent } from "./_components/results-client-content"

export default async function ResultsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <Suspense fallback={<ResultsPageSkeleton />}>
      <ResultsPageFetcher searchParams={searchParams} />
    </Suspense>
  )
}

async function ResultsPageFetcher({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = (searchParams.query as string) || ""
  const location = (searchParams.location as string) || ""
  const page = Number(searchParams.page) || 1
  const view = searchParams.view as string | undefined

  const result = await searchPhysiciansAction({
    query,
    filters: {
      ...(location && location.match(/^\d{5}$/)
        ? { zip: location }
        : location
          ? { state: location }
          : {})
    },
    page
  })

  if (!result.isSuccess) {
    throw new Error(result.message)
  }

  return (
    <ResultsClientContent
      initialData={{
        physicians: result.data.physicians,
        totalCount: result.data.totalCount,
        totalPages: result.data.totalPages,
        currentPage: result.data.currentPage
      }}
      searchParams={{
        query,
        location,
        view
      }}
    />
  )
}
