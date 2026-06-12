"use client"

import React, { useState } from "react"
import { format, parseISO } from "date-fns"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { TagInput } from "@/components/tag-input"
import { createJobAd, updateJobAd, deleteJobAd, type JobAdDto, type JobAdPayload } from "@/lib/job-ads"

// Ensures a URL has a protocol prefix so the browser treats it as absolute
function normalizeUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `https://${url}`
}

// Formats an ISO date string for display, or a dash when missing
function displayDate(date: string | null): string {
  return date ? format(parseISO(date), "dd/MM/yyyy") : "—"
}

interface FileEntry {
  name: string
  size: string
}

const statusStyles: Record<string, string> = {
  Submitted: "border-yellow-950 text-yellow-700 bg-[linear-gradient(110deg,#1a1500,45%,#854d0e,55%,#1a1500)] bg-size-[200%_100%]",
  Pending: "border-red-950 text-red-700 bg-[linear-gradient(110deg,#1a0505,45%,#7f1d1d,55%,#1a0505)] bg-size-[200%_100%]",
  "In Process": "border-amber-950 text-amber-700 bg-[linear-gradient(110deg,#100800,45%,#713f12,55%,#100800)] bg-size-[200%_100%]",
}

const priorityLevel: Record<string, number> = {
  "Very High": 5, High: 4, Medium: 3, Low: 2, "Very Low": 1, None: 0,
}

