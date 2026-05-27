"use client";

import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  ArrowUpRightIcon,
  CircleCheckBigIcon,
  CircleDashedIcon,
  CircleIcon,
  LoaderIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagInput } from "@/components/tag-input";
import { createCompany, updateCompany, deleteCompany } from "@/lib/companies";

// Ensures a URL has a protocol prefix so the browser treats it as absolute
function normalizeUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export interface UnsolicitedTableCellViewerItem {
  id: string;
  name: string;
  description: string | null;
  size: string | null;
  tags: string[];
  address: string | null;
  websiteUrl: string | null;
  status: string;
  priority: number | null;
  relevance: number | null;
  salary: string | null;
  interviewDate: string | null;
  offerDate: string | null;
  followUpDate: string | null;
}

const statusStyles: Record<string, string> = {
  Submitted:
    "border-yellow-950 text-yellow-700 bg-[linear-gradient(110deg,#1a1500,45%,#854d0e,55%,#1a1500)] bg-size-[200%_100%]",
  Pending:
    "border-red-950 text-red-700 bg-[linear-gradient(110deg,#1a0505,45%,#7f1d1d,55%,#1a0505)] bg-size-[200%_100%]",
  "In Process":
    "border-amber-950 text-amber-700 bg-[linear-gradient(110deg,#100800,45%,#713f12,55%,#100800)] bg-size-[200%_100%]",
};

function PriorityDots({ priority }: { priority: number | null }) {
  const level = priority ?? 0;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`size-2 rounded-full ${i < level ? "bg-foreground" : "bg-foreground/20"}`}
        />
      ))}
    </div>
  );
}

// Displays a date row — clicking the circle opens a date picker, clicking the check clears it
function OfferRow({
  label,
  date,
  onDateChange,
}: {
  label: string;
  date: string | null;
  onDateChange?: (isoDate: string | null) => void;
}) {
  const [isReceived, setIsReceived] = useState(date !== null);
  const [receivedDate, setReceivedDate] = useState<Date | null>(
    date ? parseISO(date) : null,
  );
  const [open, setOpen] = useState(false);

  if (isReceived) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-size-[200%_100%] p-2 animate-shimmer">
        <button
          onClick={() => {
            setIsReceived(false);
            setReceivedDate(null);
            onDateChange?.(null);
          }}
          className="shrink-0"
        >
          <CircleCheckBigIcon className="size-4 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" />
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-300">{label}</span>
          <span className="text-xs text-slate-500">
            {receivedDate
              ? `Received: ${format(receivedDate, "dd/MM/yyyy")}`
              : "Received"}
          </span>
        </div>
      </div>
    );
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
              setReceivedDate(d);
              setIsReceived(true);
              setOpen(false);
              onDateChange?.(format(d, "yyyy-MM-dd"));
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function StatusBadge({ status }: { status: string }) {
  const Icon =
    status === "Submitted"
      ? CircleCheckBigIcon
      : status === "Pending"
        ? CircleDashedIcon
        : LoaderIcon;
  return (
    <Badge
      variant="outline"
      className={`px-1.5 ${statusStyles[status] ?? "text-muted-foreground"}`}
    >
      <Icon />
      {status}
    </Badge>
  );
}

