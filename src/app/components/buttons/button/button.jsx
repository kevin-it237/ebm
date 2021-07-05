import React from 'react';
import './button.styles.scss';
/**
 * @description simple button component.  
 * @param {boolean} actived
 * @param {boolean} outline 
 * @param {boolean} loading
 * @param {boolean} border
 * @param {string} size "xs|sm|md|lg|xl|xxl"
 * @param {string} variant "primary|secondary|danger|warning|sucess|default"
 * @param {string} className
 * @param {boolean} rounded is button rounded ? 
 */
const Button = ({
    actived = false, 
    variant="default",
    loading, 
    border = true, 
    white,
    outline, 
    size, 
    className,
    disabled = false, 
    onClick, 
    rounded = false,
    ...rest}) =>
{
    return (
    <button {...rest} onClick={onClick} disabled={disabled || loading}
        className={`btn ${actived ? 'actived': ''} ${loading ? 'btn-loading': ''} ${!border ? 'btn-no-border': ''}
                    btn-${variant} ${variant ? '' : 'btn-default' } 
                    ${disabled ? 'btn-disabled' : '' } 
                    ${white ? 'btn-white' : '' } 
                    ${outline ? 'btn-outline': ''} 
                    ${size ? `btn-${size}` : ''}
                    ${className ? className : ''}
                    ${rounded ? 'btn-rounded' : ''}`}>
        {loading ? (
            <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.5" cy="12.5" r="11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ) : rest.children}
    </button>)
}

export default Button;