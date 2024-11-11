import { FC } from "react"
import { Input } from "../Components/Input"
import { Button } from "../Components/Button"


type MaterialProps = {
    title: string
}

export const Material: FC<MaterialProps> = ({ title }) => {
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
                <div className='border-t border-black/20 mt-5'></div>

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
                                type='string'
                                label='*Nome'
                            />
                        </div>

                        {/* Preço por kg */}
                        <div className='w-[80%] ml-4'>
                            <Input
                                type='string'
                                label='Preço (por kg)'
                            />
                        </div>
                    </div>

                    <div className='flex w-full mt-4'>
                        {/* Especificação Técnica */}
                        <div className='w-[80%]'>
                            <Input
                                type='string'
                                label='Especificação Técnica'
                            />
                        </div>

                        {/* Origem (Fornecedor) */}
                        <div className='w-[80%] ml-4'>
                            <Input
                                type='string'
                                label='Origem (Fornecedor)'
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        {/* Descrição */}
                        <Input
                            type="string"
                            label="Descrição"
                        />
                    </div>

                    {/* Botão */}
                    <div className='w-36 mt-12'>
                        <Button label='Adicionar' handleFunction={() => { }} className='w-36 h-11 text-secondary border-2 border-secondary rounded-sm hover:bg-secondary hover:text-white transition-all' />
                    </div>
                </div>
            </div>
        </div>
    )
}
