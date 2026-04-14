import { Calendar, Users, Zap } from 'lucide-react'

export function FeaturesSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded-xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Zap className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-sm">진입 장벽 제로</h3>
          <p className="text-xs text-muted-foreground">회원가입 없이 닉네임만 입력하면 바로 참여</p>
        </div>
        <div className="border rounded-xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-sm">타임테이블 투표</h3>
          <p className="text-xs text-muted-foreground">드래그로 가능한 시간대를 직접 선택</p>
        </div>
        <div className="border rounded-xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-sm">실시간 업데이트</h3>
          <p className="text-xs text-muted-foreground">투표 결과가 모두에게 즉시 반영</p>
        </div>
      </div>
    </section>
  )
}
