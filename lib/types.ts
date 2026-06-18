export type Project = {
  id: string
  project_name: string
  prompt_used: string | null
  generated_html: string | null
  status: string
  domain_url: string | null
  created_at: string
}

export type Lead = {
  id: string
  business_name: string
  phone: string | null
  location: string | null
  has_website: boolean
  saved_at: string
}

export type InvoiceItem = {
  description: string
  quantity: number
  rate: number
}

export type Invoice = {
  id: string
  client_name: string
  client_email: string | null
  amount: number
  status: string
  items: InvoiceItem[]
  created_at: string
}
