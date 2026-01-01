import React from 'react'

export default function Textarea({ label, className = '', rows = 4, ...props }) {
  return (
    <label className={`w-full block ${className}`}>
      {label && <div className="mb-1 text-sm font-medium opacity-80">{label}</div>}
      <textarea
        rows={rows}
        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500 outline-none transition placeholder:opacity-60"
        {...props}
      />
    </label>
  )
}
