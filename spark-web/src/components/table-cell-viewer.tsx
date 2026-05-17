"use client"

import { useState } from "react"
import { format, parse } from "date-fns"
import { ArrowUpRightIcon, ChevronDownIcon, CircleCheckBigIcon, CircleDashedIcon, CircleIcon, FileTextIcon, LoaderIcon, PaperclipIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface FileEntry {
  name: string
  size: string
}

interface TableCellViewerItem {
  id: number
  title: string
  company: string
  status: string
  postDate: string
  priority: string
  link: string
  startDate: string
  appliedDate: string | null
  description: string
  motivationLetter: FileEntry | null
  resume: FileEntry | null
  additionalFiles: FileEntry | null
  interviewOffer: boolean
  jobOffer: boolean
}

const statusStyles: Record<string, string> = {
  Submitted: "border-yellow-950 text-yellow-700 bg-[linear-gradient(110deg,#1a1500,45%,#854d0e,55%,#1a1500)] bg-size-[200%_100%]",
  Pending: "border-red-950 text-red-700 bg-[linear-gradient(110deg,#1a0505,45%,#7f1d1d,55%,#1a0505)] bg-size-[200%_100%]",
  "In Process": "border-amber-950 text-amber-700 bg-[linear-gradient(110deg,#100800,45%,#713f12,55%,#100800)] bg-size-[200%_100%]",
}

const priorityLevel: Record<string, number> = {
  "Very High": 5, High: 4, Medium: 3, Low: 2, "Very Low": 1, None: 0,
}

function PriorityDots({ priority }: { priority: string }) {
  const level = priorityLevel[priority] ?? 0
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`size-3 rounded-full ${i < level ? "bg-foreground" : "bg-foreground/20"}`} />
      ))}
    </div>
  )
}

function FileRow({
  label,
  icon: Icon,
  file,
  mode = "read",
}: {
  label: string
  icon: React.ElementType
  file: FileEntry | null
  mode?: "read" | "edit"
}) {
  if (file) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="flex items-center gap-3 rounded-lg border bg-muted p-3">
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">{file.size}</span>
          </div>
          {mode === "edit" ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm" className="border-destructive/40">Delete</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm">Open</Button>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3 rounded-lg border border-dashed p-3">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-sm font-medium">No file yet</span>
          <span className="text-xs text-muted-foreground">Upload a file from your computer</span>
        </div>
        <Button variant="outline" size="sm">Upload File</Button>
      </div>
    </div>
  )
}

function OfferRow({ label, date }: { label: string; date: boolean }) {
  const [isReceived, setIsReceived] = useState(date)

  if (isReceived) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-size-[200%_100%] p-2 animate-shimmer">
        <button onClick={() => setIsReceived(false)} className="shrink-0">
          <CircleCheckBigIcon className="size-4 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" />
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-300">{label}</span>
          <span className="text-xs text-slate-500">Received</span>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-3 rounded-lg border p-2">
      <button onClick={() => setIsReceived(true)} className="shrink-0">
        <CircleIcon className="size-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
      </button>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">Not received yet</span>
      </div>
    </div>
  )
}

export function TableCellViewer({ item }: { item: TableCellViewerItem }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-start gap-4">
          <div className="flex w-3/5 shrink-0 flex-col gap-1">
            <DrawerTitle>{item.title}</DrawerTitle>
            <DrawerDescription>{item.company}</DrawerDescription>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
            <Badge asChild>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                Open Link <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            </Badge>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-xs text-muted-foreground">Posted Date</span>
              <span className="text-sm">{item.postDate}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-xs text-muted-foreground">Start Date</span>
              <span className="text-sm">{item.startDate}</span>
            </div>
          </div>
        </DrawerHeader>
        <Tabs defaultValue="read" className="flex flex-col flex-1 overflow-hidden">
          <TabsList className="mx-4 w-fit">
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          {/* Read tab */}
          <TabsContent value="read" className="flex flex-1 overflow-hidden md:flex-row">
            {/* Left panel - description */}
            <div className="no-scrollbar w-3/5 shrink-0 overflow-y-auto px-4 py-2 text-sm">
              <p className="whitespace-pre-wrap leading-relaxed">{item.description}</p>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            {/* Right panel */}
            <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
              <FileRow label="Motivation Letter" icon={FileTextIcon} file={item.motivationLetter} />
              <FileRow label="Resume" icon={FileTextIcon} file={item.resume} />
              <FileRow label="Additional Files" icon={PaperclipIcon} file={item.additionalFiles} />

              <Separator />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Status</span>
                  {(() => {
                    const Icon = item.status === "Submitted" ? CircleCheckBigIcon : item.status === "Pending" ? CircleDashedIcon : LoaderIcon
                    return (
                      <Badge variant="outline" className={`px-1.5 ${statusStyles[item.status] ?? "text-muted-foreground"}`}>
                        <Icon />
                        {item.status}
                      </Badge>
                    )
                  })()}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Applied Date</span>
                  <span className="text-sm">{item.appliedDate ?? "—"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Priority</span>
                  <PriorityDots priority={item.priority} />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <OfferRow label="Interview Offer" date={item.interviewOffer} />
                <OfferRow label="Job Offer" date={item.jobOffer} />
              </div>
            </div>
          </TabsContent>

          {/* Edit tab */}
          <TabsContent value="edit" className="flex flex-1 overflow-hidden md:flex-row">
            {/* Left panel - description */}
            <div className="flex w-3/5 shrink-0 flex-col overflow-hidden px-4 py-2">
              <Textarea
                id="description"
                defaultValue={item.description}
                className="no-scrollbar flex-1 resize-none text-sm leading-relaxed"
                placeholder="Enter job description..."
              />
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            {/* Right panel */}
            <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
              <div className="flex flex-col gap-3">
                <Label htmlFor="title">Title</Label>
                <Input id="title" defaultValue={item.title} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue={item.company} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={item.status}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="In Process">In Process</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue={item.priority}>
                    <SelectTrigger id="priority" className="w-full">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Very High">Very High</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Very Low">Very Low</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-3">
                <Label>Posted Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!item.postDate}
                      className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                      {item.postDate ? format(parse(item.postDate, "dd/MM/yyyy", new Date()), "PPP") : <span>Pick a date</span>}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={item.postDate ? parse(item.postDate, "dd/MM/yyyy", new Date()) : undefined}
                      defaultMonth={item.postDate ? parse(item.postDate, "dd/MM/yyyy", new Date()) : undefined}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!item.startDate}
                      className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                      {item.startDate ? format(parse(item.startDate, "dd/MM/yyyy", new Date()), "PPP") : <span>Pick a date</span>}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={item.startDate ? parse(item.startDate, "dd/MM/yyyy", new Date()) : undefined}
                      defaultMonth={item.startDate ? parse(item.startDate, "dd/MM/yyyy", new Date()) : undefined}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="link">Link</Label>
                <Input id="link" defaultValue={item.link} />
              </div>
              <Separator />
              <FileRow label="Motivation Letter" icon={FileTextIcon} file={item.motivationLetter} mode="edit" />
              <FileRow label="Resume" icon={FileTextIcon} file={item.resume} mode="edit" />
              <FileRow label="Additional Files" icon={PaperclipIcon} file={item.additionalFiles} mode="edit" />
              <Separator />
              <div className="flex flex-col gap-2">
                <OfferRow label="Interview Offer" date={item.interviewOffer} />
                <OfferRow label="Job Offer" date={item.jobOffer} />
              </div>
              <DrawerFooter className="mt-auto px-0">
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
                <Button variant="destructive" className="border-destructive/40">Delete</Button>
              </DrawerFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  )
}
