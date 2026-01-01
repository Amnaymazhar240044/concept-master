import React from 'react'

export default function Select({ label, className = '', children, ...props }) {
  return (
    <label className={`w-full block ${className}`}>
      {label && (
        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </div>
      )}
      <select
        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
