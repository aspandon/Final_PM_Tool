// js/shared/ui/Badge.js

/**
 * Badge Component
 * Reusable status badge
 */

export function Badge({
  children,
  variant = 'default', // default, success, warning, danger, info
  size = 'md', // sm, md, lg
  className = ''
}) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 border-gray-300',
    success: 'bg-green-100 text-green-700 border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    danger: 'bg-red-100 text-red-700 border-red-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return React.createElement('span', {
    className: `inline-flex items-center font-medium rounded-full border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  }, children);
}
