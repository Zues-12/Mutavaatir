'use client'

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border border-black px-4 py-2 text-sm uppercase tracking-wider"
    >
      Print
    </button>
  )
}
