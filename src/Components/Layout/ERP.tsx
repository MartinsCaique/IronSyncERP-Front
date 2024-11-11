import React, { FC } from 'react';
import { SideBar } from './SideBar';
import Header from './Header';

// Propriedades do Header
type HeaderProps = {
  path: string;
}

// Propriedades Geral do ERP que extende a HeaderProps
type ERPProps = HeaderProps & {
  children?: React.ReactNode;
}

const ERP: FC<ERPProps> = ({ path, children }) => {
  return (
    <div className='flex'>
      <div className="flex min-h-screen w-full">
        <SideBar />
        <div className="flex-1">
          <Header path={path} />
          {children}
        </div>
      </div>
    </div>
  )
}

export default ERP;
