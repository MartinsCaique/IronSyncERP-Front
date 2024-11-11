import { FC, useState } from "react"
import { Input } from "../../Components/Input"
import { Button } from "../../Components/Button"
import { Divider } from "../../Components/Divider"


type MaterialProps = {
    title: string
}

interface FormData {
    nome: string;
    preco: string;
    especificacaoTecnica: string;
    origem: string;
    descricao: string;
}

interface FormErrors {
    nome?: string;
    preco?: string;
    especificacaoTecnica?: string;
    origem?: string;
    descricao?: string;
}

export const MaterialCadastro: FC<MaterialProps> = ({ title }) => {
    const [formData, setFormData] = useState<FormData>({
        nome: "",
        preco: "",
        especificacaoTecnica: "",
        origem: "",
        descricao: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
        }

        if (!formData.preco.trim()) {
            newErrors.preco = "Preço é obrigatório";
        } else if (isNaN(Number(formData.preco))) {
            newErrors.preco = "Preço deve ser um número válido";
        }

        if (!formData.especificacaoTecnica.trim()) {
            newErrors.especificacaoTecnica = "Especificação técnica é obrigatória";
        }

        if (!formData.origem.trim()) {
            newErrors.origem = "Origem é obrigatória";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [field]: e.target.value,
        });
        // Limpa o erro do campo quando o usuário começa a digitar
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: undefined,
            });
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('sua-url-api/materiais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar material');
            }

            // Limpa o formulário após sucesso
            setFormData({
                nome: "",
                preco: "",
                especificacaoTecnica: "",
                origem: "",
                descricao: "",
            });
            alert('Material cadastrado com sucesso!');
        } catch (error) {
            alert('Erro ao cadastrar material. Tente novamente.');
        } finally {
            setIsSubmitting(false);
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
                    <p className="text-black/60 text-[.9rem]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed eveniet quisquam voluptatem corrupti modi dolorum quo asperiores incidunt, doloribus dolores? Non obcaecati, quaerat molestias sed vitae perferendis nihil consequuntur esse?</p>
                </div>
                {/* Divider */}
                <Divider />

                <div className="py-8">
                    <h3 className="text-[1.25rem] font-semibold">Insira os Dados</h3>
                </div>

                <div>
                    {/* Texto */}
                    <div className='mt-8 mb-8'>
                        <h1 className="text-2xl font-bold">Material</h1>
                    </div>

                    <div className='flex w-full mt-4'>
                        {/* Nome */}
                        <div className='w-[80%]'>
                            <Input
                                type='text'
                                label='*Nome'
                                value={formData.nome}
                                onChange={handleInputChange("nome")}
                                error={errors.nome}
                            />
                        </div>

                        {/* Preço por kg */}
                        <div className='w-[80%] ml-4'>
                            <Input
                                type='text'
                                label='Preço (por kg)'
                                value={formData.preco}
                                onChange={handleInputChange("preco")}
                                error={errors.preco}
                            />
                        </div>
                    </div>

                    <div className='flex w-full mt-4'>
                        {/* Especificação Técnica */}
                        <div className='w-[80%]'>
                            <Input
                                type='text'
                                label='Especificação Técnica'
                                value={formData.especificacaoTecnica}
                                onChange={handleInputChange("especificacaoTecnica")}
                                error={errors.especificacaoTecnica}
                            />
                        </div>

                        {/* Origem (Fornecedor) */}
                        <div className='w-[80%] ml-4'>
                            <Input
                                type='text'
                                label='Origem (Fornecedor)'
                                value={formData.origem}
                                onChange={handleInputChange("origem")}
                                error={errors.origem}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        {/* Descrição */}
                        <Input
                            type="text"
                            label="Descrição"
                            value={formData.descricao}
                            onChange={handleInputChange("descricao")}
                        />
                    </div>

                    {/* Botão */}
                    <div className='w-36 mt-12'>
                        <Button 
                        label='Adicionar' 
                        disabled={isSubmitting} 
                        handleFunction={handleSubmit} 
                        className='w-36 h-11 text-secondary border-2 border-secondary rounded-sm hover:bg-secondary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed' />
                    </div>
                </div>
            </div>
        </div>
    )
}