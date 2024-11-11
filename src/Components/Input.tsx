import { FC, ReactNode } from 'react'

interface InputProps {
  type: string,
  placeholder?: string,
  icon?: ReactNode,
  value?: string,
  onChange?: any,
  label?: string,
  name?: string

  // Styles
  width?: string,
}

export const Input: FC<InputProps> = ({ type, placeholder, icon, value, onChange, label, width, }) => {
  return (
    <>
      <p className='text-[.85rem] font-medium'>{label}</p>
      <label className='h-8 flex items-center justify-center border border-gray-300 rounded-sm p-2 bg-white'>
        {icon && <span className='ml-3 mr-2 text-gray-400'>{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ fontSize: '12px' }}
          className={`${width ? width : ''} flex-1 bg-transparent border-transparent focus-within:border-transparent outline-none focus:ring-0`}
        />
      </label>
    </>
  )
}
