import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/table'

export function TableSkeleton() {
  const rows = Array.from({ length: 8 })

  return (
    <div className="hidden lg:block border border-ink bg-sheet rounded-sm rounded-tl-none overflow-hidden relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-1 p-0" />
            <TableHead>Job ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Machine</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((_, i) => (
            <TableRow
              key={i}
              className="h-11 lg:h-12 border-b border-rule pointer-events-none"
            >
              <TableCell className="p-0 w-0 align-top relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rule/50" />
              </TableCell>
              <TableCell className="py-2">
                <div className="h-5 w-16 hazard-loading animate-stripe-slide rounded-[2px]" />
              </TableCell>
              <TableCell className="py-2">
                <div className="h-5 w-32 lg:w-48 hazard-loading animate-stripe-slide rounded-[2px]" />
              </TableCell>
              <TableCell className="py-2">
                <div className="h-5 w-24 hazard-loading animate-stripe-slide rounded-[2px]" />
              </TableCell>
              <TableCell className="py-2">
                <div className="h-5 w-12 ml-auto hazard-loading animate-stripe-slide rounded-[2px]" />
              </TableCell>
              <TableCell className="py-2">
                <div className="h-5 w-20 hazard-loading animate-stripe-slide rounded-[2px]" />
              </TableCell>
              <TableCell className="py-2">
                <div className="h-5 w-20 hazard-loading animate-stripe-slide rounded-[2px]" />
              </TableCell>
              <TableCell className="py-2">
                <div className="h-5 w-24 hazard-loading animate-stripe-slide rounded-[2px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function TicketSkeleton() {
  const rows = Array.from({ length: 8 })
  return (
    <div className="flex flex-col gap-2 lg:hidden">
      {rows.map((_, i) => (
        <div
          key={i}
          className="relative w-full text-left bg-sheet border border-ink overflow-hidden rounded-sm flex flex-col min-h-[142px]"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-rule/50" />
          <div className="p-3 pl-4">
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="h-5 w-20 hazard-loading animate-stripe-slide rounded-[2px]" />
              <div className="h-6 w-24 hazard-loading animate-stripe-slide rounded-full" />
            </div>
            <div className="mb-2 h-5 w-3/4 hazard-loading animate-stripe-slide rounded-[2px]" />
            <div className="h-4 w-1/2 hazard-loading animate-stripe-slide rounded-[2px]" />
          </div>
          <div className="border-t border-dashed border-rule flex items-center justify-between p-3 pl-4">
            <div className="w-16 h-8 hazard-loading animate-stripe-slide rounded-[2px]" />
            <div className="w-20 h-8 hazard-loading animate-stripe-slide rounded-[2px]" />
            <div className="w-24 h-8 hazard-loading animate-stripe-slide rounded-[2px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
