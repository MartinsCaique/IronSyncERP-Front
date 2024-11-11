import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react'
import { Input } from '../Components/Input'
import { Button } from '../Components/Button'
import { Divider } from '../Components/Divider'

type ClienteProps = {
    title: string
}

interface FormErrors {
    [key: string]: string;
}

interface CepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}


export const Cliente: FC<ClienteProps> = ({ title }) => {

    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isLoadingCep, setIsLoadingCep] = useState(false)
    const [isCepFilled, setIsCepFilled] = useState(false)

    const [form, setForm] = useState({
        cnpj: '',
        razaoSocial: '',
        inscricaoEstadual: '',
        email: '',
        telefone: '',
        cep: '',
        pais: 'Brasil', // Default para Brasil
        estado: '',
        cidade: '',
        bairro: '',
        logradouro: '',
        numero: '',
        contatoNome: '',
        contatoCargo: '',
        contatoSetor: '',
        nomeFantasia: ''
    })

    const [errors, setErrors] = useState<FormErrors>({});

    // Effect para limpar a mensagem de erro após 5 segundos
    useEffect(() => {
        if (submitError) {
            const timer = setTimeout(() => {
                setSubmitError(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [submitError]);

    const fetchAddressByCep = async (cep: string) => {
        if (cep.length !== 9) return; // Espera o CEP estar completo (00000-000)

        setIsLoadingCep(true);
        const cleanCep = cep.replace(/\D/g, '');

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data: CepResponse = await response.json();

            if (data.erro) {
                setErrors(prev => ({
                    ...prev,
                    cep: 'CEP não encontrado'
                }));
                return;
            }

            // Atualiza o formulário com os dados do CEP
            setForm(prev => ({
                ...prev,
                logradouro: data.logradouro || prev.logradouro,
                bairro: data.bairro || prev.bairro,
                cidade: data.localidade || prev.cidade,
                estado: data.uf || prev.estado,
                pais: 'Brasil'
            }));

            // Define o estado para desabilitar campos preenchidos automaticamente
            setIsCepFilled(true);

            // Remove erro do CEP se existir
            if (errors.cep) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.cep;
                    return newErrors;
                });
            }

        } catch (error) {
            setErrors(prev => ({
                ...prev,
                cep: 'Erro ao buscar CEP'
            }));
        } finally {
            setIsLoadingCep(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Remova o erro quando o usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Formatar entradas enquanto digita
        let formattedValue = value;
        switch (name) {
            case 'cnpj':
                formattedValue = formatCNPJ(value);
                break;
            case 'telefone':
                formattedValue = formatPhone(value);
                break;
            case 'cep':
                formattedValue = formatCEP(value);
                if (formattedValue.length === 9) { // CEP completo
                    fetchAddressByCep(formattedValue);
                }
                break;
            default:
                formattedValue = value;
        }

        setForm(prev => ({ ...prev, [name]: formattedValue }));
    }

    // Formatting functions
    const formatCNPJ = (value: string): string => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 18);
    }

    const formatPhone = (value: string): string => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15);
    }

    const formatCEP = (value: string): string => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{5})(\d)/, '$1-$2')
            .slice(0, 9);
    }

    // CEP auto-complete
    const fetchAddress = async (cep: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setForm(prev => ({
                    ...prev,
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
    }

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        // Required fields
        const requiredFields = [
            'razaoSocial', 'cnpj', 'inscricaoEstadual', 'email', 'telefone',
            'cep', 'pais', 'estado', 'cidade', 'bairro', 'logradouro',
            'numero', 'contatoNome', 'contatoCargo', 'contatoSetor'
        ];

        requiredFields.forEach(field => {
            if (!form[field as keyof typeof form].trim()) {
                newErrors[field] = 'Este campo é obrigatório';
            }
        });

        // CNPJ validation
        if (form.cnpj && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(form.cnpj)) {
            newErrors.cnpj = 'CNPJ inválido';
        }

        // Email validation
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'E-mail inválido';
        }

        // CEP validation
        if (form.cep && !/^\d{5}-\d{3}$/.test(form.cep)) {
            newErrors.cep = 'CEP inválido';
        }

        // Phone validation
        if (form.telefone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(form.telefone)) {
            newErrors.telefone = 'Telefone inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validate()) {
            return;
        }


        try {
            const response = await fetch('YOUR_API_ENDPOINT/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            // Reset form after successful submission
            setForm({
                cnpj: '',
                razaoSocial: '',
                inscricaoEstadual: '',
                email: '',
                telefone: '',
                cep: '',
                pais: '',
                estado: '',
                cidade: '',
                bairro: '',
                logradouro: '',
                numero: '',
                contatoNome: '',
                contatoCargo: '',
                contatoSetor: '',
                nomeFantasia: ''
            });

            alert('Cliente cadastrado com sucesso!');
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Erro ao cadastrar cliente');
        } finally {
        }
    };

    return (
        <form onSubmit={handleSubmit} className="my-4 mx-8 bg-white">
            {/* se der erro */}
            {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {submitError}
                </div>
            )}

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

                    {/* Informação da Empresa */}
                    <div>
                        <div className='mt-8 mb-8'>
                            <h1 className="text-2xl font-bold">Empresa</h1>
                        </div>

                        <div className='flex w-full mt-4'>
                            {/* Razão Social */}
                            <div className='w-[80%]'>
                                <Input
                                    type='text'
                                    label='*Razão Social'
                                    name="razaoSocial"
                                    value={form.razaoSocial}
                                    onChange={handleChange}
                                    error={errors.razaoSocial}
                                />
                            </div>

                            {/* Nome Fantasia */}
                            <div className='w-[80%] ml-4'>
                                <Input
                                    type='text'
                                    label='Nome Fantasia'
                                    name="nomeFantasia"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className='flex w-full mt-4'>
                            {/* CNPJ */}
                            <div className='w-[80%]'>
                                <Input
                                    type='text'
                                    label='*CNPJ'
                                    name="cnpj"
                                    value={form.cnpj}
                                    onChange={handleChange}
                                    error={errors.cnpj}
                                />
                            </div>

                            {/* Inscrição Estadual */}
                            <div className='w-[80%] ml-4'>
                                <Input
                                    type='text'
                                    label='*Inscrição Estadual'
                                    name="inscricaoEstadual"
                                    value={form.inscricaoEstadual}
                                    onChange={handleChange}
                                    error={errors.inscricaoEstadual}
                                />
                            </div>
                        </div>

                        <div className='flex w-full mt-4'>
                            {/* E-mail */}
                            <div className='w-[80%]'>
                                <Input
                                    type='text'
                                    label='*E-mail'
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                />
                            </div>

                            {/* Telefone */}
                            <div className='w-[80%] ml-4'>
                                <Input
                                    type='text'
                                    label='*Telefone'
                                    name="telefone"
                                    value={form.telefone}
                                    onChange={handleChange}
                                    error={errors.telefone}
                                />
                            </div>
                        </div>

                        {/* Endereço */}
                        <div className='flex w-full mt-10'>

                            {/* CEP */}
                            <div className='w-[40%]'>
                                <Input
                                    type='text'
                                    label='*CEP'
                                    name="cep"
                                    value={form.cep}
                                    onChange={handleChange}
                                    error={errors.cep}
                                    disabled={isLoadingCep}
                                />
                                {isLoadingCep && (
                                    <div className="absolute right-3 top-9">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary"></div>
                                    </div>
                                )}
                            </div>

                            {/* País */}
                            <div className='w-[40%] ml-4'>
                                <Input
                                    type='text'
                                    label='*País'
                                    name="pais"
                                    value={form.pais}
                                    onChange={handleChange}
                                    error={errors.pais}
                                />
                            </div>

                            {/* Estado */}
                            <div className='w-[40%] ml-4'>
                                <Input
                                    type='text'
                                    label='*Estado'
                                    name="estado"
                                    value={form.estado}
                                    onChange={handleChange}
                                    error={errors.estado}
                                    disabled={isLoadingCep || isCepFilled}
                                />
                            </div>
                        </div>

                        <div className='flex w-full mt-4'>
                            {/* Cidade */}
                            <div className='w-[80%]'>
                                <Input
                                    type='text'
                                    label='*Cidade'
                                    name="cidade"
                                    value={form.cidade}
                                    onChange={handleChange}
                                    error={errors.cidade}
                                    disabled={isLoadingCep || isCepFilled}
                                />
                            </div>

                            {/* Bairro */}
                            <div className='w-[80%] ml-4'>
                                <Input
                                    type='text'
                                    label='*Bairro'
                                    name="bairro"
                                    value={form.bairro}
                                    onChange={handleChange}
                                    error={errors.bairro}
                                    disabled={isLoadingCep || isCepFilled}
                                />
                            </div>
                        </div>

                        <div className='flex w-full mt-4'>
                            {/* Logradouro */}
                            <div className='w-[80%]'>
                                <Input
                                    type='text'
                                    label='*Logradouro'
                                    name="logradouro"
                                    value={form.logradouro}
                                    onChange={handleChange}
                                    error={errors.logradouro}
                                    disabled={isLoadingCep || isCepFilled}
                                />
                            </div>

                            {/* Número */}
                            <div className='w-[80%] ml-4'>
                                <Input
                                    type='text'
                                    label='*Número'
                                    name="numero"
                                    value={form.numero}
                                    onChange={handleChange}
                                    error={errors.numero}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <Divider />

                {/* Informação Contato */}
                <div>
                    <div className="py-4 px-3">
                        <div className="py-4 mb-8">
                            <h1 className="text-2xl font-bold">Contato</h1>
                        </div>

                        <div className="flex">
                            {/* Nome */}
                            <div className='w-[40%]'>
                                <Input
                                    type='text'
                                    label='*Nome'
                                    name="contatoNome"
                                    value={form.contatoNome}
                                    onChange={handleChange}
                                    error={errors.contatoNome}
                                />
                            </div>

                            {/* Cargo */}
                            <div className='w-[40%] ml-4'>
                                <Input
                                    type='text'
                                    label='*Cargo'
                                    name="contatoCargo"
                                    value={form.contatoCargo}
                                    onChange={handleChange}
                                    error={errors.contatoCargo}
                                />
                            </div>

                            {/* Setor */}
                            <div className='w-[40%] ml-4'>
                                <Input
                                    type='text'
                                    label='*Setor'
                                    name="contatoSetor"
                                    value={form.contatoSetor}
                                    onChange={handleChange}
                                    error={errors.contatoSetor}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botão */}
                <div className='w-36 mt-12'>
                    <Button
                    type={'submit'}
                    label='Adicionar' 
                    handleFunction={() => { }} 
                    className='w-36 h-11 text-secondary border-2 border-secondary rounded-sm hover:bg-secondary hover:text-white transition-all' />
                </div>

            </div>
        </form>
    )
}