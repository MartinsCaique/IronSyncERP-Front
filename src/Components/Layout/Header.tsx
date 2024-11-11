import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

type HeaderProps = {
  path: string;
}

const useLastPathLocation = () => {
  const location = useLocation();

  const getLastSegment = (path: string): string => {
    const cleanPath = path.replace(/\/$/, '');
    if(cleanPath === '') return 'home';

    const segments = cleanPath.split('/');
    const filteredSegments = segments.filter(segment => segment !== '');
    return filteredSegments[filteredSegments.length - 1].toLowerCase() || 'home';
  };

  return getLastSegment(location.pathname);
};

const useIsActive = (targetPath: string) => {
  const currentSegment = useLastPathLocation();
  const targetSegment = targetPath.split('/').filter(part => part !== '').pop()?.toLowerCase() || 'home';
  return currentSegment === targetSegment;
};

const Header: FC<HeaderProps> = ({ path }) => {
  const pathParts = path.split('/').filter(part => part !== '');

  return (
    <div className='min-w-full'>
      <div className='my-4 mx-8'>
        <div className="py-4 px-8 flex justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              {pathParts.map((part, index) => (
                <div key={index} className="flex items-center">
                  <span 
                    className={`
                      ${index === pathParts.length - 1 
                        ? 'text-[#005EB6] font-bold' 
                        : 'text-black/60'
                      }
                      capitalize text-base lg:text-lg md:text-sm
                    `}
                  >
                    {part}
                  </span>
                  {index < pathParts.length - 1 && (
                    <span className="text-black/60 mx-2 text-sm md:text-xs">{'>'}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className='flex'>
            <p className='font-bold text-base lg:text-lg md:text-sm'>Admin</p>
          </div>
        </div>
      </div>

      <div className='bg-white py-5'>
        <h3 className='text-black text-2xl lg:text-3xl font-semibold ml-20'>Cadastros</h3>
        <div className='border-t border-black/20 mt-5 mx-8'></div>

        <div className='flex mx-24 text-base lg:text-lg md:text-sm'>
          {[
            { path: "/Cadastro/cliente", label: "Cliente" },
            { path: "/Cadastro/material", label: "Material" },
            { path: "/Cadastro/recurso", label: "Recurso" },
            { path: "/Cadastro/orcamento", label: "Orçamento" }
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`mr-10 lg:mr-20 mt-4 px-2 py-1 md:px-1 md:py-1 transition-colors
                ${useIsActive(item.path) 
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