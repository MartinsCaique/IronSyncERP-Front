import { FC, useEffect, useState } from 'react'
import { Divider } from '../../Components/Divider'

type ClienteProps = {
    title: string
}

type Cliente = {
    razaoSocial: string;
    contatoNome: string;
    email: string;
    cnpj: string;
    telefone: string;
};

export const ClienteListas: FC<ClienteProps> = ({ title }) => {
    const [clientes, setClientes] = useState<Cliente[]>([]);

    // Função para buscar dados dos clientes
    const fetchClientes = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/clientes/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Verifica se a resposta está OK
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
    
            // Verifica se a resposta tem conteúdo antes de chamar response.json()
            const text = await response.text();
            if (!text) {
                console.error("Resposta da API está vazia.");
                return;
            }
    
            // Converte para JSON
            const data = JSON.parse(text);
            setClientes(data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    return (
        <div className="my-4 mx-8 bg-white">
            <div className="py-4 px-[3.2rem]">
                <div className="py-4">
                    {/* Title */}
                    <h3 className="text-2xl font-semibold">{title}</h3>
                </div>
                <div>
                    {/* Details */}
                    <p className="text-black/60 text-[.9rem]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed eveniet quisquam voluptatem corrupti modi dolorum quo asperiores incidunt, doloribus dolores? Non obcaecati, quaerat molestias sed vitae perferendis nihil consequuntur esse?</p>
                </div>

                {/* Divider */}
                <Divider />

                {/* Cabeçalho */}
                <div className='grid grid-cols-5 h-12 w-full mt-6 bg-primary text-white rounded-sm text-center items-center'>
                    <div>Razão Social</div>
                    <div>Contato</div>
                    <div>E-mail</div>
                    <div>CNPJ</div>
                    <div>Telefone</div>
                </div>

                {/* Lista */}
                <div>
                    {clientes.map((cliente, index) => (
                        <div key={index} className='grid grid-cols-5 h-12 w-full items-center border-b border-gray-200 text-center'>
                            <div>{cliente.razaoSocial}</div>
                            <div>{cliente.contatoNome}</div>
                            <div>{cliente.email}</div>
                            <div>{cliente.cnpj}</div>
                            <div>{cliente.telefone}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}