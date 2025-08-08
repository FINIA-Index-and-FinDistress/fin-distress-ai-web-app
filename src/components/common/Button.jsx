import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Professional button component for FinDistress AI
 * Supports multiple variants, loading states, and accessibility features
 */

const Button = forwardRef(({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className = '',
    icon: Icon = null,
    iconRight: IconRight = null,
    fullWidth = false,
    ariaLabel,
    ...props
}, ref) => {

    /**
     * Base styles for all button variants
     */
    const baseStyles = `
        inline-flex items-center justify-center font-semibold transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed
        relative overflow-hidden
    `;

    /**
     * Size variants
     */
    const sizeStyles = {
        sm: 'px-3 py-2 text-sm rounded-lg gap-1.5',
        md: 'px-6 py-3 text-base rounded-xl gap-2',
        lg: 'px-8 py-4 text-lg rounded-xl gap-2.5',
        xl: 'px-10 py-5 text-xl rounded-2xl gap-3'
    };

    /**
     * Variant styles with professional gradients and effects
     */
    const variantStyles = {
        primary: `
            bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg
            hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-105
            focus:ring-indigo-500 
            disabled:from-indigo-400 disabled:to-purple-400 disabled:shadow-none disabled:scale-100
        `,
        secondary: `
            bg-white border-2 border-indigo-600 text-indigo-600 shadow-md
            hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:scale-105
            focus:ring-indigo-500 focus:bg-indigo-50
            disabled:border-indigo-300 disabled:text-indigo-300 disabled:bg-white disabled:shadow-none disabled:scale-100
        `,
        outline: `
            bg-transparent border-2 border-gray-300 text-gray-700 
            hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50
            focus:ring-indigo-500 focus:border-indigo-600
            disabled:border-gray-200 disabled:text-gray-400 disabled:bg-transparent
        `,
        ghost: `
            bg-transparent text-gray-600 
            hover:bg-gray-100 hover:text-gray-900
            focus:ring-gray-500 focus:bg-gray-50
            disabled:text-gray-400 disabled:bg-transparent
        `,
        success: `
            bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg
            hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105
            focus:ring-green-500
            disabled:from-green-400 disabled:to-emerald-400 disabled:shadow-none disabled:scale-100
        `,
        warning: `
            bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg
            hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl hover:scale-105
            focus:ring-yellow-500
            disabled:from-yellow-400 disabled:to-orange-400 disabled:shadow-none disabled:scale-100
        `,
        danger: `
            bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg
            hover:from-red-600 hover:to-pink-700 hover:shadow-xl hover:scale-105
            focus:ring-red-500
            disabled:from-red-400 disabled:to-pink-400 disabled:shadow-none disabled:scale-100
        `,
        info: `
            bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg
            hover:from-blue-600 hover:to-cyan-700 hover:shadow-xl hover:scale-105
            focus:ring-blue-500
            disabled:from-blue-400 disabled:to-cyan-400 disabled:shadow-none disabled:scale-100
        `
    };

    /**
     * Handle click with loading state management
     */
    const handleClick = (event) => {
        if (isLoading || disabled) {
            event.preventDefault();
            return;
        }

        if (onClick) {
            onClick(event);
        }
    };

    /**
     * Loading state styles
     */
    const loadingStyles = isLoading ? 'cursor-wait' : '';

    /**
     * Full width styles
     */
    const widthStyles = fullWidth ? 'w-full' : '';

    /**
     * Combine all styles
     */
    const buttonClasses = `
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${loadingStyles}
        ${widthStyles}
        ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
        <button
            ref={ref}
            type={type}
            onClick={handleClick}
            disabled={isLoading || disabled}
            className={buttonClasses}
            aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
            aria-disabled={isLoading || disabled}
            {...props}
        >
            {/* Loading Spinner */}
            {isLoading && (
                <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 28 : 20} />
            )}

            {/* Left Icon */}
            {!isLoading && Icon && (
                <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 28 : 20} />
            )}

            {/* Button Content */}
            {children && (
                <span className={isLoading ? 'opacity-70' : ''}>
                    {children}
                </span>
            )}

            {/* Right Icon */}
            {!isLoading && IconRight && (
                <IconRight size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 28 : 20} />
            )}

            {/* Ripple Effect (Optional Enhancement) */}
            <span className="absolute inset-0 rounded-inherit">
                <span className="absolute inset-0 rounded-inherit bg-white opacity-0 transition-opacity duration-200 hover:opacity-10" />
            </span>
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
export default Button;