function PriorityDots({ priority }: { priority: string | null }) {
  const level = priorityLevel[priority ?? ""] ?? 0
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

// Displays a date row — clicking the circle opens a date picker, clicking the check clears it
function OfferRow({
  label,
  date,
  onDateChange,
}: {
  label: string
  date: string | null
  onDateChange?: (isoDate: string | null) => void
}) {
  const [isReceived, setIsReceived] = useState(date !== null)
  const [receivedDate, setReceivedDate] = useState<Date | null>(
    date ? parseISO(date) : null
  )
  const [open, setOpen] = useState(false)

  if (isReceived) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-size-[200%_100%] p-2 animate-shimmer">
        <button
          onClick={() => {
            setIsReceived(false)
            setReceivedDate(null)
            onDateChange?.(null)
          }}
          className="shrink-0"
        >
          <CircleCheckBigIcon className="size-4 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" />
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-300">{label}</span>
          <span className="text-xs text-slate-500">
            {receivedDate ? `Received: ${format(receivedDate, "dd/MM/yyyy")}` : "Received"}
          </span>
        </div>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-3 rounded-lg border p-2">
        <PopoverTrigger asChild>
          <button className="shrink-0">
            <CircleIcon className="size-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          </button>
        </PopoverTrigger>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">Not received yet</span>
        </div>
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          onSelect={(d) => {
            if (d) {
              setReceivedDate(d)
              setIsReceived(true)
              setOpen(false)
              onDateChange?.(format(d, "yyyy-MM-dd"))
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

// Labelled calendar popover for a single optional date
function DateField({
  label,
  date,
  onSelect,
}: {
  label: string
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} defaultMonth={date} onSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function AddApplicationDrawer({
  children,
  onRefresh,
}: {
  children: React.ReactNode
  onRefresh: () => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [postDate, setPostDate] = useState<Date | undefined>()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [appliedDate, setAppliedDate] = useState<Date | undefined>(() => new Date())
  const [link, setLink] = useState("")
  const [salary, setSalary] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [applicationFollowUp, setApplicationFollowUp] = useState<string | null>(null)
  const [interviewFollowUp, setInterviewFollowUp] = useState<string | null>(null)
  const [interviewOffer, setInterviewOffer] = useState<string | null>(null)
  const [jobOffer, setJobOffer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Resets all fields back to their defaults (applied date defaults to today)
  function resetForm() {
    setTitle("")
    setCompanyName("")
    setStatus("")
    setPriority("")
    setPostDate(undefined)
    setStartDate(undefined)
    setAppliedDate(new Date())
    setLink("")
    setSalary("")
    setDescription("")
    setTags([])
    setApplicationFollowUp(null)
    setInterviewFollowUp(null)
    setInterviewOffer(null)
    setJobOffer(null)
    setError(null)
  }

  // Validates, calls the API, then closes the drawer and refreshes the table
  async function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    if (!status) {
      setError("Status is required")
      return
    }
    setError(null)
    setLoading(true)
    try {
      await createJobAd({
        title: title.trim(),
        companyName: companyName || null,
        status,
        postDate: postDate ? format(postDate, "yyyy-MM-dd") : null,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
        appliedDate: appliedDate ? format(appliedDate, "yyyy-MM-dd") : null,
        link: normalizeUrl(link || null),
        description: description || null,
        tags,
        priority: priority || null,
        salary: salary || null,
        applicationFollowUp,
        interviewFollowUp,
        interviewOffer,
        jobOffer,
      })
      resetForm()
      setOpen(false)
      onRefresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer
      direction="right"
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) resetForm()
      }}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Application</DrawerTitle>
          <DrawerDescription>Fill in the details and click Submit to save.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-1 overflow-hidden md:flex-row">
          {/* Left panel - description */}
          <div className="flex w-3/5 shrink-0 flex-col overflow-hidden px-4 py-2">
            <Textarea
              className="no-scrollbar flex-1 resize-none text-sm leading-relaxed"
              placeholder="Enter job description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          {/* Right panel */}
          <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-title">Title</Label>
              <Input
                id="add-title"
                placeholder="Job title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-company">Company</Label>
              <Input
                id="add-company"
                placeholder="Company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="add-status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="add-status" className="w-full">
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
                <Label htmlFor="add-priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="add-priority" className="w-full">
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
            <DateField label="Posted Date" date={postDate} onSelect={setPostDate} />
            <DateField label="Start Date" date={startDate} onSelect={setStartDate} />
            <DateField label="Applied Date" date={appliedDate} onSelect={setAppliedDate} />
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-link">Link</Label>
              <Input
                id="add-link"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-salary">Salary</Label>
              <Input
                id="add-salary"
                placeholder="e.g. 4000 € per month"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Tags</Label>
              <TagInput value={tags} onChange={setTags} />
            </div>
            <Separator />
            <FileRow label="Motivation Letter" icon={FileTextIcon} file={null} mode="edit" />
            <FileRow label="Resume" icon={FileTextIcon} file={null} mode="edit" />
            <FileRow label="Additional Files" icon={PaperclipIcon} file={null} mode="edit" />
            <Separator />
            <div className="flex flex-col gap-2">
              <OfferRow label="Application Follow-up" date={null} onDateChange={setApplicationFollowUp} />
              <OfferRow label="Interview Follow-up" date={null} onDateChange={setInterviewFollowUp} />
              <OfferRow label="Interview Offer" date={null} onDateChange={setInterviewOffer} />
              <OfferRow label="Job Offer" date={null} onDateChange={setJobOffer} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DrawerFooter className="mt-auto px-0">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Submit"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function TableCellViewer({
  item,
  open,
  defaultTab,
  onOpenChange,
  onRefresh,
}: {
  item: JobAdDto
  open: boolean
  defaultTab: "read" | "edit"
  onOpenChange: (open: boolean) => void
  onRefresh: () => void
}) {
  // formKey forces OfferRow instances to remount with fresh state when the drawer opens
  const [formKey, setFormKey] = useState(0)
  const [activeTab, setActiveTab] = useState<"read" | "edit">(defaultTab)

  const [title, setTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [postDate, setPostDate] = useState<Date | undefined>()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [appliedDate, setAppliedDate] = useState<Date | undefined>()
  const [link, setLink] = useState("")
  const [salary, setSalary] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [applicationFollowUp, setApplicationFollowUp] = useState<string | null>(null)
  const [interviewFollowUp, setInterviewFollowUp] = useState<string | null>(null)
  const [interviewOffer, setInterviewOffer] = useState<string | null>(null)
  const [jobOffer, setJobOffer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Seeds form state and sets the active tab whenever the drawer opens
  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab)
      setTitle(item.title)
      setCompanyName(item.companyName ?? "")
      setStatus(item.status)
      setPriority(item.priority ?? "")
      setPostDate(item.postDate ? parseISO(item.postDate) : undefined)
      setStartDate(item.startDate ? parseISO(item.startDate) : undefined)
      setAppliedDate(item.appliedDate ? parseISO(item.appliedDate) : undefined)
      setLink(item.link ?? "")
      setSalary(item.salary ?? "")
      setDescription(item.description ?? "")
      setTags(item.tags)
      setApplicationFollowUp(item.applicationFollowUp)
      setInterviewFollowUp(item.interviewFollowUp)
      setInterviewOffer(item.interviewOffer)
      setJobOffer(item.jobOffer)
      setError(null)
      setFormKey((k) => k + 1)
    }
  }, [open, defaultTab, item])

  // Validates and submits the updated job ad to the API
  async function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    if (!status) {
      setError("Status is required")
      return
    }
    setError(null)
    setLoading(true)
    try {
      const payload: JobAdPayload = {
        title: title.trim(),
        companyName: companyName || null,
        status,
        postDate: postDate ? format(postDate, "yyyy-MM-dd") : null,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
        appliedDate: appliedDate ? format(appliedDate, "yyyy-MM-dd") : null,
        link: normalizeUrl(link || null),
        description: description || null,
        tags,
        priority: priority || null,
        salary: salary || null,
        applicationFollowUp,
        interviewFollowUp,
        interviewOffer,
        jobOffer,
      }
      await updateJobAd(item.id, payload)
      onOpenChange(false)
      onRefresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Deletes the job ad and closes the drawer
  async function handleDelete() {
    setLoading(true)
    try {
      await deleteJobAd(item.id)
      onOpenChange(false)
      onRefresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-start gap-4">
          <div className="flex w-3/5 shrink-0 flex-col gap-1">
            <DrawerTitle>{item.title}</DrawerTitle>
            <DrawerDescription>{item.companyName ?? "—"}</DrawerDescription>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
            <Badge asChild>
              <a href={normalizeUrl(item.link) ?? "#"} target="_blank" rel="noopener noreferrer">
                Open Link <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            </Badge>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-xs text-muted-foreground">Posted Date</span>
              <span className="text-sm">{displayDate(item.postDate)}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-xs text-muted-foreground">Start Date</span>
              <span className="text-sm">{displayDate(item.startDate)}</span>
            </div>
          </div>
        </DrawerHeader>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "read" | "edit")}
          className="flex flex-col flex-1 overflow-hidden"
        >
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
              <FileRow label="Motivation Letter" icon={FileTextIcon} file={null} />
              <FileRow label="Resume" icon={FileTextIcon} file={null} />
              <FileRow label="Additional Files" icon={PaperclipIcon} file={null} />

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <span className="text-sm">{displayDate(item.appliedDate)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Priority</span>
                  <PriorityDots priority={item.priority} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Salary</span>
                  <span className="text-sm">{item.salary || "—"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Tags</span>
                <div className="flex flex-wrap gap-1">
                  {item.tags.length > 0 ? (
                    item.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm">—</span>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <OfferRow label="Application Follow-up" date={item.applicationFollowUp} />
                <OfferRow label="Interview Follow-up" date={item.interviewFollowUp} />
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
                className="no-scrollbar flex-1 resize-none text-sm leading-relaxed"
                placeholder="Enter job description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            {/* Right panel */}
            <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
              <div className="flex flex-col gap-3">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="edit-status" className="w-full">
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
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="edit-priority" className="w-full">
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
              <DateField label="Posted Date" date={postDate} onSelect={setPostDate} />
              <DateField label="Start Date" date={startDate} onSelect={setStartDate} />
              <DateField label="Applied Date" date={appliedDate} onSelect={setAppliedDate} />
              <div className="flex flex-col gap-3">
                <Label htmlFor="edit-link">Link</Label>
                <Input
                  id="edit-link"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="edit-salary">Salary</Label>
                <Input
                  id="edit-salary"
                  placeholder="e.g. 4000 € per month"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Tags</Label>
                <TagInput value={tags} onChange={setTags} />
              </div>
              <Separator />
              <FileRow label="Motivation Letter" icon={FileTextIcon} file={null} mode="edit" />
              <FileRow label="Resume" icon={FileTextIcon} file={null} mode="edit" />
              <FileRow label="Additional Files" icon={PaperclipIcon} file={null} mode="edit" />
              <Separator />
              <div key={formKey} className="flex flex-col gap-2">
                <OfferRow label="Application Follow-up" date={applicationFollowUp} onDateChange={setApplicationFollowUp} />
                <OfferRow label="Interview Follow-up" date={interviewFollowUp} onDateChange={setInterviewFollowUp} />
                <OfferRow label="Interview Offer" date={interviewOffer} onDateChange={setInterviewOffer} />
                <OfferRow label="Job Offer" date={jobOffer} onDateChange={setJobOffer} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DrawerFooter className="mt-auto px-0">
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Saving..." : "Submit"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="border-destructive/40"
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {item.title}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This can&apos;t be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DrawerFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  )
}
