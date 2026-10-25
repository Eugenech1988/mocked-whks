export type TWebhook = {
  id: number
  name: string
  url: string
  active: boolean
  created_at: string
}

export type TWebhookPageCounts = {
  current: number
  last: number
}

export type TWebhookResultCounts = {
  total: number
  limitation: number
}

export type TWebhookPaging = {
  pages: TWebhookPageCounts
  results: TWebhookResultCounts
}

export type TWebhookList = {
  data: TWebhook[]
  paging: TWebhookPaging
}

export type TWebhookParams = {
  page: number
  limit: number
  search: string
}

export type TWebhookUpdatePayload = {
  name: string
  url: string
  active?: boolean
}
