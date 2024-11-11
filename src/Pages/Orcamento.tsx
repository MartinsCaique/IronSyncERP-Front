import { FC } from "react"
import { Input } from "../Components/Input"
import CustomSelect from "../Components/Selection"


type OrcamentoProps = {
    title: string
  }

export const Orcamento: FC<OrcamentoProps> = ({title}) => {
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

      <div>
        <div className="py-8">
          <h3 className="text-[1.25rem] font-semibold">Insira os Dados</h3>
        </div>

        <Input type="text" label="*Nome Orçamento" />

        <div className="flex">
          <div className="w-full mr-4">
            <CustomSelect title="*Empresa" />
          </div>
          <div className="w-full">
            <CustomSelect title="*Contato" />
          </div>
        </div>


        <div className="my-4 border-t border-black/30">
          <div className="py-4 px-[3.2rem]">
            <div className="py-4">
              <h1 className="text-2xl font-bold">Ferramenta</h1>
            </div>

            <div className="flex">
              <div className="w-full mr-4">
                <Input type="text" label="*Nome" />
              </div>
              <div className="w-[40%]">
                <Input type="number" label="*Quantidade" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
