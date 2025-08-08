import React, { forwardRef } from 'react';

/**
 * Professional card component for FinDistress AI
 * Provides consistent styling and flexible layouts for content containers
 */

const Card = forwardRef(({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    shadow = 'md',
    border = true,
    rounded = 'xl',
    hover = false,
    clickable = false,
    onClick,
    header,
    footer,
    title,
    subtitle,
    icon: Icon,
    gradient = false,
    backgroundPattern = false,
    ...props
}, ref) => {

    /**
     * Base card styles
     */
    const baseStyles = `
        bg-white transition-all duration-300 ease-in-out
        ${clickable || onClick ? 'cursor-pointer' : ''}
        ${clickable && !onClick ? 'hover:cursor-pointer' : ''}
    `;

    /**
     * Variant styles for different card types
     */
    const variantStyles = {
        default: 'bg-white',
        glass: 'bg-white/80 backdrop-blur-md',
        gradient: 'bg-gradient-to-br from-white to-gray-50',
        primary: 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200',
        success: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
        warning: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200',
        danger: 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200',
        info: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
        dark: 'bg-gray-900 text-white border-gray-700'
    };

    /**
     * Padding variants
     */
    const paddingStyles = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
    };

    /**
     * Shadow variants
     */
    const shadowStyles = {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-lg',
        lg: 'shadow-xl',
        xl: 'shadow-2xl',
        inner: 'shadow-inner'
    };

    /**
     * Rounded corner variants
     */
    const roundedStyles = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full'
    };

    /**
     * Border styles
     */
    const borderStyles = border === true
        ? 'border border-gray-200/50'
        : border === false
            ? 'border-0'
            : typeof border === 'string'
                ? border
                : 'border border-gray-200/50';

    /**
     * Hover effects
     */
    const hoverStyles = hover ? `
        hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1
        active:scale-[0.98] active:translate-y-0
    ` : '';

    /**
     * Background pattern for enhanced visual appeal
     */
    const patternStyles = backgroundPattern ? `
        relative
        before:absolute before:inset-0 before:rounded-inherit
        before:bg-gradient-to-br before:from-transparent before:via-white/5 before:to-transparent
        before:pointer-events-none
    ` : '';

    /**
     * Combine all styles
     */
    const cardClasses = `
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.default}
        ${paddingStyles[padding] || paddingStyles.md}
        ${shadowStyles[shadow] || shadowStyles.md}
        ${roundedStyles[rounded] || roundedStyles.xl}
        ${borderStyles}
        ${hoverStyles}
        ${patternStyles}
        ${className}
    `.replace(/\s+/g, ' ').trim();

    /**
     * Handle card click
     */
    const handleClick = (event) => {
        if (clickable || onClick) {
            onClick?.(event);
        }
    };

    return (
        <div
            ref={ref}
            className={cardClasses}
            onClick={handleClick}
            role={clickable || onClick ? 'button' : undefined}
            tabIndex={clickable || onClick ? 0 : undefined}
            onKeyDown={clickable || onClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(e);
                }
            } : undefined}
            {...props}
        >
            {/* Card Header */}
            {(header || title || subtitle || Icon) && (
                <div className={`${children ? 'mb-6' : ''} ${header ? '' : 'flex items-start space-x-4'}`}>
                    {header ? (
                        header
                    ) : (
                        <>
                            {Icon && (
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            )}
                            {(title || subtitle) && (
                                <div className="flex-1 min-w-0">
                                    {title && (
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {title}
                                        </h3>
                                    )}
                                    {subtitle && (
                                        <p className="text-sm text-gray-600">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Card Content */}
            {children && (
                <div className="relative">
                    {children}
                </div>
            )}

            {/* Card Footer */}
            {footer && (
                <div className={`${children ? 'mt-6' : ''} pt-4 border-t border-gray-200/50`}>
                    {footer}
                </div>
            )}

            {/* Background Pattern Overlay */}
            {backgroundPattern && (
                <div className="absolute inset-0 rounded-inherit opacity-5 pointer-events-none">
                    <div
                        className="w-full h-full rounded-inherit"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 1px 1px, rgba(79, 70, 229, 0.3) 1px, transparent 0),
                                linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '20px 20px, 20px 20px, 20px 20px'
                        }}
                    />
                </div>
            )}
        </div>
    );
});

Card.displayName = 'Card';

/**
 * Card Header Component
 */
const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`mb-6 ${className}`} {...props}>
        {children}
    </div>
);

/**
 * Card Content Component
 */
const CardContent = ({ children, className = '', ...props }) => (
    <div className={`${className}`} {...props}>
        {children}
    </div>
);

/**
 * Card Footer Component
 */
const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`mt-6 pt-4 border-t border-gray-200/50 ${className}`} {...props}>
        {children}
    </div>
);

/**
 * Card Title Component
 */
const CardTitle = ({ children, className = '', level = 3, ...props }) => {
    const Tag = `h${level}`;
    const sizeClasses = {
        1: 'text-3xl',
        2: 'text-2xl',
        3: 'text-lg',
        4: 'text-base',
        5: 'text-sm',
        6: 'text-xs'
    };

    return (
        <Tag className={`font-semibold text-gray-900 mb-1 ${sizeClasses[level]} ${className}`} {...props}>
            {children}
        </Tag>
    );
};

/**
 * Card Description Component
 */
const CardDescription = ({ children, className = '', ...props }) => (
    <p className={`text-sm text-gray-600 ${className}`} {...props}>
        {children}
    </p>
);

// Export all components
export default Card;
export {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
    CardDescription
};

