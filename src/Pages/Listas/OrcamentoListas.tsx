import { FC, useEffect, useState } from "react"
import { Divider } from "../../Components/Divider"
import { Modal } from "../../Components/Layout/Modal"
import CustomSelect from "../../Components/Selection"
import { Input } from "../../Components/Input"


type OrcamentoProps = {
  title: string
}

type Orcamento = {
  id: string;
  nome: string;
  cliente_id: string;
  contato: string;
  cliente_nome?: string;
  data_criacao?: string;
  ferramentas?: {
    id?: string;
    nome: string;
    quantidade: number;
  }[];
  pecas?: {
    id?: string;
    nome: string;
    quantidade: number;
    nota?: string;
    material_id?: string;
    peso?: number;
  }[];
  operacoes?: {
    id?: string;
    operacao_id: string;
    operacao_nome?: string;
    horas: number;
  }[];
}

export const OrcamentoListas: FC<OrcamentoProps> = ({ title }) => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [editedOrcamento, setEditedOrcamento] = useState<Orcamento | null>(null);
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

  useEffect(() => {
    fetchOrcamentos();
    fetchEmpresas();
    fetchContatos();
  }, []);

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
    setEditedOrcamento({ ...selectedOrcamento! });
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedOrcamento(null);
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
        {orcamentos.map((orcamento) => (
          <div key={orcamento.id} className="grid grid-cols-3 h-12 w-full items-center border-b border-gray-200 text-center" onClick={() => handleOpenModal(orcamento)}>
            <div>{orcamento.nome}</div>
            <div>{orcamento.cliente_nome}</div>
            <div>{orcamento.data_criacao ? new Date(orcamento.data_criacao).toLocaleDateString() : 'N/A'}</div>
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
              <div className="space-y-4">
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
            ) : (
              <div className="ml-8 space-y-4">
                {/* Informações básicas do orçamento */}
                <p><strong>Nome:</strong> {selectedOrcamento.nome}</p>
                <p><strong>Empresa:</strong> {selectedOrcamento.cliente_id || 'N/A'}</p>
                <p><strong>Contato:</strong> {selectedOrcamento.contato || 'N/A'}</p>
                <p><strong>Data de Criação:</strong> {selectedOrcamento.data_criacao ? new Date(selectedOrcamento.data_criacao).toLocaleDateString() : 'N/A'}</p>

                {/* Ferramentas */}
                {selectedOrcamento.ferramentas && selectedOrcamento.ferramentas.length > 0 && (
                  <div>
                    <h4 className="font-bold mt-4">Ferramentas</h4>
                    {selectedOrcamento.ferramentas.map((ferramenta, index) => (
                      <div key={index} className="ml-4 bg-gray-100 p-2 rounded mb-2">
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
                      <div key={index} className="ml-4 bg-gray-100 p-2 rounded mb-2">
                        <p><strong>Nome:</strong> {peca.nome}</p>
                        <p><strong>Quantidade:</strong> {peca.quantidade}</p>
                        <p><strong>Material ID:</strong> {peca.material_id || 'N/A'}</p>
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
                      <div key={index} className="ml-4 bg-gray-100 p-2 rounded mb-2">
                        <p><strong>ID Operação:</strong> {operacao.operacao_id}</p>
                        <p><strong>Nome Operação:</strong> {operacao.operacao_nome || 'N/A'}</p>
                        <p><strong>Horas:</strong> {operacao.horas}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Modal>
        )}

      </div>
    </div>
  )
}
