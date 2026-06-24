import fs from 'fs'
import { randomUUID } from 'crypto'

const CSV_PATH =
  'c:/Users/AS/Downloads/Mutavaatir (Responses) - Form responses 1.csv'
const OUT_PATH = new URL('./import-legacy-subscriptions.sql', import.meta.url)

function parseCsv(text) {
  const rows = []
  let cur = ''
  let inQ = false
  let row = []

  for (let c = 0; c < text.length; c++) {
    const ch = text[c]
    if (ch === '"') {
      inQ = !inQ
      continue
    }
    if (!inQ && ch === ',') {
      row.push(cur)
      cur = ''
      continue
    }
    if (!inQ && (ch === '\n' || ch === '\r')) {
      if (ch === '\r' && text[c + 1] === '\n') c++
      if (cur || row.length) {
        row.push(cur)
        rows.push(row)
        row = []
        cur = ''
      }
      continue
    }
    cur += ch
  }

  if (cur || row.length) {
    row.push(cur)
    rows.push(row)
  }

  return rows
}

function sqlLiteral(value) {
  if (value === null || value === undefined) return 'null'
  const text = String(value).trim()
  if (!text) return 'null'
  return `'${text.replace(/'/g, "''")}'`
}

function optionalText(value) {
  const text = String(value ?? '').trim()
  return text || null
}

function mapPlan(raw) {
  const text = String(raw ?? '').trim().toLowerCase()
  if (text.includes('3 month') || text.includes('4200')) return 'quarterly'
  if (text.includes('6 month') || text.includes('7800')) return 'biannual'
  if (text.includes('year') || text.includes('14400')) return 'yearly'
  return 'monthly'
}

function parseTimestamp(raw) {
  const text = String(raw ?? '').trim()
  const match = text.match(
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/,
  )
  if (!match) throw new Error(`Unparseable timestamp: ${raw}`)
  const [, dd, mm, yyyy, hh, min, ss] = match
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}+05:00`
}

function paymentPath(email, timestamp) {
  const slug = String(email)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const stamp = String(timestamp)
    .trim()
    .replace(/[^\d]/g, '')
    .slice(0, 14)
  return `legacy-import/${slug}-${stamp}`
}

const text = fs.readFileSync(CSV_PATH, 'utf8')
const rows = parseCsv(text)
const dataRows = rows.slice(1)

const records = dataRows.map((row, index) => {
  if (row.length < 14) {
    throw new Error(`Row ${index + 1} has ${row.length} fields; expected at least 14`)
  }

  const timestamp = row[0]
  const email = optionalText(row[1])
  if (!email) throw new Error(`Row ${index + 1} is missing email`)

  return {
    id: randomUUID(),
    created_at: parseTimestamp(timestamp),
    email,
    full_name: optionalText(row[2]) ?? email,
    phone: optionalText(row[3]) ?? 'unknown',
    address: optionalText(row[4]) ?? 'unknown',
    delivery_notes: optionalText(row[5]),
    plan_id: mapPlan(row[6]),
    reading_preferences: optionalText(row[7]),
    books_read: optionalText(row[8]),
    referral_source: optionalText(row[9]),
    instagram_username: optionalText(row[10]),
    suggestions: optionalText(row[11]),
    payment_screenshot_path: paymentPath(email, timestamp),
  }
})

const lines = [
  '-- =============================================================================',
  '-- Legacy Google Form subscription import',
  '-- Generated from: Mutavaatir (Responses) - Form responses 1.csv',
  `-- Rows: ${records.length}`,
  '-- Run in Supabase SQL editor (production).',
  '-- =============================================================================',
  '',
  'begin;',
  '',
]

for (const record of records) {
  lines.push(
    `insert into public.subscription_applications (`,
    `  id, created_at, status, email, full_name, phone, address, delivery_notes,`,
    `  plan_id, reading_preferences, books_read, referral_source,`,
    `  instagram_username, suggestions, payment_screenshot_path, terms_accepted`,
    `) values (`,
    `  ${sqlLiteral(record.id)}::uuid,`,
    `  ${sqlLiteral(record.created_at)}::timestamptz,`,
    `  'pending',`,
    `  ${sqlLiteral(record.email)},`,
    `  ${sqlLiteral(record.full_name)},`,
    `  ${sqlLiteral(record.phone)},`,
    `  ${sqlLiteral(record.address)},`,
    `  ${sqlLiteral(record.delivery_notes)},`,
    `  ${sqlLiteral(record.plan_id)},`,
    `  ${sqlLiteral(record.reading_preferences)},`,
    `  ${sqlLiteral(record.books_read)},`,
    `  ${sqlLiteral(record.referral_source)},`,
    `  ${sqlLiteral(record.instagram_username)},`,
    `  ${sqlLiteral(record.suggestions)},`,
    `  ${sqlLiteral(record.payment_screenshot_path)},`,
    `  true`,
    `);`,
    '',
    `insert into public.subscription_orders (`,
    `  application_id, month_number, status`,
    `) values (`,
    `  ${sqlLiteral(record.id)}::uuid,`,
    `  1,`,
    `  'pending'`,
    `);`,
    '',
  )
}

lines.push('commit;', '')

fs.writeFileSync(OUT_PATH, lines.join('\n'), 'utf8')

console.log(`Wrote ${records.length} applications + orders to ${OUT_PATH.pathname}`)
for (const [index, record] of records.entries()) {
  console.log(
    `${index + 1}. ${record.created_at} | ${record.email} | ${record.full_name} | ${record.plan_id}`,
  )
}
