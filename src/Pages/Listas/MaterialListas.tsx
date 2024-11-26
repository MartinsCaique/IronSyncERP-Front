import { FC, useEffect, useState } from "react"
import { Divider } from "../../Components/Divider"

type MaterialProps = {
    title: string
}

type Material = {
    nome: string;
    preco: string;
    especificacaoTecnica: string;
    origem: string;
    descricao: string;
};

export const MaterialListas: FC<MaterialProps> = ({ title }) => {
    const [materiais, setMateriais] = useState<Material[]>([]);

    const fetchMateriais = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/materiais/', {
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
            setMateriais(data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    useEffect(() => {
        fetchMateriais();
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

                {/* Lista */}
                <div className='grid grid-cols-5 h-12 w-full mt-6 bg-primary text-white rounded-sm text-center items-center'>
                    <div>
                        <h3>Nome</h3>
                    </div>
                    <div>
                        <h3>Preço</h3>
                    </div>
                    <div>
                        <h3>Especificação</h3>
                    </div>
                    <div>
                        <h3>Origem</h3>
                    </div>
                    <div>
                        <h3>Descrição</h3>
                    </div>
                </div>
                    {materiais.map((material, index) => (
                        <div key={index} className='grid grid-cols-5 h-12 w-full items-center border-b border-gray-200 text-center'>
                            <div>{material.nome}</div>
                            <div>{material.preco}</div>
                            <div>{material.especificacaoTecnica}</div>
                            <div>{material.origem}</div>
                            <div>{material.descricao}</div>
                        </div>
                    ))}
                <div>

                </div>
            </div>
        </div>
    )
}
