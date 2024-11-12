import { FC } from 'react'
import { Divider } from '../../Components/Divider'

type ClienteProps = {
    title: string
}

export const ClienteListas: FC<ClienteProps> = ({ title }) => {


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
                <div className='h-12 w-full mt-6 bg-primary flex justify-around items-center text-white rounded-sm'>
                    <div>
                        <h3>Razão Social</h3>
                    </div>
                    <div>
                        <h3>Cargo</h3>
                    </div>
                    <div>
                        <h3>E-mail</h3>
                    </div>
                    <div>
                        <h3>CNPJ</h3>
                    </div>
                    <div>
                        <h3>Telefone</h3>
                    </div>
                </div>
                {/* .Map para fazer a lista */}
                <div>

                </div>
            </div>
        </div>
    )
}