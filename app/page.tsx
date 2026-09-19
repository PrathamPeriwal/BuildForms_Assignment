import {
  CircleDashed,
  CircleDot,
  TriangleAlert,
  CircleCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const palette = [
  { name: 'paper', cls: 'bg-paper border-rule' },
  { name: 'sheet', cls: 'bg-sheet border-rule' },
  { name: 'ink', cls: 'bg-ink' },
  { name: 'graphite', cls: 'bg-graphite' },
  { name: 'rule', cls: 'bg-rule border-rule' },
  { name: 'highlighter', cls: 'bg-highlighter' },
]

const statuses = [
  { name: 'pending', cls: 'bg-s-pending', Icon: CircleDashed },
  { name: 'in progress', cls: 'bg-s-progress', Icon: CircleDot },
  { name: 'delayed', cls: 'bg-s-delayed', Icon: TriangleAlert },
  { name: 'completed', cls: 'bg-s-done', Icon: CircleCheck },
]

export default function StyleCheck() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-12">
      {/* Wordmark */}
      <div>
        <h1 className="font-display text-5xl font-800 text-ink tracking-tight uppercase leading-none">
          Production Control
        </h1>
        <p className="micro mt-1">Style check — throwaway page</p>
      </div>

      {/* Font samples */}
      <section className="space-y-3 border-t border-rule pt-6">
        <p className="micro">Typography</p>
        <p className="font-display text-4xl font-800 text-ink">
          Big Shoulders Display 800
        </p>
        <p className="font-display text-3xl font-700 text-ink">
          Big Shoulders Display 700
        </p>
        <p className="font-sans text-base font-400 text-ink">
          Archivo 400 — The quick brown fox jumps over the lazy dog
        </p>
        <p className="font-sans text-base font-500 text-ink">
          Archivo 500 — The quick brown fox jumps over the lazy dog
        </p>
        <p className="font-sans text-base font-600 text-ink">
          Archivo 600 — The quick brown fox jumps over the lazy dog
        </p>
        <p className="num text-base font-400 text-ink">
          IBM Plex Mono 400 — JOB-0042 · 1,250 units · 2026-09-19
        </p>
        <p className="num text-base font-500 text-ink">
          IBM Plex Mono 500 — JOB-0042 · 1,250 units · 2026-09-19
        </p>
        <p className="num text-base font-600 text-ink">
          IBM Plex Mono 600 — JOB-0042 · 1,250 units · 2026-09-19
        </p>
      </section>

      {/* Palette swatches */}
      <section className="border-t border-rule pt-6">
        <p className="micro mb-3">Palette</p>
        <div className="flex flex-wrap gap-3">
          {palette.map(({ name, cls }) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className={`w-16 h-10 border ${cls}`} />
              <span className="micro">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Status colours */}
      <section className="border-t border-rule pt-6">
        <p className="micro mb-3">Status colours</p>
        <div className="flex flex-wrap gap-4">
          {statuses.map(({ name, cls, Icon }) => (
            <div
              key={name}
              className="flex items-center gap-2 border border-rule px-3 py-2"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${cls}`} />
              <Icon className="size-4 text-ink" />
              <span className="text-sm text-ink capitalize">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons */}
      <section className="border-t border-rule pt-6">
        <p className="micro mb-3">Buttons</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Solid (default)</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="default" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* Input + Select */}
      <section className="border-t border-rule pt-6 space-y-3">
        <p className="micro mb-3">Controls</p>
        <div className="flex flex-wrap gap-3 items-start">
          <Input
            id="style-check-search"
            placeholder="Search jobs, products…"
            className="w-64"
          />
          <Select>
            <SelectTrigger id="style-check-status" className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="micro mt-2">
          Tab to an element to see the ink + highlighter focus ring
        </p>
      </section>

      {/* Table */}
      <section className="border-t border-rule pt-6">
        <p className="micro mb-3">Table</p>
        <div className="border border-rule">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="num">JOB-0042</TableCell>
                <TableCell>Valve Assembly A</TableCell>
                <TableCell>Acme Corp</TableCell>
                <TableCell className="num">1,250</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <CircleDot className="size-3.5 text-s-progress" />
                    In Progress
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="num">JOB-0039</TableCell>
                <TableCell>Bearing Housing B</TableCell>
                <TableCell>Delta Works</TableCell>
                <TableCell className="num">340</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <TriangleAlert className="size-3.5 text-s-delayed" />
                    Delayed
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="num">JOB-0035</TableCell>
                <TableCell>Gasket Pack C</TableCell>
                <TableCell>Vega Industries</TableCell>
                <TableCell className="num">5,000</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <CircleCheck className="size-3.5 text-s-done" />
                    Completed
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Hatch + Hazard */}
      <section className="border-t border-rule pt-6 space-y-3">
        <p className="micro mb-3">Patterns</p>
        <div className="flex gap-4">
          <div>
            <p className="micro mb-1">Hatch (on ink bg)</p>
            <div className="w-32 h-12 bg-ink relative overflow-hidden">
              <div className="hatch absolute inset-0 text-paper" />
            </div>
          </div>
          <div>
            <p className="micro mb-1">Hazard stripe</p>
            <div className="w-32 h-12 hazard" />
          </div>
        </div>
      </section>
    </main>
  )
}

