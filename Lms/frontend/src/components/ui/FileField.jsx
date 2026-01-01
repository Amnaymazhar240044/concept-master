import React from 'react'

export default function FileField({ label, className = '', accept, onChange }) {
  return (
    <label className={`w-full block ${className}`}>
      {label && <div className="mb-1 text-sm font-medium opacity-80">{label}</div>}
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="w-full file:px-4 file:py-2 file:rounded-l-lg file:bg-blue-600 file:text-white file:border-0 file:mr-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500 outline-none transition"
        />
      </div>
    </label>
  )
}
