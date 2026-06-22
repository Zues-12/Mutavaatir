export type ReviewSubmitState = {
  ok: boolean
  error?: string
  success?: boolean
}

export const initialReviewSubmitState: ReviewSubmitState = {
  ok: false,
}
