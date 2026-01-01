import React from 'react'

export default function Input({ label, className = '', error, ...props }) {
  const classes = `w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
  } ${className}`
  
  return (
    <label className="w-full block">
      {label && (
        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </div>
      )}
      <input className={classes} {...props} />
      {error && (
        <div className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </label>
  )
}
