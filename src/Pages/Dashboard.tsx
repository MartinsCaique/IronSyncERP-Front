import { FC } from 'react'
import { SideBar } from '../Components/Layout/SideBar';
import { Link } from 'react-router-dom';

import { IoPersonAddSharp } from 'react-icons/io5';
import { BsBoxSeamFill, BsFillFileEarmarkSpreadsheetFill } from 'react-icons/bs';
import { FaHammer } from 'react-icons/fa';
import { FaRegClock } from "react-icons/fa6";

import Chart from 'react-apexcharts'
import BarChart from '../Components/BarChart';

type DashboardProps = {
    path: string;
}

type DadosProps = {
    dados: number;
}


export const Dashboard: FC<DashboardProps & DadosProps> = ({ path, dados }) => {

    const pathParts = path
        .split('/')
        .filter(part => part !== '');

    return (
        <div className='flex'>
            {/* witdh = 267px 16.6rem /> */}

            <div className="flex min-h-screen w-full">
                <SideBar />
                <div className="flex-1">
                    <div className='min-w-full'>
                        <div className='my-4 mx-8'>
                            <div className="py-4 px-8 flex justify-between bg-white">
                                <div>
                                    <div className="flex items-center gap-2">
                                        {pathParts.map((part, index) => (
                                            <div key={index} className="flex items-center">
                                                {/* Cada parte do path */}
                                                <span
                                                    className={`
                      ${index === pathParts.length - 1
                                                            ? 'text-[#005EB6] font-bold'
                                                            : 'text-black/60'
                                                        }
                      capitalize
                    `}
                                                >
                                                    {part}
                                                </span>

                                                {/* Adiciona a seta se não for o último item */}
                                                {index < pathParts.length - 1 && (
                                                    <span className="text-black/60 mx-2">
                                                        {'>'}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex'>
                                    <p className='font-bold'>Admin</p>
                                </div>
                            </div>
                        </div>

                        <div className=' bg-white py-5'>
                            {/* Title */}
                            <h3 className='text-black text-3xl font-semibold ml-20 '>Acesso Rápido</h3>

                            <div className='flex mx-24 text-lg justify-around'>
                                <Link to={"/Cadastro/cliente"} className='mt-6 border flex items-center bg-primary py-2 px-4 text-white transition-all hover:bg-white hover:border hover:border-primary hover:text-primary'>
                                    <IoPersonAddSharp className='mr-4' />
                                    Novo Cliente
                                </Link>
                                <Link to={"/Cadastro/material"} className='mt-6 border flex items-center bg-primary py-2 px-4 text-white transition-all hover:bg-white hover:border hover:border-primary hover:text-primary'>
                                    <BsBoxSeamFill className='mr-4' />
                                    Novo Material
                                </Link>
                                <Link to={"/Cadastro/recurso"} className='mt-6 border flex items-center bg-primary py-2 px-4 text-white transition-all hover:bg-white hover:border hover:border-primary hover:text-primary'>
                                    <FaHammer className='mr-4' />
                                    Novo Recurso
                                </Link>
                                <Link to={"/Cadastro/orcamento"} className='mt-6 border flex items-center bg-primary py-2 px-4 text-white transition-all hover:bg-white hover:border hover:border-primary hover:text-primary'>
                                    <BsFillFileEarmarkSpreadsheetFill className='mr-4' />
                                    Novo Orcamento
                                </Link>
                            </div>
                        </div>


                        <div className='grid grid-cols-2 justify-around'>
                            <div className='bg-white m-4 grid grid-cols-2'>
                                <div className='border-r'>
                                    <div className='p-10 w-[100%] h-[50%] border-b'>
                                        <div className='flex'>
                                            <IoPersonAddSharp className='mr-4' />
                                            <h1 className='mb-6'>Quantidade de Clientes</h1>
                                        </div>
                                        <p className=''>{dados}</p>
                                    </div>
                                    <div className='p-10 w-[100%]  h-[50%]'>
                                        <h1 className='mb-6'>Quantidade de Materiais</h1>
                                        <p>{dados}</p>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='p-10 w-[100%]  h-[50%] border-b'>
                                        <h1 className='mb-6'>Quantidade de Recursos</h1>
                                        <p>{dados}</p>
                                    </div>
                                    <div className='p-10 w-[100%]  h-[50%]'>
                                        <h1 className='mb-6'>Quantidade de Orçamentos</h1>
                                        <p>{dados}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='m-4 bg-white justify-center'>
                                    <h1 className='ml-2 p-4  text-black text-xl font-semibold'>Horas de Máquina</h1>
                                    <BarChart></BarChart>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
