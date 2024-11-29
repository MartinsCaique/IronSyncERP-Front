import { FC, ReactNode } from 'react'
import { Button } from '../Button';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
    children: ReactNode;
    onClose: any;
    onEdit?: () => void;
    onSaveEdit?: () => void;
    onCancelEdit?: () => void;
    onDelete?: () => void;
    isEditing: boolean;
}

export const Modal: FC<ModalProps> = ({ children, onClose, onEdit, onSaveEdit, onCancelEdit, onDelete, isEditing }) => {
    return (
        <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
            <div className='bg-white w-full max-w-4xl md:h-[594px] p-6 flex flex-col'>
                {/* Botão de Fechar */}
                <div className="flex justify-between items-center">
                    {/* Botão de Cancelar Edição (Superior Esquerdo) */}
                    {isEditing && onCancelEdit ? (
                        <Button 
                        handleFunction={onCancelEdit}
                        className="text-gray-600 hover:text-primary/95 transition-all font-semibold"
                        label='Cancelar Edição'
                        />
                    ) : (
                        <div /> // Placeholder para manter o alinhamento
                    )}

                    {/* Botão de Fechar (Superior Direito) */}
                    <Button 
                    handleFunction={onClose}
                    className='text-gray-600 hover:text-gray-900'
                    icon={<IoMdClose size={25} />}
                    />
                </div>

                {/* Conteúdo Modal */}
                <div className='flex-grow mb-12 md:overflow-y-auto md:max-h-[31.25em]'>
                    {children}
                </div>

                {/* Botões de editar e excluir */}
                <div className='w-full grid grid-cols-2'>
                    {!isEditing && onEdit && (
                        <>
                            {/* Botão editar */}
                            <div className='w-1/2 flex justify-start items-center ml-10'>
                                <Button
                                    handleFunction={onEdit}
                                    label='Editar'
                                    className='w-28 h-10 bg-primary text-base font-semibold text-white rounded-lg hover:bg-white hover:border-2 hover:border-primary hover:text-primary uppercase transition-all'
                                />
                            </div>

                            {/* Botão excluir */}
                            {onDelete && (
                                <div className='w-full flex justify-end items-center pr-10'>
                                    <Button
                                        handleFunction={onDelete}
                                        label='Remover'
                                        className='w-28 h-10 bg-white text-base font-semibold text-red-700 border-2 border-red-700 hover:bg-red-700 hover:text-white transition-all rounded-lg uppercase'
                                    />
                                </div>
                            )}
                        </>
                    )}
                    {isEditing && onSaveEdit && (
                        <div>
                            <Button
                                label='Concluir Edição'
                                handleFunction={onSaveEdit}
                                className='bg-primary w-1/2 h-10 text-sm font-semibold text-white rounded-lg hover:bg-white hover:border-2 hover:border-primary hover:text-primary hover: transition-all uppercase'
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}