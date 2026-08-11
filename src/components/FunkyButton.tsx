import type { ReactNode } from 'react'

type FunkyButtonProps = {
  children?: ReactNode
  onClick?: () => void
}

export default function FunkyButton({ children, onClick }: FunkyButtonProps) {
  return <button onClick={onClick}>{children}</button>
}
