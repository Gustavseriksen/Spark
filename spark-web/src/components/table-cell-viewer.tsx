"use client"

import { ArrowUpRightIcon, FileTextIcon, PaperclipIcon, StickyNoteIcon } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  description: string
  motivationLetter: FileEntry | null
  resume: FileEntry | null
  additionalNotes: FileEntry | null
  additionalFiles: FileEntry | null
}

function FileRow({
  label,
  icon: Icon,
  file,
}: {
  label: string
  icon: React.ElementType
  file: FileEntry | null
}) {
  if (file) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">{file.size}</span>
          </div>
          <Button variant="outline" size="sm">Open</Button>
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
              <FileRow label="Additional Notes" icon={StickyNoteIcon} file={item.additionalNotes} />
              <FileRow label="Additional Files" icon={PaperclipIcon} file={item.additionalFiles} />
            </div>
          </TabsContent>

          {/* Edit tab */}
          <TabsContent value="edit" className="flex flex-col flex-1 overflow-y-auto px-4 text-sm">
            <form className="flex flex-col gap-4 md:flex-row">
              {/* Left panel */}
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" defaultValue={item.title} />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue={item.company} />
                </div>
              </div>

              <Separator orientation="vertical" className="hidden md:block" />

              {/* Right panel */}
              <div className="flex flex-1 flex-col">
                {/* Right top */}
                <div className="flex flex-col gap-4 pb-4">
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
                </div>

                <Separator />

                {/* Right bottom */}
                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="postDate">Post Date</Label>
                    <Input id="postDate" defaultValue={item.postDate} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="link">Link</Label>
                    <Input id="link" defaultValue={item.link} />
                  </div>
                </div>
              </div>
            </form>
            <DrawerFooter className="px-0">
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  )
}
