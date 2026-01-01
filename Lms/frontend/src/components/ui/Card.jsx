import React from 'react'

export default function Card({ title, subtitle, actions, className = '', children }) {
  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      {(title || subtitle || actions) && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </div>
              )}
            </div>
            {actions && (
              <div className="ml-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
