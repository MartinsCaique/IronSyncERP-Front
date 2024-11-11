import { FC, ReactNode } from 'react'

interface ButtonProps {
    label: string,
    type?: any,
    handleFunction: any,
    bgColor?: string,
    textColor?: string,
    icon?: ReactNode,
    border?: boolean,
    size?: string,
    className?: string,
    disabled?: boolean,
}

export const Button: FC<ButtonProps> = ({ label, handleFunction, bgColor, icon, border = false, textColor, size, className, disabled = false, }) => {
    return (
        <>
            <button 
            className={`${className ? className : `flex justify-center items-center ${bgColor} w-[236px] h-11 ${border ? 'border border-gray-500' : ''} ${textColor} rounded-sm ${size} font-medium uppercase`}`} 
            onClick={handleFunction} 
            disabled={disabled}
            >
                {icon && <span className='mr-4'>{icon}</span>}
                <span>{label}</span>
            </button>
        </>
    )
}
