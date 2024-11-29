import { FC, useEffect, useState } from 'react';
import { Divider } from '../../Components/Divider';
import { Modal } from '../../Components/Layout/Modal';
import { Input } from '../../Components/Input';


type RecursoProps = {
    title: string;
};


type Recurso = {
    id?: number;
    operacao: string;
    preco: string;
    descricao: string;
};

export const RecursoListas: FC<RecursoProps> = ({ title }) => {
    const [recursos, setRecursos] = useState<Recurso[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);
    const [editFormData, setEditFormData] = useState<Recurso | null>(null);

    const handleOpenModal = (recurso: Recurso) => {
        setSelectedRecurso(recurso);
        setEditFormData({ ...recurso });  // Carregar dados do recurso para edição
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setIsEditing(false);
        setSelectedRecurso(null);
        setEditFormData(null);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (!editFormData) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/operacoes/${editFormData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...editFormData,
                    preco: editFormData.preco.replace(/[^\d.-]/g, ""), // Remove "R$" antes de enviar
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar recurso');
            }

            // Atualiza a lista de recursos
            const updatedRecurso = recursos.map(recursos =>
                recursos.id === editFormData.id ? editFormData : recursos
            );
            setRecursos(updatedRecurso);

            // Atualiza o recurso selecionado
            setSelectedRecurso(editFormData);

            setIsEditing(false);
            alert('Recurso atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar recurso:', error);
            alert('Erro ao atualizar recurso. Tente novamente.');
        }
    };

    const handleCancelEdit = () => {
        setEditFormData({ ...selectedRecurso! });
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!selectedRecurso || !selectedRecurso.id) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/operacoes/${selectedRecurso.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir material');
            }

            // Remove o material da lista
            const updatedRecursos = recursos.filter(
                recursos => recursos.id !== selectedRecurso.id
            );
            setRecursos(updatedRecursos);

            setIsOpen(false);
            alert('Material excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir material:', error);
            alert('Erro ao excluir material. Tente novamente.');
        }
    };

    const fetchRecursos = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/operacoes/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const text = await response.text();
            if (!text) {
                console.error('Resposta da API está vazia.');
                return;
            }

            const data = JSON.parse(text);
            setRecursos(data);
        } catch (error) {
            console.error('Erro ao buscar recursos:', error);
        }
    };

    useEffect(() => {
        fetchRecursos();
    }, []);

    const handleInputChange = (field: keyof Recurso) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editFormData) {
            const newEditFormData = { ...editFormData, [field]: e.target.value };
            setEditFormData(newEditFormData);
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
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed eveniet quisquam voluptatem corrupti
                        modi dolorum quo asperiores incidunt, doloribus dolores? Non obcaecati, quaerat molestias sed vitae
                        perferendis nihil consequuntur esse?
                    </p>
                </div>
                <Divider />

                <div className="grid grid-cols-2 h-12 w-full mt-6 bg-primary text-white rounded-sm text-center items-center">
                    <div>
                        <h3>Operação</h3>
                    </div>
                    <div>
                        <h3>Preço/hora</h3>
                    </div>
                </div>
                {recursos.map((recurso, index) => (
                    <div key={index} className="grid grid-cols-2 h-12 w-full items-center border-b border-gray-200 text-center" onClick={() => handleOpenModal(recurso)}>
                        <div>{recurso.operacao}</div>
                        <div>R${recurso.preco}</div>
                    </div>
                ))}

                {/* Modal */}
                {isOpen && selectedRecurso && (
                    <Modal
                        onClose={handleCloseModal}
                        onEdit={handleEdit}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onDelete={handleDelete}
                        isEditing={isEditing}
                    >
                        {isEditing ? (
                            <div>
                                <div>
                                    {/* Texto */}
                                    <div className="mt-8 mb-8">
                                        <h1 className="text-2xl font-bold">Editar Recurso</h1>
                                    </div>

                                    <div className="flex w-full mt-4">
                                        {/* Operação */}
                                        <div className="w-[80%]">
                                            <Input
                                                type="text"
                                                label="*Operação"
                                                value={editFormData?.operacao || ""}
                                                onChange={handleInputChange('operacao')}
                                            />
                                        </div>

                                        {/* Preço/Hora */}
                                        <div className="w-[80%] ml-4">
                                            <Input
                                                type="text"
                                                label="*Preço/Hora"
                                                value={editFormData?.preco || ""}
                                                onChange={handleInputChange('preco')}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        {/* Descrição */}
                                        <Input
                                            type="text"
                                            label="Descrição"
                                            value={editFormData?.descricao || ""}
                                            onChange={handleInputChange('descricao')}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='ml-8'>
                                {/* Material Title */}
                                <div>
                                    <h1 className="text-3xl font-medium capitalize">Recursos</h1>
                                </div>

                                {/* Operação e Preço/Hora */}
                                <div className='flex mt-10'>
                                    <div>
                                        <p className="text-base font-medium text-gray-400/95">Operação</p>
                                        <p className='text-base font-medium'>{selectedRecurso.operacao}</p>
                                    </div>
                                    <div className='ml-10'>
                                        <p className="text-base font-medium text-gray-400/95">Preço/Hora</p>
                                        <p className='text-base font-medium'>R${selectedRecurso.preco}/h</p>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div className='mt-10'>
                                    <p className="text-base font-medium text-gray-400/95">Descrição</p>
                                    <p className='text-base font-medium'>{selectedRecurso.descricao}</p>
                                </div>
                            </div>
                        )}
                    </Modal>
                )}
            </div>
        </div>
    );
};
