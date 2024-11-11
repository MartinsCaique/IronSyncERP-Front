import { FC } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ERP from './ERP';


type HeaderProps = {
    path: string;
}

const routeConfigs = {
    'cliente': {
        path: 'listas/Lista de clientes/Lista cliente',
        title: 'Listas de Cliente'
    },
    'material': {
        path: 'listas/Lista de materiais/Lista material',
        title: 'Listas de Material'
    },
    'recurso': {
        path: 'listas/Lista de recursos/Lista recurso',
        title: 'Listas de Recurso'
    },
    'orcamento': {
        path: 'listas/Lista de orçamentos/lista orçamento',
        title: 'Listas de Orcamento'
    },
    // Configuração padrão
    'default': {
        path: 'listas',
        title: 'Listas'
    }
};

const Listas: FC<HeaderProps> = () => {

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

export default Listas