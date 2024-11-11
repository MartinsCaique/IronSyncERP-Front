import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

type HeaderProps = {
  path: string;
};

const useLastPathLocation = () => {
  const location = useLocation();
  const getLastSegment = (path: string): string => {
    const cleanPath = path.replace(/\/$/, '');
    const segments = cleanPath.split('/').filter(segment => segment !== '');
    return segments[segments.length - 1]?.toLowerCase() || 'home';
  };
  return getLastSegment(location.pathname);
};

const Header: FC<HeaderProps> = ({ path }) => {
  const location = useLocation();
  const isCadastro = path.includes("cadastro");
  const isListas = path.includes("lista");

  // Separar segmentos da rota para trilha de navegação
  const pathParts = path.split('/').filter(part => part !== '');

  // Links para cada tipo de página
  const links = isCadastro ? [
    { path: "/Cadastro/cliente", label: "Cliente" },
    { path: "/Cadastro/material", label: "Material" },
    { path: "/Cadastro/recurso", label: "Recurso" },
    { path: "/Cadastro/orcamento", label: "Orçamento" }
  ] : [
    { path: "/Listas/cliente", label: "Cliente" },
    { path: "/Listas/material", label: "Material" },
    { path: "/Listas/recurso", label: "Recurso" },
    { path: "/Listas/orcamento", label: "Orçamento" }
  ];

  return (
    <div className='min-w-full'>
      {/* Header Superior com Trilha de Navegação */}
      <div className='my-4 mx-8'>
        <div className="py-4 px-8 flex justify-between bg-white">
          <div className="flex items-center gap-2">
            {pathParts.map((part, index) => (
              <div key={index} className="flex items-center">
                <span 
                  className={`${
                    index === pathParts.length - 1 
                      ? 'text-[#005EB6] font-bold' 
                      : 'text-black/60'
                  } capitalize text-base lg:text-lg md:text-sm`}
                >
                  {part}
                </span>
                {index < pathParts.length - 1 && (
                  <span className="text-black/60 mx-2 text-sm md:text-xs">{'>'}</span>
                )}
              </div>
            ))}
          </div>
          <div className='flex'>
            <p className='font-bold text-base lg:text-lg md:text-sm'>Admin</p>
          </div>
        </div>
      </div>

      {/* Navegação Secundária Abaixo */}
      <div className='bg-white py-5'>
        <h3 className='text-black text-2xl lg:text-3xl font-semibold ml-20'>
          {isCadastro ? "Cadastros" : isListas ? "Listas" : "Página"}
        </h3>
        <div className='border-t border-black/20 mt-5 mx-8'></div>
        
        <div className='flex mx-24 text-base lg:text-lg md:text-sm'>
          {links.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`mr-10 lg:mr-20 mt-4 px-2 py-1 md:px-1 md:py-1 transition-colors
                ${useLastPathLocation() === item.path.split("/").pop() 
                  ? 'text-secondary font-bold border-b-2 border-secondary' 
                  : 'text-black/60 hover:text-black'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
