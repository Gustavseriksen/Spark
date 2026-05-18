"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CircleCheckBigIcon, LoaderIcon, CircleDashedIcon, ArrowUpRightIcon, EllipsisVerticalIcon, Columns3Icon, ChevronDownIcon, PlusIcon, ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from "lucide-react"
import { UnsolicitedTableCellViewer, AddUnsolicitedApplicationDrawer } from "@/components/unsolicited-table-cell-viewer"

export const schema = z.object({
  id: z.number(),
  company_name: z.string(),
  about: z.string(),
  size: z.string(),
  industry: z.array(z.string()),
  address: z.string(),
  website_url: z.string(),
  priority: z.string(),
  status: z.string(),
  salary: z.string(),
  followUp: z.string().nullable(),
  hasInterview: z.string().nullable(),
  hasOffer: z.string().nullable(),
})

const priorityLevel: Record<string, number> = {
  "Very High": 5,
  High: 4,
  Medium: 3,
  Low: 2,
  "Very Low": 1,
  None: 0,
}

type StatusTab = "all" | "submitted" | "in-process" | "pending"

function PriorityDots({ priority }: { priority: string }) {
  const level = priorityLevel[priority] ?? 0
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`size-2 rounded-full ${
            i < level ? "bg-foreground" : "bg-foreground/20"
          }`}
        />
      ))}
    </div>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "company_name",
    header: "Company Name",
    cell: ({ row }) => {
      return <UnsolicitedTableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => {
      const tags = row.original.industry
      const visible = tags.slice(0, 2)
      const remaining = tags.length - visible.length
      return (
        <div className="flex flex-wrap items-center gap-1">
          {visible.map((tag) => (
            <Badge key={tag} variant="outline" className="px-1.5">
              {tag}
            </Badge>
          ))}
          {remaining > 0 && (
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
              +{remaining}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => row.original.size || "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      const styles: Record<string, string> = {
        Submitted:
          "border-yellow-950 text-yellow-700 bg-[linear-gradient(110deg,#1a1500,45%,#854d0e,55%,#1a1500)] bg-[length:200%_100%]",
        Pending:
          "border-red-950 text-red-700 bg-[linear-gradient(110deg,#1a0505,45%,#7f1d1d,55%,#1a0505)] bg-[length:200%_100%]",
        "In Process":
          "border-amber-950 text-amber-700 bg-[linear-gradient(110deg,#100800,45%,#713f12,55%,#100800)] bg-[length:200%_100%]",
      }

      const Icon =
        status === "Submitted" ? CircleCheckBigIcon
        : status === "Pending" ? CircleDashedIcon
        : LoaderIcon

      return (
        <Badge variant="outline" className={`px-1.5 ${styles[status] ?? "text-muted-foreground"}`}>
          <Icon />
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <PriorityDots priority={row.original.priority} />,
  },
  {
    id: "link",
    header: () => null,
    cell: ({ row }) => (
      <Badge asChild>
        <a href={row.original.website_url} target="_blank" rel="noopener noreferrer">
          Open Website <ArrowUpRightIcon data-icon="inline-end" />
        </a>
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => null,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <EllipsisVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]


export function UnsolicitedDataTable({
  data,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [activeTab, setActiveTab] = React.useState<StatusTab>("all")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const statusCounts = React.useMemo(
    () => ({
      all: data.length,
      submitted: data.filter((item) => item.status === "Submitted").length,
      inProcess: data.filter((item) => item.status === "In Process").length,
      pending: data.filter((item) => item.status === "Pending").length,
    }),
    [data]
  )
  const filteredData = React.useMemo(() => {
    if (activeTab === "all") {
      return data
    }

    const statusByTab: Record<Exclude<StatusTab, "all">, string> = {
      submitted: "Submitted",
      "in-process": "In Process",
      pending: "Pending",
    }

    return data.filter((item) => item.status === statusByTab[activeTab])
  }, [activeTab, data])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })
  const handleTabChange = (value: string) => {
    setActiveTab(value as StatusTab)
    setPagination((current) => ({
      ...current,
      pageIndex: 0,
    }))
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="in-process">In Process</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all">
            All <Badge variant="secondary">{statusCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted <Badge variant="secondary">{statusCounts.submitted}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-process">
            In Process <Badge variant="secondary">{statusCounts.inProcess}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending <Badge variant="secondary">{statusCounts.pending}</Badge>
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3Icon data-icon="inline-start" />
                Columns
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddUnsolicitedApplicationDrawer>
            <Button variant="outline" size="sm">
              <PlusIcon />
              <span className="hidden lg:inline">Add</span>
            </Button>
          </AddUnsolicitedApplicationDrawer>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={
                          header.column.id === "link"
                            ? "w-[120px] pr-1"
                            : header.column.id === "actions"
                              ? "w-10 pl-1"
                              : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === "link"
                            ? "w-[120px] pr-1"
                            : cell.column.id === "actions"
                              ? "w-10 pl-1"
                              : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon
                />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon
                />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon
                />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  )
}
