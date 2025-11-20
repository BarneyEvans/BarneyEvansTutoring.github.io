import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
    variant = 'primary', 
    fullWidth = false, 
    children, 
    className = '',
    ...props 
}) => {
    // Tactile Logic:
    // Hover: Translate 4px (halfway), Shadow reduces to 2px. Visual Effect: Button sinks halfway.
    // Active: Translate 6px (full), Shadow gone. Visual Effect: Button hits the floor.
    
    const baseStyles = "font-heading font-bold text-lg py-3 px-8 rounded-full border-3 border-black transition-all duration-150 ease-out";
    
    const variants = {
        primary: "bg-hot-pink text-white shadow-solid hover:bg-white hover:text-black hover:shadow-solid-hover hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]",
        secondary: "bg-white text-black shadow-solid hover:bg-light-pink hover:shadow-solid-hover hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]",
        outline: "bg-transparent text-black border-black hover:bg-black hover:text-white active:translate-x-[2px] active:translate-y-[2px]"
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;