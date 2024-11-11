import { FC, ReactNode } from 'react'

interface InputProps {
  type: string,
  placeholder?: string,
  icon?: ReactNode,
  value?: string,
  onChange?: any,
  label?: string,
  name?: string,
  error?: string,
  disabled?: boolean,

  // Styles
  width?: string,
}

export const Input: FC<InputProps> = ({ type, placeholder = '', icon, value = '', onChange, label, width, error, name, disabled = false }) => {
  return (
    <>
      <p className='text-[.85rem] font-medium'>{label}</p>
      <label className='h-9 flex items-center justify-center border border-gray-300 rounded-sm p-2 bg-white'>
        {icon && <span className='ml-3 mr-2 text-gray-400'>{icon}</span>}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{ fontSize: '12px' }}
          className={`${width ? width : ''} flex-1 bg-transparent border-transparent focus-within:border-transparent outline-none focus:ring-0 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
        {error && (
          <span className="text-red-500 text-xs mt-1">{error}</span>
        )}
      </label>
    </>
  )
}
