'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventHeader } from '@/components/event/EventHeader'
import { NicknameGate } from '@/components/event/NicknameGate'
import { OptionVotingSection } from '@/components/event/OptionVotingSection'
import { TimetableSection } from '@/components/event/TimetableSection'
import { AltSuggestion } from '@/components/event/AltSuggestion'
import { ConfirmedBanner } from '@/components/event/ConfirmedBanner'
import { AdminBand } from '@/components/event/AdminBand'
import { AdminGateDialog } from '@/components/event/AdminGateDialog'
import { toast } from 'sonner'
import type { EventPageData } from '@/types'

interface EventPageClientProps {
  initialData: EventPageData
  slug: string
}

export function EventPageClient({ initialData, slug }: EventPageClientProps) {
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return window.sessionStorage.getItem(`admin_${slug}`)
  })
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [confirmedOptionId, setConfirmedOptionId] = useState<string | null>(
    initialData.event.confirmed_option_id ?? null
  )

  const confirmedOption = confirmedOptionId
    ? initialData.options.find((o) => o.id === confirmedOptionId) ?? null
    : null

  function handleAdminExit() {
    sessionStorage.removeItem(`admin_${slug}`)
    setAdminToken(null)
    toast.success('관리자 모드를 종료했어요')
  }

  function handleSessionExpired() {
    sessionStorage.removeItem(`admin_${slug}`)
    setAdminToken(null)
    setAdminDialogOpen(true)
  }

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (!url) return
    try {
      if (navigator.share) {
        await navigator.share({ url, title: initialData.event.title })
        return
      }
      await navigator.clipboard.writeText(url)
      toast.success('링크가 복사됐어요')
    } catch {
      // user cancelled share — silent
    }
  }

  return (
    <>
      {confirmedOption && (
        <ConfirmedBanner
          option={confirmedOption}
          onClear={
            adminToken
              ? async () => {
                  try {
                    const res = await fetch(`/api/events/${slug}/confirm`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${adminToken}` },
                    })
                    if (res.status === 401) {
                      handleSessionExpired()
                      return
                    }
                    if (!res.ok) {
                      toast.error('확정 취소에 실패했어요')
                      return
                    }
                    setConfirmedOptionId(null)
                    toast.success('재투표 상태로 돌아갔어요')
                  } catch {
                    toast.error('네트워크 오류가 발생했어요')
                  }
                }
              : undefined
          }
        />
      )}
      {adminToken && <AdminBand onExit={handleAdminExit} />}

      <header
        className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-card"
      >
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            aria-label="홈"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-[18px]" />
          </Link>
          <span className="font-extrabold text-base tracking-tight">Are You In?</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon-sm" aria-label="공유" onClick={handleShare}>
            <Share2 className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="관리자"
            onClick={() => setAdminDialogOpen(true)}
          >
            <Lock className="size-3.5" />
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-6 items-start">
        <div className="space-y-5 min-w-0">
          <EventHeader
            event={initialData.event}
            eventDates={initialData.eventDates}
            participantCount={initialData.participants.length}
          />

          <hr className="border-0 h-px bg-border" />

          {!participantId ? (
            <NicknameGate slug={slug} onJoined={setParticipantId} />
          ) : (
            <>
              <OptionVotingSection
                eventId={initialData.event.id}
                slug={slug}
                options={initialData.options}
                initialVotes={initialData.votes}
                participantId={participantId}
                confirmedOptionId={confirmedOptionId}
                adminToken={adminToken}
                onAdminConfirmed={(id) => setConfirmedOptionId(id)}
                onAdminReset={() => setConfirmedOptionId(null)}
                onSessionExpired={handleSessionExpired}
              />

              <hr className="border-0 h-px bg-border" />
              <AltSuggestion
                slug={slug}
                participantId={participantId}
                suggestions={initialData.altSuggestions}
              />
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start min-w-0">
          <TimetableSection
            eventId={initialData.event.id}
            slug={slug}
            eventDates={initialData.eventDates}
            initialSlots={initialData.slots}
            participantId={participantId}
            options={initialData.options}
            confirmedOptionId={confirmedOptionId}
          />
        </div>
      </div>

      <AdminGateDialog
        open={adminDialogOpen}
        onOpenChange={setAdminDialogOpen}
        slug={slug}
        onAuthenticated={(token) => setAdminToken(token)}
      />
    </>
  )
}
