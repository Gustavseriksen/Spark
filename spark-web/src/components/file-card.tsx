"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type FormatFileProps =
  | "doc"
  | "pdf"
  | "md"
  | "mdx"
  | "csv"
  | "xls"
  | "xlsx"
  | "txt"
  | "ppt"
  | "pptx"
  | "zip"
  | "rar"
  | "tar"
  | "gz"
  | "code"
  | "html"
  | "js"
  | "jsx"
  | "tsx"
  | "css"
  | "json"
  | "img"
  | "png"
  | "jpg"
  | "jpeg"
  | "video"

type FileCardProps = {
  formatFile: FormatFileProps
  name: string
}

const DefaultPlaceholder = () => (
  <div className="space-y-1.5">
    <div className="flex gap-2">
      <div className="bg-foreground/20 h-0.5 w-1/2 rounded-full" />
    </div>
    <div className="flex gap-1">
      <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
      <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
    </div>
    <div className="flex gap-1">
      <div className="bg-foreground/10 h-0.5 w-1/2 rounded-full" />
      <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
    </div>
    <div className="flex gap-1">
      <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
      <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
    </div>
    <div className="flex gap-1">
      <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
      <div className="bg-foreground/10 h-0.5 w-1/2 rounded-full" />
    </div>
    <div className="flex gap-1">
      <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
    </div>
  </div>
)

const colorBannerMap: Record<FormatFileProps, string> = {
  doc: "bg-blue-500 text-white",
  pdf: "bg-red-500 text-white",
  md: "bg-neutral-600 text-white",
  mdx: "bg-neutral-600 text-white",
  txt: "bg-gray-500 text-white",
  csv: "bg-teal-700 text-white",
  xls: "bg-emerald-600 text-white",
  xlsx: "bg-emerald-600 text-white",
  ppt: "bg-orange-500 text-white",
  pptx: "bg-orange-500 text-white",
  zip: "bg-purple-500 text-white",
  rar: "bg-purple-600 text-white",
  tar: "bg-yellow-600 text-white",
  gz: "bg-yellow-700 text-white",
  html: "bg-orange-600 text-white",
  js: "bg-yellow-600 text-white",
  jsx: "bg-blue-600 text-white",
  css: "bg-blue-600 text-white",
  json: "bg-yellow-500 text-white",
  tsx: "bg-blue-600 text-white",
  code: "bg-orange-600 text-white",
  img: "bg-pink-500 text-white",
  png: "bg-neutral-600 text-white",
  jpg: "bg-green-700 text-white",
  jpeg: "bg-green-700 text-white",
  video: "bg-green-700 text-white",
}

export function FileCard({ formatFile, name }: FileCardProps) {
  const colorBannerClass = colorBannerMap[formatFile]
  let filePlaceholder: ReactNode = <DefaultPlaceholder />

  if (formatFile === "md" || formatFile === "mdx") {
    filePlaceholder = (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <div className="text-foreground/30 text-[10px] font-bold">#</div>
          <div className="bg-foreground/20 h-0.5 w-6 rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
          <div className="bg-foreground/10 h-0.5 w-7 rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="bg-foreground/10 h-0.5 w-8 rounded-full" />
          <div className="bg-foreground/10 h-0.5 w-4 rounded-full" />
          <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <button className="group flex flex-col items-center gap-2 focus:outline-none">
      <div aria-hidden className="relative size-fit">
        <div
          className={cn(
            "absolute -right-2 bottom-1.5 z-20 rounded px-1.5 py-0.5 text-[8px] font-medium uppercase",
            colorBannerClass
          )}
        >
          {formatFile}
        </div>
        <div
          className={cn(
            "dark:bg-secondary ring-border relative z-10 space-y-3 rounded-md bg-white p-3 ring-1 w-24 h-32",
            "group-hover:ring-2 group-hover:ring-ring transition-shadow"
          )}
        >
          {filePlaceholder}
        </div>
      </div>
      <span className="text-xs text-center text-foreground/80 max-w-[5rem] truncate leading-tight">
        {name}
      </span>
    </button>
  )
}
