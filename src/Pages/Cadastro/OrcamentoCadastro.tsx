import { ChangeEvent, FC, useState } from "react"
import { Input } from "../../Components/Input"
import CustomSelect from "../../Components/Selection"
import { FaTrash } from "react-icons/fa"
import { Button } from "../../Components/Button"
import { FaPlus } from "react-icons/fa6"
import { Divider } from "../../Components/Divider"


type OrcamentoProps = {
  title: string
}

type Ferramenta = {
  nome: string;
  quantidade: number;
  pecas: Peca[];
};

type Peca = {
  nome: string;
  quantidade: number;
  nota: string;
  material: string;
  peso: number;
  recursos: Recurso[];
};

type Recurso = {
  operation: string;
  horas: number;
};


export const OrcamentoCadastro: FC<OrcamentoProps> = ({ title }) => {
  const [orcamentonome, setOrcamentoNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [contato, setContato] = useState('');
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);

  const addFerramenta = () => {
    setFerramentas([
      ...ferramentas,
      { nome: '', quantidade: 0, pecas: [] },
    ]);
  };

  const removeFerramenta = (index: number) => {
    const updatedFerramentas = [...ferramentas];
    updatedFerramentas.splice(index, 1);
    setFerramentas(updatedFerramentas);
  };

  const addPeca = (index: number) => {
    const updatedFerramentas = [...ferramentas];
    updatedFerramentas[index].pecas.push({
      nome: '',
      quantidade: 0,
      nota: '',
      material: '',
      peso: 0,
      recursos: [],
    });
    setFerramentas(updatedFerramentas);
  };

  const removePeca = (ferramentaIndex: number, pecaIndex: number) => {
    const updatedFerramentas = [...ferramentas];
    updatedFerramentas[ferramentaIndex].pecas.splice(pecaIndex, 1);
    setFerramentas(updatedFerramentas);
  };

  const addRecurso = (ferramentaIndex: number, pecaIndex: number) => {
    const updatedFerramentas = [...ferramentas];
    updatedFerramentas[ferramentaIndex].pecas[pecaIndex].recursos.push({
      operation: '',
      horas: 0,
    });
    setFerramentas(updatedFerramentas);
  };

  const removeRecurso = (ferramentaIndex: number, pecaIndex: number, recursoIndex: number) => {
    const updatedFerramentas = [...ferramentas];
    updatedFerramentas[ferramentaIndex].pecas[pecaIndex].recursos.splice(recursoIndex, 1);
    setFerramentas(updatedFerramentas);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/orcamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: orcamentonome,
          empresa,
          contato,
          ferramentas,
        }),
      });

      if (response.ok) {
        console.log('Orçamento enviado com sucesso!');
      } else {
        console.error('Erro ao enviar o orçamento.');
      }
    } catch (error) {
      console.error('Erro ao enviar o orçamento:', error);
    }
  };

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

        <div>
          <div className="py-8">
            <h3 className="text-[1.25rem] font-semibold">Insira os Dados</h3>
          </div>

          <Input
            type="text"
            label="*Nome Orçamento"
            value={orcamentonome}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOrcamentoNome(e.target.value)}
          />

          <div className="flex">
            <div className="w-full mr-4">
              <CustomSelect
                title="*Empresa"
                value={empresa}
                onChange={(value) => setEmpresa(value)}
              />
            </div>
            <div className="w-full">
              <CustomSelect
                title="*Contato"
                value={contato}
                onChange={(value) => setContato(value)}
              />
            </div>
          </div>

          {ferramentas.map((ferramenta, ferramentaIndex) => (
            <div key={ferramentaIndex} className="my-4 border-t border-black/30 w-full">
              <div className="py-4 px-[1.2rem] w-full">
                <div className="py-4 flex">
                  <h1 className="text-2xl font-bold">Ferramenta</h1>
                  <div className="w-full flex justify-end items-center">
                    
                    <button
                      type="button"
                      onClick={() => removeFerramenta(ferramentaIndex)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={15} />
                    </button>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-full mr-4">
                    <Input
                      type="text"
                      label="*Nome"
                      value={ferramenta.nome}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const updatedFerramentas = [...ferramentas];
                        updatedFerramentas[ferramentaIndex].nome = e.target.value;
                        setFerramentas(updatedFerramentas);
                      }}
                    />
                  </div>
                  <div className="w-[40%]">
                    <Input
                      type="number"
                      label="*Quantidade"
                      value={ferramenta.quantidade}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const updatedFerramentas = [...ferramentas];
                        updatedFerramentas[ferramentaIndex].quantidade = parseInt(e.target.value);
                        setFerramentas(updatedFerramentas);
                      }}
                    />
                  </div>
                </div>

                {ferramenta.pecas.map((peca, pecaIndex) => (
                  <div key={pecaIndex} className="w-full mt-9 shadow-lg rounded-sm">
                    <div className="py-4 flex">
                      <h1 className="text-2xl font-bold ml-7">Peça</h1>
                      <div className="w-full flex justify-end items-center mr-7">
                        
                        <button
                          type="button"
                          onClick={() => removePeca(ferramentaIndex, pecaIndex)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-[59%] mr-3 ml-2">
                        <Input
                          type="text"
                          label="*Nome"
                          value={peca.nome}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const updatedFerramentas = [...ferramentas];
                            updatedFerramentas[ferramentaIndex].pecas[pecaIndex].nome = e.target.value;
                            setFerramentas(updatedFerramentas);
                          }}
                        />
                      </div>
                      <div className="w-[29%]">
                        <Input
                          type="number"
                          label="*Quantidade"
                          value={peca.quantidade}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const updatedFerramentas = [...ferramentas];
                            updatedFerramentas[ferramentaIndex].pecas[pecaIndex].quantidade = parseInt(e.target.value);
                            setFerramentas(updatedFerramentas);
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-[90%] ml-11">
                      <Input
                        type="string"
                        label="Nota"
                        value={peca.nota}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const updatedFerramentas = [...ferramentas];
                          updatedFerramentas[ferramentaIndex].pecas[pecaIndex].nota = e.target.value;
                          setFerramentas(updatedFerramentas);
                        }}
                      />
                    </div>

                    <div className="flex justify-center items-center ml-4">
                      <div className="w-[60%] mr-4">
                        <CustomSelect
                          title="*Material"
                          value={peca.material}
                          onChange={(value) => {
                            const updatedFerramentas = [...ferramentas];
                            updatedFerramentas[ferramentaIndex].pecas[pecaIndex].material = value;
                            setFerramentas(updatedFerramentas);
                          }}
                        />
                      </div>
                      <div className="w-[30%] mt-1">
                        <Input
                          type="number"
                          label="*Pesos em kg"
                          value={peca.peso}
                          onChange={(e:ChangeEvent<HTMLInputElement>) => {
                            const updatedFerramentas = [...ferramentas];
                            updatedFerramentas[ferramentaIndex].pecas[pecaIndex].peso = parseFloat(e.target.value);
                            setFerramentas(updatedFerramentas);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 ml-4">
                      <h1 className="text-2xl font-bold ml-7">Recursos</h1>

                      {peca.recursos.map((recurso, recursoIndex) => (
                        <div key={recursoIndex} className="flex justify-center items-center">
                          <div className="w-[60%] mr-4">
                            <CustomSelect
                              title="*Operação"
                              value={recurso.operation}
                              onChange={(value) => {
                                const updatedFerramentas = [...ferramentas];
                                updatedFerramentas[ferramentaIndex].pecas[pecaIndex].recursos[recursoIndex].operation = value;
                                setFerramentas(updatedFerramentas);
                              }}
                            />
                          </div>
                          <div className="w-[30%] mt-1">
                            <Input
                              type="number"
                              label="*Quantidade de Horas"
                              value={recurso.horas}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const updatedFerramentas = [...ferramentas];
                                updatedFerramentas[ferramentaIndex].pecas[pecaIndex].recursos[recursoIndex].horas = parseInt(e.target.value);
                                setFerramentas(updatedFerramentas);
                              }}
                            />
                          </div>
                          <div className="ml-4 mt-5 flex items-center">
                            <button
                              type="button"
                              onClick={() => removeRecurso(ferramentaIndex, pecaIndex, recursoIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash size={15} />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="w-full mt-9 pb-6 flex justify-center">
                        <Button
                          label="Adicionar Operação"
                          handleFunction={() => addRecurso(ferramentaIndex, pecaIndex)}
                          icon={<FaPlus />}
                          className="w-[80%] h-11 flex items-center justify-center shadow-md rounded-sm text-secondary font-medium hover:bg-secondary hover:text-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="w-full mt-9 pb-6 flex justify-center">
                  <Button
                    label="Adicionar Nova Peça"
                    handleFunction={() => addPeca(ferramentaIndex)}
                    icon={<FaPlus />}
                    className="w-full h-11 flex items-center justify-center shadow-md rounded-sm text-secondary font-medium hover:bg-secondary hover:text-white transition-all"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="w-full mt-4 pb-6 flex justify-center">
            <Button
              label="Adicionar Nova Ferramenta"
              handleFunction={addFerramenta}
              icon={<FaPlus />}
              className="w-full h-11 flex items-center justify-center shadow-md rounded-sm text-secondary font-medium hover:bg-secondary hover:text-white transition-all"
            />
          </div>

          <div className="mt-32">
            <Button
              label="Enviar"
              handleFunction={handleSubmit}
              className="w-40 h-10 border-2 border-secondary text-secondary font-medium hover:bg-secondary hover:text-white transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
