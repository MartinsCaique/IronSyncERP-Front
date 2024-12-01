import { FC, useEffect, useState } from "react"
import { Divider } from "../../Components/Divider"
import { Modal } from "../../Components/Layout/Modal"
import CustomSelect from "../../Components/Selection"
import { Input } from "../../Components/Input"
import { Button } from "../../Components/Button"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


type OrcamentoProps = {
  title: string
}

type Ferramenta = {
  id?: string;
  nome: string;
  quantidade: number;
  pecas?: Peca[];
};

type Peca = {
  id?: string;
  nome: string;
  quantidade: number;
  nota?: string;
  material_id: string;
  material_nome?: string;
  peso: number;
  operacoes?: Recurso[];
};

type Recurso = {
  id?: string;
  operacao_id: string;
  nome: string;
  horas: number;
};

type Orcamento = {
  id: string;
  nome: string;
  cliente_id: string;
  contato: string;
  cliente_nome?: string;
  created_at?: string;
  ferramentas?: Ferramenta[];
  pecas?: Peca[];
  operacoes?: Recurso[];
}

/**
 * Exporta o conteúdo de um elemento HTML para um arquivo PDF.
 * @param elementId - O ID do elemento HTML a ser capturado.
 * @param fileName - O nome do arquivo PDF a ser gerado.
 */
const exportHTMLToPDF = async (elementId: string, fileName: string = "documento.pdf") => {
  const element = document.getElementById(elementId);

  if (!element) {
    alert("Nenhuma visualização encontrada para exportar.");
    return;
  }

  try {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    alert("Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.");
  }
};

