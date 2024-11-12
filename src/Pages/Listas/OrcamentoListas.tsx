import { FC } from "react"
import { Divider } from "../../Components/Divider"


type OrcamentoProps = {
  title: string
}

export const OrcamentoListas: FC<OrcamentoProps> = ({ title }) => {

  return (
    <div className="my-4 mx-8 bg-white">
      <div className="py-4 px-[3.2rem]">
        <div className="py-4">
          <h3 className="text-2xl font-semibold">{title}</h3>
        </div>
        <div>
          <p className="text-black/60 text-[.9rem]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed eveniet quisquam voluptatem
            corrupti modi dolorum quo asperiores incidunt, doloribus dolores? Non obcaecati, quaerat
            molestias sed vitae perferendis nihil consequuntur esse?
          </p>
        </div>

        <Divider />

        {/* Lista */}
        <div className='h-12 w-full mt-6 bg-primary flex justify-around items-center text-white rounded-sm'>
          <div>
            <h3>Nome do Orçamento</h3>
          </div>
          <div>
            <h3>Empresa</h3>
          </div>
          <div>
            <h3>Data</h3>
          </div>
        </div>
        
        {/* .Map para fazer a lista */}
        <div>

        </div>

      </div>
    </div>
  )
}
