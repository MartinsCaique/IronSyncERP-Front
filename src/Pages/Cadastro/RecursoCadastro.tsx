import { ChangeEvent, FC, useState } from 'react'
import { Input } from '../../Components/Input'
import { Button } from '../../Components/Button'
import { Divider } from '../../Components/Divider'

type RecursoProps = {
    title: string
}

interface RecursoFormData {
    operacao: string;
    preco: string;
    descricao: string;
}

export const RecursoCadastro: FC<RecursoProps> = ({ title }) => {
    const [formData, setFormData] = useState<RecursoFormData>({
        operacao: '',
        preco: '',
        descricao: ''
    });

    const handleInputChange = (field: keyof RecursoFormData) => (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;

        // Formata o valor do preço/hora para adicionar "R$" automaticamente
        if (field === 'preco') {
            const numericValue = value.replace(/[^\d,]/g, ''); // Permite apenas números e vírgula
            const formattedValue = `R$ ${numericValue}`;
            setFormData((prev) => ({ ...prev, [field]: formattedValue }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async () => {
        try {
            // Validações
            if (!formData.operacao.trim()) {
                alert('Por favor, preencha o campo Operação.');
                return;
            }

            const numericPrice = parseFloat(
                formData.preco.replace('R$', '').replace(',', '.').trim()
            );

            if (isNaN(numericPrice) || numericPrice < 0) {
                alert('Por favor, insira um valor numérico válido para Preço/Hora.');
                return;
            }

            // Fetch para o backend
            const response = await fetch('http://127.0.0.1:8000/api/operacoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    operacao: formData.operacao,
                    preco: numericPrice,
                    descricao: formData.descricao
                })
            });

            if (response.ok) {
                alert('Recurso adicionado com sucesso!');
                setFormData({
                    operacao: '',
                    preco: '',
                    descricao: ''
                });
            } else {
                alert('Ocorreu um erro ao adicionar o recurso. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao adicionar recurso:', error);
            alert('Ocorreu um erro. Por favor, tente novamente mais tarde.');
        }
    };

    return (
        <div className="my-4 mx-8 bg-white">
            <div className="py-4 px-[3.2rem]">
                <div className="py-4">
                    {/* Title */}
                    <h3 className="text-2xl font-semibold">{title}</h3>
                </div>
                <div>
                    {/* Details */}
                    <p className="text-black/60 text-[.9rem]">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed eveniet quisquam voluptatem corrupti modi dolorum quo asperiores incidunt, doloribus dolores? Non obcaecati, quaerat molestias sed vitae perferendis nihil consequuntur esse?
                    </p>
                </div>
                {/* Divider */}
                <Divider />

                <div className="py-8">
                    <h3 className="text-[1.25rem] font-semibold">Insira os Dados</h3>
                </div>

                <div>
                    {/* Texto */}
                    <div className="mt-8 mb-8">
                        <h1 className="text-2xl font-bold">Recurso</h1>
                    </div>

                    <div className="flex w-full mt-4">
                        {/* Operação */}
                        <div className="w-[80%]">
                            <Input
                                type="text"
                                label="*Operação"
                                value={formData.operacao}
                                onChange={handleInputChange('operacao')}
                            />
                        </div>

                        {/* Preço/Hora */}
                        <div className="w-[80%] ml-4">
                            <Input
                                type="text"
                                label="*Preço/Hora"
                                value={formData.preco}
                                onChange={handleInputChange('preco')}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        {/* Descrição */}
                        <Input
                            type="text"
                            label="Descrição"
                            value={formData.descricao}
                            onChange={handleInputChange('descricao')}
                        />
                    </div>

                    {/* Botão */}
                    <div className="w-36 mt-12">
                        <Button
                            label="Adicionar"
                            handleFunction={handleSubmit}
                            className="w-36 h-11 text-secondary border-2 border-secondary rounded-sm hover:bg-secondary hover:text-white transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};