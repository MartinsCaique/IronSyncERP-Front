import { FC, useEffect, useState } from "react"
import { Divider } from "../../Components/Divider"
import { Modal } from "../../Components/Layout/Modal";
import { Input } from "../../Components/Input";

type MaterialProps = {
    title: string
}

type Material = {
    id?: number;
    nome: string;
    preco: string;
    especificacaoTecnica: string;
    origem: string;
    descricao: string;
};

export const MaterialListas: FC<MaterialProps> = ({ title }) => {
    const [materiais, setMateriais] = useState<Material[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [editedMaterial, setEditedMaterial] = useState<Material | null>(null);

    const handleOpenModal = (material: Material) => {
        setSelectedMaterial(material)
        setEditedMaterial({ ...material })
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setIsEditing(false);
        setSelectedMaterial(null);
        setEditedMaterial(null);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleInputChange = (field: keyof Material) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (editedMaterial) {
            const value = e.target.value;

            // Tratamento especial para o campo de preço
            if (field === "preco") {
                const numericValue = value.replace(/[^\d.,]/g, "");
                setEditedMaterial({
                    ...editedMaterial,
                    [field]: numericValue ? `R$ ${numericValue}` : "",
                });
            } else {
                setEditedMaterial({
                    ...editedMaterial,
                    [field]: value,
                });
            }
        }
    };

    const handleSaveEdit = async () => {
        if (!editedMaterial) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/materiais/${editedMaterial.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...editedMaterial,
                    preco: editedMaterial.preco.replace(/[^\d.-]/g, ""), // Remove "R$" antes de enviar
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar material');
            }

            // Atualiza a lista de materiais
            const updatedMateriais = materiais.map(material =>
                material.id === editedMaterial.id ? editedMaterial : material
            );
            setMateriais(updatedMateriais);

            // Atualiza o material selecionado
            setSelectedMaterial(editedMaterial);

            setIsEditing(false);
            alert('Material atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar material:', error);
            alert('Erro ao atualizar material. Tente novamente.');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedMaterial(selectedMaterial);
    };

    const handleDelete = async () => {
        if (!selectedMaterial || !selectedMaterial.id) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/materiais/${selectedMaterial.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir material');
            }

            // Remove o material da lista
            const updatedMateriais = materiais.filter(
                material => material.id !== selectedMaterial.id
            );
            setMateriais(updatedMateriais);

            setIsOpen(false);
            alert('Material excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir material:', error);
            alert('Erro ao excluir material. Tente novamente.');
        }
    };

    const fetchMateriais = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/materiais/', {
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
                console.error("Resposta da API está vazia.");
                return;
            }

            const data = JSON.parse(text);
            setMateriais(data);
        } catch (error) {
            console.error("Erro ao buscar materiais:", error);
        }
    };

    useEffect(() => {
        fetchMateriais();
    }, []);

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
                <div className='grid grid-cols-4 h-12 w-full mt-6 bg-primary text-white rounded-sm text-center items-center'>
                    <div>
                        <h3>Nome</h3>
                    </div>
                    <div>
                        <h3>Preço</h3>
                    </div>
                    <div>
                        <h3>Especificação</h3>
                    </div>
                    <div>
                        <h3>Origem</h3>
                    </div>
                </div>
                {materiais.map((material, index) => (
                    <div key={index} className='grid grid-cols-4 h-12 w-full items-center border-b border-gray-200 text-center' onClick={() => handleOpenModal(material)}>
                        <div>{material.nome}</div>
                        <div>{material.preco}</div>
                        <div>{material.especificacaoTecnica}</div>
                        <div>{material.origem}</div>
                    </div>
                ))}

                {/* Modal */}
                {isOpen && selectedMaterial && (
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
                                <div className="ml-8">
                                    <div className="mt-8 mb-8">
                                        <h1 className="text-2xl font-bold">Editar Material</h1>
                                    </div>

                                    <div className="flex w-full mt-4">
                                        <div className="w-[80%]">
                                            <Input
                                                type="text"
                                                label="*Nome"
                                                value={editedMaterial?.nome || ""}
                                                onChange={handleInputChange("nome")}
                                            />
                                        </div>

                                        <div className="w-[80%] ml-4">
                                            <Input
                                                type="text"
                                                label="*Preço (por kg)"
                                                value={editedMaterial?.preco || ""}
                                                onChange={handleInputChange("preco")}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex w-full mt-4">
                                        <div className="w-[80%]">
                                            <Input
                                                type="text"
                                                label="Especificação Técnica"
                                                value={editedMaterial?.especificacaoTecnica || ""}
                                                onChange={handleInputChange("especificacaoTecnica")}
                                            />
                                        </div>

                                        <div className="w-[80%] ml-4">
                                            <Input
                                                type="text"
                                                label="Origem (Fornecedor)"
                                                value={editedMaterial?.origem || ""}
                                                onChange={handleInputChange("origem")}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Input
                                            type="text"
                                            label="Descrição"
                                            value={editedMaterial?.descricao || ""}
                                            onChange={handleInputChange("descricao")}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='ml-8'>
                                {/* Material Title */}
                                <div>
                                    <h1 className="text-3xl font-medium capitalize">Material</h1>
                                </div>

                                {/* Nome e Preço/kg */}
                                <div className="flex mt-10">
                                    {/* Nome */}
                                    <div>
                                        <p className="text-base font-medium text-gray-400/95">Nome</p>
                                        <p className='text-base font-medium'>{selectedMaterial.nome}</p>
                                    </div>

                                    {/* Preço/kg */}
                                    <div className="ml-10">
                                        <p className="text-base font-medium text-gray-400/95">Preço/kg</p>
                                        <p className='text-base font-medium'>R${selectedMaterial.preco}/kg</p>
                                    </div>
                                </div>

                                {/* Origem e Especificação Técnica */}
                                <div className="flex mt-10">
                                    <div>
                                        <p className="text-base font-medium text-gray-400/95">Origem</p>
                                        <p className='text-base font-medium'>{selectedMaterial.origem}</p>
                                    </div>
                                    <div className="ml-10">
                                        <p className="text-base font-medium text-gray-400/95">Especificação Técnica</p>
                                        <p className='text-base font-medium'>{selectedMaterial.especificacaoTecnica}</p>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div className="mt-10">
                                    <p className="text-base font-medium text-gray-400/95">Descrição</p>
                                    <p className='text-base font-medium'>{selectedMaterial.descricao}</p>
                                </div>
                            </div>
                        )}
                    </Modal>
                )}
                <div>

                </div>
            </div>
        </div>
    )
}
