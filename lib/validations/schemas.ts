import { z } from 'zod'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다')
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, '시간 형식이 올바르지 않습니다')

export const createEventSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100),
  description: z.string().max(500).optional(),
  creator_nickname: z.string().min(1, '닉네임을 입력해주세요').max(50),
  // 복수 날짜 (날짜별 시간대 독립 설정)
  dates: z
    .array(
      z.object({
        date: dateSchema,
        range_start: timeSchema,
        range_end: timeSchema,
      })
    )
    .min(1, '날짜를 1개 이상 선택해주세요')
    .max(14),
  // 선택적 시간 옵션 (최대 3개, 생성 시 크리에이터가 지정)
  time_options: z
    .array(
      z.object({
        start_time: z.string(),
        end_time: z.string(),
        priority: z.number().int().min(1).max(3),
      })
    )
    .max(3)
    .optional(),
})

export const joinEventSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요').max(50),
})

export const voteSchema = z.object({
  option_id: z.string().uuid(),
  participant_id: z.string().uuid(),
  response: z.enum(['accept', 'decline']),
})

export const timetableSchema = z.object({
  participant_id: z.string().uuid(),
  slots: z.array(
    z.object({
      slot_start: z.string(),
      slot_end: z.string(),
    })
  ),
})

export const altSuggestionSchema = z.object({
  participant_id: z.string().uuid(),
  suggested_start: z.string(),
  suggested_end: z.string(),
  note: z.string().max(200).optional(),
})
