import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-full max-w-md" />
        </div>

        <Skeleton className="h-[600px] w-full rounded-lg" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[350px] w-full rounded-lg" />
          <Skeleton className="h-[350px] w-full rounded-lg" />
          <Skeleton className="h-[350px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
