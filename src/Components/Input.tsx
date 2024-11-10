import { FC, ReactNode } from 'react'

interface InputProps {
    type: string,
    placeholder: string,
    icon?: ReactNode,
    value: string,
    onChange: any,
}

export const Input: FC<InputProps> = ({ type, placeholder, icon, value, onChange }) => {
    return (
        <label className='h-8 flex items-center justify-center border border-gray-300 rounded-sm p-2 bg-white'>
        {icon && <span className='ml-3 mr-2 text-gray-400'>{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ fontSize: '12px' }}
          className='h-8 flex-1 bg-transparent border-transparent focus-within:border-transparent outline-none focus:ring-0'
        />
      </label>
    )
}
