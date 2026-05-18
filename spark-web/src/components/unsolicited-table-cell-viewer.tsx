"use client"

import React, { useState } from "react"
import { format, parse } from "date-fns"
import { ArrowUpRightIcon, CircleCheckBigIcon, CircleDashedIcon, CircleIcon, LoaderIcon } from "lucide-react"
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

export interface UnsolicitedTableCellViewerItem {
  id: number
  company_name: string
  about: string
  size: string
  industry: string[]
  address: string
  website_url: string
  priority: string
  status: string
  salary: string
  followUp: string | null
  hasInterview: string | null
  hasOffer: string | null
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

function OfferRow({ label, date }: { label: string; date: string | null }) {
  const [isReceived, setIsReceived] = useState(date !== null)
  const [receivedDate, setReceivedDate] = useState<Date | null>(
    date ? parse(date, "dd/MM/yyyy", new Date()) : null
  )
  const [open, setOpen] = useState(false)

  if (isReceived) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-size-[200%_100%] p-2 animate-shimmer">
        <button onClick={() => { setIsReceived(false); setReceivedDate(null) }} className="shrink-0">
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
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function StatusBadge({ status }: { status: string }) {
  const Icon = status === "Submitted" ? CircleCheckBigIcon : status === "Pending" ? CircleDashedIcon : LoaderIcon
  return (
    <Badge variant="outline" className={`px-1.5 ${statusStyles[status] ?? "text-muted-foreground"}`}>
      <Icon />
      {status}
    </Badge>
  )
}

export function AddUnsolicitedApplicationDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Unsolicited Application</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-1 overflow-hidden md:flex-row">
          {/* Left panel - about */}
          <div className="flex w-3/5 shrink-0 flex-col overflow-hidden px-4 py-2">
            <Textarea
              className="no-scrollbar flex-1 resize-none text-sm leading-relaxed"
              placeholder="Enter company description..."
            />
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          {/* Right panel */}
          <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-company-name">Company Name</Label>
              <Input id="add-company-name" placeholder="Company name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="add-status">Status</Label>
                <Select>
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
                <Select>
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
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-size">Size</Label>
              <Input id="add-size" placeholder="e.g. 100-250 employees" />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-industry">Industry</Label>
              <Input id="add-industry" placeholder="Tag1, Tag2, Tag3" />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-address">Address</Label>
              <Input id="add-address" placeholder="City, Country" />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-website">Website URL</Label>
              <Input id="add-website" placeholder="https://..." />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-salary">Salary</Label>
              <Input id="add-salary" placeholder="e.g. 4000 € per month" />
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <OfferRow label="Follow-up" date={null} />
              <OfferRow label="Has Interview" date={null} />
              <OfferRow label="Has Offer" date={null} />
            </div>
            <DrawerFooter className="mt-auto px-0">
              <Button>Submit</Button>
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

export function UnsolicitedTableCellViewer({ item }: { item: UnsolicitedTableCellViewerItem }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.company_name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-start gap-4">
          <div className="flex w-3/5 shrink-0 flex-col gap-1">
            <DrawerTitle>{item.company_name}</DrawerTitle>
            <DrawerDescription>{item.address}</DrawerDescription>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-4">
            <Badge asChild>
              <a href={item.website_url} target="_blank" rel="noopener noreferrer">
                Open Website <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            </Badge>
          </div>
        </DrawerHeader>
        <Tabs defaultValue="read" className="flex flex-col flex-1 overflow-hidden">
          <TabsList className="mx-4 w-fit">
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          {/* Read tab */}
          <TabsContent value="read" className="flex flex-1 overflow-hidden md:flex-row">
            {/* Left panel - about */}
            <div className="no-scrollbar w-3/5 shrink-0 overflow-y-auto px-4 py-2 text-sm">
              <p className="whitespace-pre-wrap leading-relaxed">{item.about}</p>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            {/* Right panel */}
            <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Priority</span>
                  <PriorityDots priority={item.priority} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Size</span>
                  <span className="text-sm">{item.size || "—"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Salary</span>
                  <span className="text-sm">{item.salary || "—"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Industry</span>
                <div className="flex flex-wrap gap-1">
                  {item.industry.length > 0 ? (
                    item.industry.map((tag) => (
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
                <OfferRow label="Follow-up" date={item.followUp} />
                <OfferRow label="Has Interview" date={item.hasInterview} />
                <OfferRow label="Has Offer" date={item.hasOffer} />
              </div>
            </div>
          </TabsContent>

          {/* Edit tab */}
          <TabsContent value="edit" className="flex flex-1 overflow-hidden md:flex-row">
            {/* Left panel - about */}
            <div className="flex w-3/5 shrink-0 flex-col overflow-hidden px-4 py-2">
              <Textarea
                id="about"
                defaultValue={item.about}
                className="no-scrollbar flex-1 resize-none text-sm leading-relaxed"
                placeholder="Enter company description..."
              />
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            {/* Right panel */}
            <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
              <div className="flex flex-col gap-3">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue={item.company_name} />
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
                <Label htmlFor="size">Size</Label>
                <Input id="size" defaultValue={item.size} placeholder="e.g. 100-250 employees" />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  defaultValue={item.industry.join(", ")}
                  placeholder="Tag1, Tag2, Tag3"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue={item.address} placeholder="City, Country" />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="website-url">Website URL</Label>
                <Input id="website-url" defaultValue={item.website_url} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="salary">Salary</Label>
                <Input id="salary" defaultValue={item.salary} placeholder="e.g. 4000 € per month" />
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <OfferRow label="Follow-up" date={item.followUp} />
                <OfferRow label="Has Interview" date={item.hasInterview} />
                <OfferRow label="Has Offer" date={item.hasOffer} />
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
