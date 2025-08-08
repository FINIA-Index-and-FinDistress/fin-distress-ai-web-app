import React, { forwardRef } from 'react';
import { MoreVertical, Download, Maximize2 } from 'lucide-react';

/**
 * Professional chart card container for FinDistress AI analytics
 * Provides consistent styling and optional controls for chart components
 */

const ChartCard = forwardRef(({
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
  actions = false,
  exportable = false,
  expandable = false,
  loading = false,
  error = null,
  onExport,
  onExpand,
  dataCount,
  ...props
}, ref) => {

  /**
   * Handle export action
   */
  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  /**
   * Handle expand action
   */
  const handleExpand = () => {
    if (onExpand) {
      onExpand();
    }
  };

  /**
   * Render chart actions
   */
  const renderActions = () => {
    if (!actions && !exportable && !expandable) return null;

    return (
      <div className="flex items-center space-x-2">
        {exportable && (
          <button
            onClick={handleExport}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export chart data"
            aria-label="Export chart"
          >
            <Download className="h-4 w-4" />
          </button>
        )}

        {expandable && (
          <button
            onClick={handleExpand}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Expand chart"
            aria-label="Expand chart"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}

        {actions && (
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Chart options"
            aria-label="Chart options"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 h-full flex flex-col ${className}`}>
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                  <Icon className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                {subtitle && <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
            <p className="text-sm text-gray-500">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 h-full flex flex-col ${className}`}>
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-red-600" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-600 mb-3">
              <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-800 mb-1">Chart Error</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 h-full flex flex-col transition-all duration-200 hover:shadow-xl ${className}`}
      {...props}
    >
      {/* Chart Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Icon className="h-5 w-5 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                {title}
                {dataCount !== undefined && (
                  <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                    {dataCount} {dataCount === 1 ? 'item' : 'items'}
                  </span>
                )}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {renderActions()}
        </div>
      </div>

      {/* Chart Content */}
      <div className="flex-1 flex flex-col min-h-0 w-full">
        {children}
      </div>

      {/* Chart Footer - Optional watermark */}
      <div className="flex-shrink-0 mt-4 pt-3 border-t border-gray-200/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>FinDistress AI Analytics</span>
          <span>Professional ML Insights</span>
        </div>
      </div>
    </div>
  );
});

ChartCard.displayName = 'ChartCard';

export default ChartCard;