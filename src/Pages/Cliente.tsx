import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { Input } from '../Components/Input'
import { Button } from '../Components/Button'

type ClienteProps = {
    title: string
}

export const Cliente: FC<ClienteProps> = ({ title }) => {

    const [form, setForm] = useState({
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
    })
    // const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // const validate = () => {
    //     const newErrors: { [key: string]: string } = {};
    //     const requiredFields = [
    //         'razaoSocial', 'cnpj', 'inscricaoEstadual', 'email', 'telefone', 'cep', 'pais',
    //         'estado', 'cidade', 'bairro', 'logradouro', 'numero', 'contatoNome', 'contatoCargo',
    //         'contatoSetor'
    //     ];

    //     // Campos obrigatórios
    //     requiredFields.forEach(field => {
    //         if (!form[field]) {
    //             newErrors[field] = 'Este campo é obrigatório';
    //         }
    //     });

    //     // Validação de CNPJ (formato xx.xxx.xxx/xxxx-xx)
    //     if (form.cnpj && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(form.cnpj)) {
    //         newErrors.cnpj = 'CNPJ inválido';
    //     }

    //     // Validação de CEP (formato 00000-000)
    //     if (form.cep && !/^\d{5}-\d{3}$/.test(form.cep)) {
    //         newErrors.cep = 'CEP inválido';
    //     }

    //     // Validação de telefone (formato (00) 00000-0000)
    //     if (form.telefone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(form.telefone)) {
    //         newErrors.telefone = 'Telefone inválido';
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    // const handleSubmit = (e: FormEvent) => {
    //     e.preventDefault();
    //     if (validate()) {
    //         // Lógica para enviar o formulário, caso todos os campos sejam válidos.
    //         console.log("Formulário válido, enviando dados...", form);
    //     }
    // };

    return (
        <form onSubmit={()=>{}} className="my-4 mx-8 bg-white">
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
                <div className='border-t border-black/20 mt-5'></div>

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
                                    type='string'
                                    label='*Razão Social'
                                    name="razaoSocial"
                                    value={form.razaoSocial}
                                    onChange={handleChange}
                                    // error={errors.razaoSocial}
                                />
                            </div>

                            {/* Nome Fantasia */}
                            <div className='w-[80%] ml-4'>
                                <Input
                                    type='string'
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
                                    type='string'
                                    label='*CNPJ'
                                    name="cnpj"
                                    value={form.cnpj}
                                    onChange={handleChange}
                                    // error={errors.cnpj}
                                />
                            </div>

                            {/* Inscrição Estadual */}
                            <div className='w-[80%] ml-4'>
                                <Input
                                    type='string'
                                    label='*Inscrição Estadual'
                                    name="inscricaoEstadual"
                                    value={form.inscricaoEstadual}
                                    onChange={handleChange}
                                    // error={errors.inscricaoEstadual}
                                />
                            </div>
                        </div>

                        <div className='flex w-full mt-4'>
                            {/* E-mail */}
                            <div className='w-[80%]'>
                                <Input
                                    type='string'
                                    label='*E-mail'
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    // error={errors.email}
                                />
                            </div>

                            {/* Telefone */}
                            <div className='w-[80%] ml-4'>
                                <Input
                                    type='string'
                                    label='*Telefone'
                                    name="telefone"
                                    value={form.telefone}
                                    onChange={handleChange}
                                    // error={errors.telefone}
                                />
                            </div>
                        </div>

                        {/* Endereço */}
                        <div className='flex w-full mt-10'>

                            {/* CEP */}
                            <div className='w-[40%]'>
                                <Input
                                    type='string'
                                    label='*CEP'
                                    name="cep"
                                    value={form.cep}
                                    onChange={handleChange}
                                    // error={errors.cep}
                                />
                            </div>

                            {/* País */}
                            <div className='w-[40%] ml-4'>
                                <Input
                                    type='string'
                                    label='*País'
                                    name="pais"
                                    value={form.pais}
                                    onChange={handleChange}
                                    // error={errors.pais}
                                />
                            </div>

                            {/* Estado */}
                            <div className='w-[40%] ml-4'>
                                <Input
                                    type='string'
                                    label='*Estado'
                                    name="estado"
                                    value={form.estado}
                                    onChange={handleChange}
                                    // error={errors.estado}
                                />
                            </div>
                        </div>

                        <div className='flex w-full mt-4'>
                            {/* Cidade */}
                            <div className='w-[80%]'>
                                <Input
                                    type='string'
                                    label='*Cidade'
                                    name="cidade"
                                    value={form.cidade}
                                    onChange={handleChange}
                                    // error={errors.cidade}
                                />
                            </div>

                            {/* Bairro */}
                            <div className='w-[80%] ml-4'>
                                <Input
                                    type='string'
                                    label='*Bairro'
                                    name="bairro"
                                    value={form.bairro}
                                    onChange={handleChange}
                                    // error={errors.bairro}
                                />
                            </div>
                        </div>

                        <div className='flex w-full mt-4'>
                            {/* Logradouro */}
                            <div className='w-[80%]'>
                                <Input
                                    type='string'
                                    label='*Logradouro'
                                    name="logradouro"
                                    value={form.logradouro}
                                    onChange={handleChange}
                                    // error={errors.telefone}
                                />
                            </div>

                            {/* Número */}
                            <div className='w-[80%] ml-4'>
                                <Input
                                    type='string'
                                    label='*Número'
                                    name="numero"
                                    value={form.numero}
                                    onChange={handleChange}
                                    // error={errors.numero}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className='border-t border-black/20 mt-5'></div>

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
                                    type='string'
                                    label='*Nome'
                                    name="contatoNome"
                                    value={form.contatoNome}
                                    onChange={handleChange}
                                    // error={errors.contatoNome}
                                />
                            </div>

                            {/* Cargo */}
                            <div className='w-[40%] ml-4'>
                                <Input
                                    type='string'
                                    label='*Cargo'
                                    name="contatoCargo"
                                    value={form.contatoCargo}
                                    onChange={handleChange}
                                    // error={errors.contatoCargo}
                                />
                            </div>

                            {/* Setor */}
                            <div className='w-[40%] ml-4'>
                                <Input
                                    type='string'
                                    label='*Setor'
                                    name="contatoSetor"
                                    value={form.contatoSetor}
                                    onChange={handleChange}
                                    // error={errors.contatoSetor}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botão */}
                <div className='w-36 mt-12'>
                    <Button label='Adicionar' handleFunction={() => { }} className='w-36 h-11 text-secondary border-2 border-secondary rounded-sm hover:bg-secondary hover:text-white transition-all' />
                </div>

            </div>
        </form>
    )
}