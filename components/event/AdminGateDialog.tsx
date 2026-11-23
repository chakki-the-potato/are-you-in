'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface AdminGateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slug: string
  onAuthenticated: (token: string) => void
}

export function AdminGateDialog({ open, onOpenChange, slug, onAuthenticated }: AdminGateDialogProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!password.trim()) {
      setError(true)
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/events/${slug}/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(true)
        toast.error(json.error ?? '비밀번호가 달라요')
        return
      }
      sessionStorage.setItem(`admin_${slug}`, json.token)
      toast.success('관리자 모드로 진입했어요')
      setPassword('')
      setError(false)
      onAuthenticated(json.token)
      onOpenChange(false)
    } catch {
      toast.error('네트워크 오류가 발생했어요')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) {
          setPassword('')
          setError(false)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>관리자 인증</DialogTitle>
          <DialogDescription>약속 생성 시 설정한 관리자 비밀번호를 입력하세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            placeholder="비밀번호"
            aria-invalid={error}
            autoFocus
          />
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">취소</Button>} />
          <Button onClick={() => handleSubmit()} disabled={isLoading || !password.trim()}>
            {isLoading ? '확인 중…' : '확인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
