import { ReactNode } from 'react'

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius)] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
      <div>
        <div className="text-sm font-semibold tracking-tight">{title}</div>
        {subtitle && <div className="mt-1 text-xs text-white/55">{subtitle}</div>}
      </div>
      {right}
    </div>
  )
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="px-5 py-4">{children}</div>
}

export function Button({
  children,
  kind = 'default',
  type = 'button',
  onClick,
  disabled,
}: {
  children: ReactNode
  kind?: 'default' | 'primary' | 'danger'
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none'
  const variants: Record<string, string> = {
    default: 'border border-white/15 bg-white/5 hover:bg-white/10 text-white',
    primary:
      'border border-white/10 bg-[color:var(--primary)] text-black hover:brightness-[0.95] shadow-[0_10px_30px_rgba(0,0,0,0.25)]',
    danger: 'border border-white/15 bg-red-500/15 hover:bg-red-500/20 text-white',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[kind]}`}>
      {children}
    </button>
  )
}

export function Input({
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <input
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-4 focus:ring-white/10"
    />
  )
}

export function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-4 focus:ring-white/10"
    >
      {children}
    </select>
  )
}
