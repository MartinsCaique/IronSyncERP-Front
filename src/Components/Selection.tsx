import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { HiOutlineChevronUpDown } from "react-icons/hi2";

interface Option {
  id: string | number;
  label: string;
}

type SelectProps = {
  title: string;
  value: string;
  onChange: (value: string) => void;
  fetchOptions: () => Promise<Option[]>;
}

const CustomSelect: FC<SelectProps> = ({
  title,
  value,
  onChange,
  fetchOptions
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const optionsLoadedRef = useRef(false);

  const loadOptions = useCallback(async () => {
    // Só carrega as opções se ainda não tiverem sido carregadas
    if (optionsLoadedRef.current) return;

    setIsLoading(true);
    try {
      const fetchedOptions = await fetchOptions();
      setOptions(fetchedOptions);

      // Se já tiver um valor selecionado, encontra a opção correspondente
      if (value) {
        const matchedOption = fetchedOptions.find(
          option => option.id.toString() === value.toString()
        );
        if (matchedOption) {
          setSelectedOption(matchedOption);
        }
      }

      // Marca como carregado para evitar múltiplas chamadas
      optionsLoadedRef.current = true;
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
    }
    setIsLoading(false);
  }, [fetchOptions, value]);

  useEffect(() => {
    // Só carrega as opções quando o dropdown for aberto
    if (isOpen && !optionsLoadedRef.current) {
      loadOptions();
    }
  }, [isOpen, loadOptions]);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onChange(option.id.toString()); // Converte para string
    setIsOpen(false);
  };

  // Reseta o carregamento se o componente for desmontado e remontado
  useEffect(() => {
    return () => {
      optionsLoadedRef.current = false;
    };
  }, []);

  return (
    <div className="relative w-full my-4 text-xs">
      <label className='text-[.85rem] font-medium'>{title}</label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="
          w-full p-2 h-9 bg-white border border-gray-300 shadow-sm flex justify-between items-center 
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {isLoading ? 'Carregando...' :
            selectedOption ? selectedOption.label : 'Selecione uma opção'}
        </span>
        <HiOutlineChevronUpDown className="h-5 w-5 text-gray-500" />
      </button>

      {isOpen && !isLoading && (
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
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">
              Nenhuma opção disponível
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.id}
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;