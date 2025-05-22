"use client"

import { columns } from "@/components/ui/data-table/columns"
import { DataTable } from "@/components/ui/data-table/DataTable"
import { Usage } from "@/data/schema"
import { useEffect, useState } from "react"

export default function Details() {
  const [resources, setResources] = useState<Usage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResources() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/resources")

        if (!response.ok) {
          throw new Error("Failed to fetch resources")
        }

        const data = await response.json()

        // Since the API now returns data in the correct format, we can use it directly
        // No need for complex transformation
        setResources(
          data.resources.map((resource: any) => ({
            resourceName: resource.resourceName,
            course: resource.course,
            professor: resource.professor,
            status: resource.status,
            lastEdited: resource.lastEdited,
          })),
        )
      } catch (err) {
        console.error("Error fetching resources:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [])

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Details
      </h1>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading resources
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 sm:mt-6 lg:mt-10">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-gray-100"></div>
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Loading resources...
            </span>
          </div>
        ) : (
          <DataTable data={resources} columns={columns} />
        )}
      </div>
    </>
  )
}
