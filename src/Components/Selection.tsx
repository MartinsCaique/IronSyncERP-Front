import { FC, useState } from 'react';

import { HiOutlineChevronUpDown } from "react-icons/hi2";

interface Option {
  value: string;
  label: string;
}

type SelectProps = {
    title?: string;
    value?: any;
    onChange: (value: string) => void;
}

const CustomSelect: FC<SelectProps> = ({ title ,value ,onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  // opcoes para o selection
  const options: Option[] = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
  ];

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full my-4 text-xs">
        <label className='text-[.85rem] font-medium'>{title}</label>
      {/* Botão do Select */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full p-2 h-9 bg-white border border-gray-300 shadow-sm flex justify-between items-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : 'Selecione uma opção'}
        </span>
        <HiOutlineChevronUpDown className="h-5 w-5 text-gray-500" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="
          absolute
          w-full
          mt-1
          bg-white
          border
          border-gray-300
          rounded-md
          shadow-lg
          z-10
          max-h-60
          overflow-auto
        ">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
                handleOptionClick(option)
              }}
              className="
                px-4
                py-2
                cursor-pointer
                hover:bg-blue-50
                transition-colors
                duration-150
                ease-in-out
              "
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;