export const OrcamentoListas: FC<OrcamentoProps> = ({ title }) => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [editedOrcamento, setEditedOrcamento] = useState<Orcamento>({
    id: '',
    nome: '',
    cliente_id: '',
    contato: '',
    ferramentas: [],
    pecas: []
  });
  const [empresas, setEmpresas] = useState<{ id: string, label: string }[]>([]);
  const [clientes, setClientes] = useState<{ id: string, label: string }[]>([]);

  // Buscar lista de orçamentos
  const fetchOrcamentos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/orcamentos');
      const data = await response.json();
      setOrcamentos(data);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
    }
  };

  // Buscar lista de empresas
  const fetchEmpresas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/clientes');
      const data = await response.json();
      const empresasFormatadas = data.map((empresa: any) => ({
        id: empresa.id,
        label: empresa.razaoSocial
      }));
      setEmpresas(empresasFormatadas);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
  };

  // Buscar lista de contatos
  const fetchContatos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/clientes');
      const data = await response.json();
      const contatosFormatados = data.map((contato: any) => ({
        id: contato.id,
        label: contato.contatoNome
      }));
      setClientes(contatosFormatados);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    }
  };

  const fetchMateriais = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/materiais');
      const data = await response.json();
      return data.map((material: any) => ({
        id: material.id,
        label: material.nome
      }));
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      return [];
    }
  };

  const fetchOperacoes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/operacoes');
      const data = await response.json();
      return data.map((operacao: any) => ({
        id: operacao.id,
        label: operacao.operacao
      }));
    } catch (error) {
      console.error('Erro ao buscar operações:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchOrcamentos();
    fetchEmpresas();
    fetchContatos();
    fetchMateriais();
    fetchOperacoes();
  }, []);

  const addEditFerramenta = () => {
    if (editedOrcamento) {
      const updatedFerramentas = [
        ...(editedOrcamento.ferramentas || []),
        { nome: '', quantidade: 0, pecas: [] }
      ];
      setEditedOrcamento({
        ...editedOrcamento,
        ferramentas: updatedFerramentas
      });
    }
  };

  const removeEditFerramenta = (ferramentaIndex: number) => {
    if (editedOrcamento) {
      const updatedFerramentas = [...(editedOrcamento.ferramentas || [])];
      updatedFerramentas.splice(ferramentaIndex, 1);
      setEditedOrcamento({
        ...editedOrcamento,
        ferramentas: updatedFerramentas
      });
    }
  };

  const addEditPeca = (ferramentaIndex: number) => {
    if (editedOrcamento) {
      const updatedFerramentas = [...(editedOrcamento.ferramentas || [])];
      const updatedPecas = updatedFerramentas[ferramentaIndex].pecas || [];
      updatedPecas.push({
        nome: '',
        quantidade: 0,
        nota: '',
        material_id: '',
        material_nome: '',
        peso: 0,
        operacoes: []
      });
      updatedFerramentas[ferramentaIndex].pecas = updatedPecas;

      setEditedOrcamento({
        ...editedOrcamento,
        ferramentas: updatedFerramentas
      });
    }
  };

  const removeEditPeca = (ferramentaIndex: number, pecaIndex: number) => {
    if (editedOrcamento) {
      const updatedFerramentas = [...(editedOrcamento.ferramentas || [])];
      const updatedPecas = updatedFerramentas[ferramentaIndex].pecas || [];
      updatedPecas.splice(pecaIndex, 1);
      updatedFerramentas[ferramentaIndex].pecas = updatedPecas;

      setEditedOrcamento({
        ...editedOrcamento,
        ferramentas: updatedFerramentas
      });
    }
  };

  const addEditRecurso = (ferramentaIndex: number, pecaIndex: number) => {
    if (editedOrcamento) {
      const updatedFerramentas = [...(editedOrcamento.ferramentas || [])];
      const updatedPecas = updatedFerramentas[ferramentaIndex].pecas || [];
      const updatedOperacoes = updatedPecas[pecaIndex].operacoes || [];

      updatedOperacoes.push({
        operacao_id: '',
        nome: '', // Adicione um valor inicial para 'nome'
        horas: 0
      });

      updatedPecas[pecaIndex].operacoes = updatedOperacoes;
      updatedFerramentas[ferramentaIndex].pecas = updatedPecas;

      setEditedOrcamento({
        ...editedOrcamento,
        ferramentas: updatedFerramentas
      });
    }
  };


  const removeEditRecurso = (ferramentaIndex: number, pecaIndex: number, recursoIndex: number) => {
    if (editedOrcamento) {
      const updatedFerramentas = [...(editedOrcamento.ferramentas || [])];
      const updatedPecas = updatedFerramentas[ferramentaIndex].pecas || [];
      const updatedOperacoes = updatedPecas[pecaIndex].operacoes || [];

      updatedOperacoes.splice(recursoIndex, 1);
      updatedPecas[pecaIndex].operacoes = updatedOperacoes;
      updatedFerramentas[ferramentaIndex].pecas = updatedPecas;

      setEditedOrcamento({
        ...editedOrcamento,
        ferramentas: updatedFerramentas
      });
    }
  };

  const useFetchOrcamentoDetails = (orcamentos: Orcamento[]) => {
    const [orcamentosComDetalhes, setOrcamentosComDetalhes] = useState<Orcamento[]>([]);

    useEffect(() => {
      const fetchDetailsForOrcamentos = async () => {
        // Cria cópias dos orçamentos para não modificar o estado original
        const orcamentosDetalhados = [...orcamentos];

        // Busca todos os dados de uma vez para evitar múltiplas requisições
        const [clientes, materiais, operacoes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/clientes/').then(res => res.json()),
          fetch('http://127.0.0.1:8000/api/materiais/').then(res => res.json()),
          fetch('http://127.0.0.1:8000/api/operacoes/').then(res => res.json())
        ]);

        // Mapeia os dados para facilitar busca por ID
        const clientesMap = Object.fromEntries(
          clientes.map((cliente: any) => [cliente.id, {
            razaoSocial: cliente.razaoSocial,
            contatoNome: cliente.contatoNome
          }])
        );

        const materiaisMap = Object.fromEntries(
          materiais.map((material: any) => [material.id, material.nome])
        );

        const operacoesMap = Object.fromEntries(
          operacoes.map((operacao: any) => [operacao.id, operacao.operacao])
        );

        // Atualiza os orçamentos com nomes detalhados
        const orcamentosAtualizados = orcamentosDetalhados.map(orcamento => {
          // Adiciona nome da empresa
          const cliente = clientesMap[orcamento.cliente_id];
          orcamento.cliente_nome = cliente ? cliente.razaoSocial : 'N/A';

          // Atualiza nomes dos materiais nas peças
          if (orcamento.ferramentas) {
            orcamento.ferramentas.forEach(ferramenta => {
              if (ferramenta.pecas) {
                ferramenta.pecas.forEach(peca => {
                  // Busca o nome do material
                  peca.material_nome = materiaisMap[peca.material_id] || 'N/A';

                  // Atualiza nomes das operações
                  if (peca.operacoes) {
                    peca.operacoes.forEach(operacao => {
                      operacao.nome = operacoesMap[operacao.operacao_id] || 'N/A';
                    });
                  }
                });
              }
            });
          }

          return orcamento;
        });

        setOrcamentosComDetalhes(orcamentosAtualizados);
      };

      if (orcamentos.length > 0) {
        fetchDetailsForOrcamentos();
      }
    }, [orcamentos]);

    return orcamentosComDetalhes;
  };
  const orcamentosComDetalhes = useFetchOrcamentoDetails(orcamentos);

  // Abrir modal com detalhes do orçamento
  const handleOpenModal = (orcamento: Orcamento) => {
    setSelectedOrcamento(orcamento);
    setIsOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedOrcamento(null);
    setIsEditing(false);
  };

  // Iniciar edição
  const handleEdit = () => {
    setIsEditing(true);
    setEditedOrcamento({
      ...(selectedOrcamento || {
        id: '',
        nome: '',
        cliente_id: '',
        contato: '',
        ferramentas: [],
        pecas: []
      }),
      ferramentas: selectedOrcamento?.ferramentas || [],
      pecas: selectedOrcamento?.pecas || []
    });
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedOrcamento({
      id: '',
      nome: '',
      cliente_id: '',
      contato: '',
      ferramentas: [],
      pecas: []
    });
  };

  // Salvar edições
  const handleSaveEdit = async () => {
    if (!editedOrcamento) return;

    try {
      const response = await fetch(`http://localhost:8000/api/orcamentos/${editedOrcamento.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(editedOrcamento),
      });

      if (response.ok) {
        // Atualizar lista de orçamentos
        fetchOrcamentos();

        // Fechar modal e resetar estados
        handleCloseModal();
        alert("Orçamento atualizado com sucesso!");
      } else {
        console.error('Erro ao atualizar o orçamento.');
      }
    } catch (error) {
      console.error('Erro ao salvar edições:', error);
    }
  };

  // Remover orçamento
  const handleDelete = async () => {
    if (!selectedOrcamento) return;

    try {
      const response = await fetch(`http://localhost:8000/api/orcamentos/${selectedOrcamento.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Atualizar lista de orçamentos
        fetchOrcamentos();

        // Fechar modal
        handleCloseModal();
        alert("Orçamento removido com sucesso!");
      } else {
        console.error('Erro ao remover o orçamento.');
      }
    } catch (error) {
      console.error('Erro ao remover orçamento:', error);
    }
  };

  const handleExportPDF = () => {
    exportHTMLToPDF("orcamento-visualizacao", "orcamento-detalhado.pdf");
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

        {/* Lista */}
        <div className='grid grid-cols-3 h-12 w-full mt-6 bg-primary text-white rounded-sm text-center items-center'>
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
        {orcamentosComDetalhes.map((orcamento) => (
          <div key={orcamento.id} className="grid grid-cols-3 h-12 w-full items-center border-b border-gray-200 text-center" onClick={() => handleOpenModal(orcamento)}>
            <div>{orcamento.nome}</div>
            <div>{orcamento.cliente_nome}</div>
            <div>{orcamento.created_at ? new Date(orcamento.created_at).toLocaleDateString('pt-BR') : 'Sem data'}</div>
          </div>
        ))}

        {/* Modal */}
        {isOpen && selectedOrcamento && (
          <Modal
            onClose={handleCloseModal}
            onEdit={handleEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onDelete={handleDelete}
            isEditing={isEditing}
          >
            {isEditing ? (
              <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nome do Orçamento"
                    type="text"
                    value={editedOrcamento?.nome || ''}
                    onChange={(e: any) => setEditedOrcamento({
                      ...editedOrcamento!,
                      nome: e.target.value
                    })}
                  />
                  <CustomSelect
                    title="Empresa"
                    value={editedOrcamento?.cliente_id || ''}
                    onChange={(value) => setEditedOrcamento({
                      ...editedOrcamento!,
                      cliente_id: value
                    })}
                    fetchOptions={() => Promise.resolve(empresas)}
                  />
                  <CustomSelect
                    title="Contato"
                    value={editedOrcamento?.contato || ''}
                    onChange={(value) => setEditedOrcamento({
                      ...editedOrcamento!,
                      contato: value
                    })}
                    fetchOptions={() => Promise.resolve(clientes)}
                  />
                </div>

                {/* Ferramentas Section */}
                {editedOrcamento?.ferramentas?.map((ferramenta, ferramentaIndex) => (
                  <div
                    key={ferramentaIndex}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Ferramenta {ferramentaIndex + 1}
                      </h3>
                      <div className="flex space-x-2">
                        <Button
                          label="Remover Ferramenta"
                          handleFunction={() => removeEditFerramenta(ferramentaIndex)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                        />
                        <Button
                          handleFunction={addEditFerramenta}
                          className="bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                          label="Adicionar Ferramenta"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        label="Nome da Ferramenta"
                        value={ferramenta.nome}
                        onChange={(e: any) => {
                          const updatedFerramentas = [...(editedOrcamento!.ferramentas || [])];
                          updatedFerramentas[ferramentaIndex].nome = e.target.value;
                          setEditedOrcamento({
                            ...editedOrcamento!,
                            ferramentas: updatedFerramentas
                          });
                        }}
                      />
                      <Input
                        type="number"
                        label="Quantidade"
                        value={ferramenta.quantidade}
                        onChange={(e: any) => {
                          const updatedFerramentas = [...(editedOrcamento!.ferramentas || [])];
                          updatedFerramentas[ferramentaIndex].quantidade = parseInt(e.target.value);
                          setEditedOrcamento({
                            ...editedOrcamento!,
                            ferramentas: updatedFerramentas
                          });
                        }}
                      />
                    </div>

                    {/* Peças Section */}
                    {ferramenta.pecas?.map((peca, pecaIndex) => (
                      <div
                        key={pecaIndex}
                        className="bg-white border-l-4 border-blue-500 pl-4 py-4 space-y-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium text-gray-600">
                            Peça {pecaIndex + 1}
                          </h4>
                          <div className="flex space-x-2">
                            <Button
                              handleFunction={() => removeEditPeca(ferramentaIndex, pecaIndex)}
                              className="bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-md text-sm transition-colors"
                              label="Remover Peça"
                            />
                            <Button
                              handleFunction={() => addEditPeca(ferramentaIndex)}
                              className="bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded-md text-sm transition-colors"
                              label="Adicionar Peça"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            type="text"
                            label="Nome da Peça"
                            value={peca.nome}
                            onChange={(e: any) => {
                              const updatedFerramentas = [...(editedOrcamento!.ferramentas || [])];
                              updatedFerramentas[ferramentaIndex].pecas![pecaIndex].nome = e.target.value;
                              setEditedOrcamento({
                                ...editedOrcamento!,
                                ferramentas: updatedFerramentas
                              });
                            }}
                          />
                          <Input
                            type="number"
                            label="Quantidade"
                            value={peca.quantidade}
                            onChange={(e: any) => {
                              const updatedFerramentas = [...(editedOrcamento!.ferramentas || [])];
                              updatedFerramentas[ferramentaIndex].pecas![pecaIndex].quantidade = parseInt(e.target.value);
                              setEditedOrcamento({
                                ...editedOrcamento!,
                                ferramentas: updatedFerramentas
                              });
                            }}
                          />
                        </div>

                        <Input
                          type="text"
                          label="Nota"
                          value={peca.nota}
                          onChange={(e: any) => {
                            const updatedFerramentas = [...(editedOrcamento!.ferramentas || [])];
                            updatedFerramentas[ferramentaIndex].pecas![pecaIndex].nota = e.target.value;
                            setEditedOrcamento({
                              ...editedOrcamento!,
                              ferramentas: updatedFerramentas
                            });
                          }}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <CustomSelect
                            title="Material"
                            value={peca.material_id}
                            onChange={(value) => {
                              const updatedFerramentas = [...(editedOrcamento!.ferramentas || [])];
                              updatedFerramentas[ferramentaIndex].pecas![pecaIndex].material_id = value;
                              setEditedOrcamento({
                                ...editedOrcamento!,
                                ferramentas: updatedFerramentas
                              });
                            }}
                            fetchOptions={fetchMateriais}
                          />
                          <Input
                            type="number"
                            label="Peso (kg)"
                            value={peca.peso}
                            onChange={(e: any) => {
                              const updatedFerramentas = [...(editedOrcamento!.ferramentas || [])];
                              updatedFerramentas[ferramentaIndex].pecas![pecaIndex].peso = parseFloat(e.target.value);
                              setEditedOrcamento({
                                ...editedOrcamento!,
                                ferramentas: updatedFerramentas
                              });
                            }}
                          />
                        </div>

                        {/* Operações Section */}
                        {peca.operacoes?.map((operacao, operacaoIndex) => (
                          <div
                            key={operacaoIndex}
                            className="bg-gray-100 rounded-lg p-3 space-y-3"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <CustomSelect
                                title="Operação"
                                value={operacao.operacao_id}
                                onChange={(value) => {
                                  const updatedFerramentas = [...(editedOrcamento!.ferramentas || [])];
                                  updatedFerramentas[ferramentaIndex].pecas![pecaIndex].operacoes![operacaoIndex].operacao_id = value;
                                  setEditedOrcamento({
                                    ...editedOrcamento!,
                                    ferramentas: updatedFerramentas
                                  });
                                }}
                                fetchOptions={fetchOperacoes}
                              />
                              <Input
                                type="number"
                                label="Horas"
                                value={operacao.horas}
                                onChange={(e: any) => {
                                  const updatedFerramentas = [...(editedOrcamento!.ferramentas || [])];
                                  updatedFerramentas[ferramentaIndex].pecas![pecaIndex].operacoes![operacaoIndex].horas = parseFloat(e.target.value);
                                  setEditedOrcamento({
                                    ...editedOrcamento!,
                                    ferramentas: updatedFerramentas
                                  });
                                }}
                              />
                            </div>
                            <div className="flex justify-between items-center">
                              <Button
                                handleFunction={() => removeEditRecurso(ferramentaIndex, pecaIndex, operacaoIndex)}
                                className="bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-md text-sm transition-colors"
                                label="Remover Operação"
                              />
                              <Button
                                handleFunction={() => addEditRecurso(ferramentaIndex, pecaIndex)}
                                className="bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded-md text-sm transition-colors"
                                label="Adicionar Operação"
                              />
                            </div>
                          </div>
                        ))}

                        <Button
                          handleFunction={() => addEditRecurso(ferramentaIndex, pecaIndex)}
                          className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-md transition-colors"
                          label="Adicionar Nova Operação"
                        />
                      </div>
                    ))}

                    <Button
                      handleFunction={() => addEditPeca(ferramentaIndex)}
                      className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-md transition-colors"
                      label="Adicionar Nova Peça"
                    />
                  </div>
                ))}

                <Button
                  handleFunction={addEditFerramenta}
                  className="w-full bg-green-50 text-green-600 hover:bg-green-100 py-3 rounded-lg font-semibold transition-colors"
                  label="Adicionar Nova Ferramenta"
                />
              </div>
            ) : (
              <div className="ml-8 space-y-4">
                {/* Informações básicas do orçamento */}
                <div className="flex justify-end">
                  <Button
                    handleFunction={handleExportPDF}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
                    label="Gerar PDF"
                  />
                </div>
                <div className="ml-3" id="orcamento-visualizacao">
                  <p><strong>Nome:</strong> {selectedOrcamento.nome}</p>
                  <p><strong>Empresa:</strong> {selectedOrcamento.cliente_nome || 'N/A'}</p>
                  <p><strong>Contato:</strong> {selectedOrcamento.contato || 'N/A'}</p>
                  <p><strong>Data de Criação:</strong> {selectedOrcamento.created_at ? new Date(selectedOrcamento.created_at).toLocaleDateString() : 'N/A'}</p>

                  {/* Ferramentas */}
                  {selectedOrcamento.ferramentas && (
                    <div>
                      <h4 className="font-bold mt-4">Ferramentas</h4>
                      {selectedOrcamento.ferramentas.map((ferramenta, index) => (
                        <div key={index} className="ml-4 mt-4 bg-gray-100 p-2 rounded mb-2">
                          <p><strong>Nome:</strong> {ferramenta.nome}</p>
                          <p><strong>Quantidade:</strong> {ferramenta.quantidade}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Peças */}
                  {selectedOrcamento.pecas && selectedOrcamento.pecas.length > 0 && (
                    <div>
                      <h4 className="font-bold mt-4">Peças</h4>
                      {selectedOrcamento.pecas.map((peca, index) => (
                        <div key={index} className="ml-4 mt-4 bg-gray-100 p-2 rounded mb-2">
                          <p><strong>Nome:</strong> {peca.nome}</p>
                          <p><strong>Quantidade:</strong> {peca.quantidade}</p>
                          <p><strong>Material:</strong> {peca.material_nome || 'N/A'}</p>
                          <p><strong>Peso:</strong> {peca.peso ? `${peca.peso} kg` : 'N/A'}</p>
                          <p><strong>Nota:</strong> {peca.nota || 'Sem nota'}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Operações */}
                  {selectedOrcamento.operacoes && selectedOrcamento.operacoes.length > 0 && (
                    <div>
                      <h4 className="font-bold mt-4">Operações</h4>
                      {selectedOrcamento.operacoes.map((operacao, index) => (
                        <div key={index} className="ml-4 mt-4 bg-gray-100 p-2 rounded mb-2">
                          <p><strong>ID Operação:</strong> {operacao.operacao_id}</p>
                          <p><strong>Nome Operação:</strong> {operacao.nome || 'N/A'}</p>
                          <p><strong>Horas:</strong> {operacao.horas}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal>
        )}

      </div>
    </div>
  )
}
