import { FC } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ERP from './ERP';


type HeaderProps = {
    path: string;
}

const routeConfigs = {
    'cliente': {
        path: 'cadastros/Cadastro de clientes/novo cliente',
        title: 'Cadastro de Cliente'
    },
    'material': {
        path: 'cadastros/Cadastro de materiais/novo material',
        title: 'Cadastro de Material'
    },
    'recurso': {
        path: 'cadastros/Cadastro de recursos/novo recurso',
        title: 'Cadastro de Recurso'
    },
    'orcamento': {
        path: 'cadastros/Cadastro de orçamentos/novo orçamento',
        title: 'Cadastro de Orcamento'
    },
    // Configuração padrão
    'default': {
        path: 'cadastros',
        title: 'Cadastro'
    }
};

const Cadastro: FC<HeaderProps> = () => {

    const location = useLocation();
    const currentPath = location.pathname.split('/').pop() || 'default';
    
    // Pega as props do objeto de configuração ou usa o default
    const { path } = routeConfigs[currentPath as keyof typeof routeConfigs] 
        || routeConfigs.default;

    return (
        <ERP path={path} >
            <Outlet/>
        </ERP>
    )
}

export default Cadastro