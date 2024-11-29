import { FC, useEffect, useState, ChangeEvent } from 'react'
import { Divider } from '../../Components/Divider'
import { Modal } from '../../Components/Layout/Modal';
import { Input } from '../../Components/Input';

type ClienteProps = {
    title: string
}

type Cliente = {
    id: number;
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    inscricaoEstadual: string;
    email: string;
    telefone: string;
    pais: string;
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    endereco: string;
    logradouro: string;
    numero: string;
    contatoNome: string;
    contatoCargo: string;
    contatoSetor: string;
};

type FormState = {
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    inscricaoEstadual: string;
    email: string;
    telefone: string;
    pais: string;
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    numero: string;
    contatoNome: string;
    contatoCargo: string;
    contatoSetor: string;
};

type FormErrors = {
    [key: string]: string;
};

export const ClienteListas: FC<ClienteProps> = ({ title }) => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
    const [form, setForm] = useState<FormState>({
        razaoSocial: '',
        nomeFantasia: '',
        cnpj: '',
        inscricaoEstadual: '',
        email: '',
        telefone: '',
        pais: '',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        logradouro: '',
        numero: '',
        contatoNome: '',
        contatoCargo: '',
        contatoSetor: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});


    const handleOpenModal = (cliente: Cliente) => {
        console.log("Abrindo modal para cliente:", cliente);
        setSelectedClient(cliente);
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        console.log("Fechando modal", { isOpen, isEditing });
        setIsOpen(false);
        setIsEditing(false);
        setSelectedClient(null);
    };

    const handleEdit = () => {
        console.log("Entrando em modo de edição");
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        console.log("Cancelando edição");
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!selectedClient || !selectedClient.id) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/clientes/${selectedClient.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir material');
            }

            // Remove o material da lista
            const updatedClientes = clientes.filter(
                clientes => clientes.id !== selectedClient.id
            );
            setClientes(updatedClientes);

            setIsOpen(false);
            alert('Cliente excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            alert('Erro ao excluir material. Tente novamente.');
        }
    };


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

    // Formatadores de campos
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

    // Manipulador de mudança de formulário
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Remover erro quando usuário começa a digitar
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Formatar entradas
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
                break;
            default:
                formattedValue = value;
        }

        setForm(prev => ({ ...prev, [name]: formattedValue }));
    }

    // Validação de formulário
    const validate = (): boolean => {
        const newErrors: FormErrors = {};
    
        // Campos obrigatórios
        const requiredFields = [
            'razaoSocial', 'cnpj', 'inscricaoEstadual', 'email', 'telefone',
            'cep', 'pais', 'estado', 'cidade', 'bairro', 'logradouro',
            'numero', 'contatoNome', 'contatoCargo', 'contatoSetor'
        ];
    
        requiredFields.forEach(field => {
            const value = form[field as keyof FormState];
            // Convert to string and trim, handling potential non-string values
            const stringValue = value != null ? String(value).trim() : '';
            if (!stringValue) {
                newErrors[field] = 'Este campo é obrigatório';
            }
        });
    
        // Rest of the validation logic remains the same
        if (form.cnpj && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(form.cnpj)) {
            newErrors.cnpj = 'CNPJ inválido';
        }
    
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'E-mail inválido';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveEdit = async () => {
        // First, validate the form
        const isValid = validate();
        if (!isValid) return;

        // Ensure we have a selected client with an ID
        if (!selectedClient || !selectedClient.id) {
            alert('Erro: Cliente não selecionado');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/clientes/${selectedClient.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    razaoSocial: form.razaoSocial,
                    nomeFantasia: form.nomeFantasia,
                    cnpj: form.cnpj,
                    inscricaoEstadual: form.inscricaoEstadual,
                    email: form.email,
                    telefone: form.telefone,
                    pais: form.pais,
                    cep: form.cep,
                    estado: form.estado,
                    cidade: form.cidade,
                    bairro: form.bairro,
                    logradouro: form.logradouro,
                    numero: form.numero,
                    contatoNome: form.contatoNome,
                    contatoCargo: form.contatoCargo,
                    contatoSetor: form.contatoSetor
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar cliente');
            }

            // Parse the updated client data from the response
            const updatedClient = await response.json();

            // Update the clients list
            setClientes(prevClientes =>
                prevClientes.map(cliente =>
                    cliente.id === selectedClient.id ? updatedClient : cliente
                )
            );

            // Reset editing state and close modal
            setIsEditing(false);
            setIsOpen(false);

            // Optional: Show success message
            alert('Cliente atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            alert('Erro ao atualizar cliente. Tente novamente.');
        }
    };

    // Preparar edição
    useEffect(() => {
        if (selectedClient && isEditing) {
            setForm({
                razaoSocial: selectedClient.razaoSocial,
                nomeFantasia: selectedClient.nomeFantasia || '',
                cnpj: selectedClient.cnpj,
                inscricaoEstadual: selectedClient.inscricaoEstadual,
                email: selectedClient.email,
                telefone: selectedClient.telefone,
                pais: selectedClient.pais,
                cep: selectedClient.cep,
                estado: selectedClient.estado,
                cidade: selectedClient.cidade,
                bairro: selectedClient.bairro,
                logradouro: selectedClient.logradouro,
                numero: selectedClient.numero,
                contatoNome: selectedClient.contatoNome,
                contatoCargo: selectedClient.contatoCargo,
                contatoSetor: selectedClient.contatoSetor
            });
        }
    }, [selectedClient, isEditing]);

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
                        <div key={index} className='grid grid-cols-5 h-12 w-full items-center border-b border-gray-200 text-center md:text-sm' onClick={() => handleOpenModal(cliente)}>
                            <div>{cliente.razaoSocial}</div>
                            <div>{cliente.contatoNome}</div>
                            <div>{cliente.email}</div>
                            <div>{cliente.cnpj}</div>
                            <div>{cliente.telefone}</div>

                        </div>
                    ))}
                    {/* Modal */}
                    {isOpen && selectedClient && (
                        <Modal
                            onClose={handleCloseModal}
                            onEdit={handleEdit}
                            onSaveEdit={handleSaveEdit}
                            onCancelEdit={handleCancelEdit}
                            onDelete={handleDelete}
                            isEditing={isEditing}
                        >
                            {isEditing ? (
                                <div className='py-8'>
                                    <div>
                                        <div className='mt-8 mb-8'>
                                            <h1 className="text-2xl font-bold">Editar Empresa</h1>
                                        </div>
                                        {/* Informações Empresa */}
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
                                                    value={form.nomeFantasia}
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
                                                />
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
                                </div>
                            ) : (
                                <div className='ml-8'>
                                    {/* Nome empresa e fantasia */}
                                    <div>
                                        <h1 className='text-3xl font-medium capitalize'>{selectedClient.razaoSocial}</h1>
                                        <p className='text-base font-medium text-gray-400/70 mt-3'>{selectedClient.nomeFantasia}</p>
                                    </div>

                                    {/* CNPJ e Inscrição Estadual */}
                                    <div className='flex mt-8'>
                                        {/* CNPJ */}
                                        <div>
                                            <p className='text-base font-medium text-gray-400/95 uppercase'>cnpj</p>
                                            <p className='text-base font-medium'>{selectedClient.cnpj}</p>
                                        </div>
                                        {/* Inscrição Estadual */}
                                        <div className='ml-10'>
                                            <p className='text-base font-medium text-gray-400/95'>Inscrição Estadual</p>
                                            <p className='text-base font-medium'>{selectedClient.inscricaoEstadual}</p>
                                        </div>
                                    </div>

                                    {/* País, estado, cidade e logradouro */}
                                    <div className='flex mt-14'>
                                        {/* País */}
                                        <div>
                                            <p className='text-base font-medium text-gray-400/95'>País</p>
                                            <p className='text-base font-medium'>{selectedClient.pais}</p>
                                        </div>

                                        {/* Estado */}
                                        <div className='ml-10'>
                                            <p className='text-base font-medium text-gray-400/95'>Estado</p>
                                            <p className='text-base font-medium'>{selectedClient.estado}</p>
                                        </div>

                                        {/* Cidade */}
                                        <div className='ml-10'>
                                            <p className='text-base font-medium text-gray-400/95'>Cidade</p>
                                            <p className='text-base font-medium'>{selectedClient.cidade}</p>
                                        </div>

                                        {/* Logradouro */}
                                        <div className='ml-10'>
                                            <p className='text-base font-medium text-gray-400/95'>Logradouro</p>
                                            <p className='text-base font-medium'>{selectedClient.logradouro}</p>
                                        </div>
                                    </div>

                                    {/* Bairro e CEP */}
                                    <div className="flex mt-14">
                                        {/* Bairro */}
                                        <div>
                                            <p className='text-base font-medium text-gray-400/95'>Bairro</p>
                                            <p className='text-base font-medium'>{selectedClient.bairro}</p>
                                        </div>

                                        {/* CEP */}
                                        <div className='ml-10'>
                                            <p className='text-base font-medium text-gray-400/95 uppercase'>cep</p>
                                            <p className='text-base font-medium'>{selectedClient.cep}</p>
                                        </div>
                                    </div>

                                    {/* Telefone e Email */}
                                    <div className="flex mt-14">
                                        {/* Telefone */}
                                        <div>
                                            <p className='text-base font-medium text-gray-400/95'>Telefone</p>
                                            <p className='text-base font-medium'>{selectedClient.telefone}</p>
                                        </div>

                                        {/* Email */}
                                        <div className='ml-10'>
                                            <p className='text-base font-medium text-gray-400/95'>E-mail</p>
                                            <p className='text-base font-medium'>{selectedClient.email}</p>
                                        </div>
                                    </div>

                                    {/* Contato Title */}
                                    <div className='mt-14'>
                                        <h1 className='text-2xl font-medium'>Contato</h1>
                                    </div>

                                    {/* Nome, cargo e setor */}
                                    <div className='flex mt-14'>
                                        {/* Nome contato */}
                                        <div>
                                            <p className='text-base font-medium text-gray-400/95'>Nome</p>
                                            <p className='text-base font-medium'>{selectedClient.contatoNome}</p>
                                        </div>

                                        {/* Cargo Contato */}
                                        <div className='ml-10'>
                                            <p className='text-base font-medium text-gray-400/95'>Cargo</p>
                                            <p className='text-base font-medium'>{selectedClient.contatoCargo}</p>
                                        </div>

                                        {/* Setor Contato */}
                                        <div className='ml-10'>
                                            <p className='text-base font-medium text-gray-400/95'>Setor</p>
                                            <p className='text-base font-medium'>{selectedClient.contatoSetor}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    )
}