export function AddUnsolicitedApplicationDrawer({
  children,
  onRefresh,
}: {
  children: React.ReactNode;
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [salary, setSalary] = useState("");
  const [followUpDate, setFollowUpDate] = useState<string | null>(null);
  const [interviewDate, setInterviewDate] = useState<string | null>(null);
  const [offerDate, setOfferDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Resets all fields back to empty
  function resetForm() {
    setName("");
    setDescription("");
    setSize("");
    setTags([]);
    setAddress("");
    setWebsiteUrl("");
    setStatus("");
    setPriority("");
    setSalary("");
    setFollowUpDate(null);
    setInterviewDate(null);
    setOfferDate(null);
    setError(null);
  }

  // Validates, calls the API, then closes the drawer and refreshes the table
  async function handleSubmit() {
    if (!name.trim()) {
      setError("Company name is required");
      return;
    }
    if (!status) {
      setError("Status is required");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createCompany({
        name: name.trim(),
        description: description || null,
        size: size || null,
        tags,
        address: address || null,
        websiteUrl: normalizeUrl(websiteUrl || null),
        status,
        priority: priority ? parseInt(priority) : null,
        relevance: null,
        salary: salary || null,
        followUpDate,
        interviewDate,
        offerDate,
      });
      resetForm();
      setOpen(false);
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      direction="right"
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Unsolicited Application</DrawerTitle>
          <DrawerDescription>Fill in the details and click Submit to save.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-1 overflow-hidden md:flex-row">
          {/* Left panel - description */}
          <div className="flex w-3/5 shrink-0 flex-col overflow-hidden px-4 py-2">
            <Textarea
              className="no-scrollbar flex-1 resize-none text-sm leading-relaxed"
              placeholder="Enter company description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          {/* Right panel */}
          <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-company-name">Company Name</Label>
              <Input
                id="add-company-name"
                placeholder="Company name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                      <SelectItem value="5">Very High</SelectItem>
                      <SelectItem value="4">High</SelectItem>
                      <SelectItem value="3">Medium</SelectItem>
                      <SelectItem value="2">Low</SelectItem>
                      <SelectItem value="1">Very Low</SelectItem>
                      <SelectItem value="0">None</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-size">Size</Label>
              <Input
                id="add-size"
                placeholder="e.g. 100-250 employees"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Industry</Label>
              <TagInput value={tags} onChange={setTags} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-address">Address</Label>
              <Input
                id="add-address"
                placeholder="City, Country"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="add-website">Website URL</Label>
              <Input
                id="add-website"
                placeholder="https://..."
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
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
            <Separator />
            <div className="flex flex-col gap-2">
              <OfferRow label="Follow-up" date={null} onDateChange={setFollowUpDate} />
              <OfferRow label="Has Interview" date={null} onDateChange={setInterviewDate} />
              <OfferRow label="Has Offer" date={null} onDateChange={setOfferDate} />
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
  );
}

export function UnsolicitedTableCellViewer({
  item,
  open,
  defaultTab,
  onOpenChange,
  onRefresh,
}: {
  item: UnsolicitedTableCellViewerItem;
  open: boolean;
  defaultTab: "read" | "edit";
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}) {
  // formKey forces OfferRow instances to remount with fresh state when the drawer opens
  const [formKey, setFormKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"read" | "edit">(defaultTab);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [salary, setSalary] = useState("");
  const [followUpDate, setFollowUpDate] = useState<string | null>(null);
  const [interviewDate, setInterviewDate] = useState<string | null>(null);
  const [offerDate, setOfferDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Seeds form state and sets the active tab whenever the drawer opens
  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
      setName(item.name);
      setDescription(item.description ?? "");
      setSize(item.size ?? "");
      setTags(item.tags);
      setAddress(item.address ?? "");
      setWebsiteUrl(item.websiteUrl ?? "");
      setStatus(item.status);
      setPriority(item.priority?.toString() ?? "");
      setSalary(item.salary ?? "");
      setFollowUpDate(item.followUpDate);
      setInterviewDate(item.interviewDate);
      setOfferDate(item.offerDate);
      setError(null);
      setFormKey((k) => k + 1);
    }
  }, [open, defaultTab, item]);

  // Validates and submits the updated company to the API
  async function handleSubmit() {
    if (!name.trim()) {
      setError("Company name is required");
      return;
    }
    if (!status) {
      setError("Status is required");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await updateCompany(item.id, {
        name: name.trim(),
        description: description || null,
        size: size || null,
        tags,
        address: address || null,
        websiteUrl: normalizeUrl(websiteUrl || null),
        status,
        priority: priority ? parseInt(priority) : null,
        relevance: null,
        salary: salary || null,
        followUpDate,
        interviewDate,
        offerDate,
      });
      onOpenChange(false);
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Deletes the company and closes the drawer
  async function handleDelete() {
    setLoading(true);
    try {
      await deleteCompany(item.id);
      onOpenChange(false);
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-start gap-4">
          <div className="flex w-3/5 shrink-0 flex-col gap-1">
            <DrawerTitle>{item.name}</DrawerTitle>
            <DrawerDescription>{item.address}</DrawerDescription>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-4">
            <Badge asChild>
              <a
                href={item.websiteUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Website <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            </Badge>
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
          <TabsContent
            value="read"
            className="flex flex-1 overflow-hidden md:flex-row"
          >
            <div className="no-scrollbar w-3/5 shrink-0 overflow-y-auto px-4 py-2 text-sm">
              <p className="whitespace-pre-wrap leading-relaxed">
                {item.description}
              </p>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

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
                <OfferRow label="Follow-up" date={item.followUpDate} />
                <OfferRow label="Has Interview" date={item.interviewDate} />
                <OfferRow label="Has Offer" date={item.offerDate} />
              </div>
            </div>
          </TabsContent>

          {/* Edit tab */}
          <TabsContent
            value="edit"
            className="flex flex-1 overflow-hidden md:flex-row"
          >
            <div className="flex w-3/5 shrink-0 flex-col overflow-hidden px-4 py-2">
              <Textarea
                className="no-scrollbar flex-1 resize-none text-sm leading-relaxed"
                placeholder="Enter company description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
              <div className="flex flex-col gap-3">
                <Label htmlFor="edit-company-name">Company Name</Label>
                <Input
                  id="edit-company-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                        <SelectItem value="5">Very High</SelectItem>
                        <SelectItem value="4">High</SelectItem>
                        <SelectItem value="3">Medium</SelectItem>
                        <SelectItem value="2">Low</SelectItem>
                        <SelectItem value="1">Very Low</SelectItem>
                        <SelectItem value="0">None</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-3">
                <Label htmlFor="edit-size">Size</Label>
                <Input
                  id="edit-size"
                  placeholder="e.g. 100-250 employees"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Industry</Label>
                <TagInput value={tags} onChange={setTags} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  placeholder="City, Country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="edit-website">Website URL</Label>
                <Input
                  id="edit-website"
                  placeholder="https://..."
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
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
              <Separator />
              <div key={formKey} className="flex flex-col gap-2">
                <OfferRow label="Follow-up" date={followUpDate} onDateChange={setFollowUpDate} />
                <OfferRow label="Has Interview" date={interviewDate} onDateChange={setInterviewDate} />
                <OfferRow label="Has Offer" date={offerDate} onDateChange={setOfferDate} />
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
                      <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
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
  );
}
