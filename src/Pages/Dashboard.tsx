import { FC, useEffect, useState } from 'react'
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

type FetchDashboardData = {
    category: string;
    count: number
}

// banco de icones das categorias
const categoryIcons: {[key: string]: JSX.Element} = {
    "Clientes": <IoPersonAddSharp className='mr-4 text-5xl p-2 text-primary' />,
    "Materiais": <BsBoxSeamFill className='mr-4 text-5xl p-2 text-primary' />,
    "Operacoes": <FaHammer className='mr-4 text-5xl p-2 text-primary' />,
    "Orcamentos": <BsFillFileEarmarkSpreadsheetFill className='mr-4 text-5xl p-2 text-primary' />
}

const categoryNames: {[key: string]: string} = {
    Clientes: "Clientes",
    Materiais: "Materiais",
    Operacoes: "Recursos",
    Orcamentos: "Orçamentos" 
}


export const Dashboard: FC<DashboardProps> = ({ path }) => {

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState<FetchDashboardData[]>([])

    // fetch para data do count das categorias que aparecem no dashboard
    useEffect(()=>{
        const fetchDashboardData = async ()=>{
            try{
                setLoading(true)
                const response = await fetch('http://localhost:8000/api/dashboard/counts')
    
                if(!response){
                    throw new Error('Falha na requisicao (Dashboard Data)')
                }

                
    
                const data: FetchDashboardData[] = await response.json()

                const transformedData = Object.entries(data).map(([key, value]) => ({
                    category: key.charAt(0).toUpperCase() + key.slice(1),
                    count: value as number
                }));

                console.log(transformedData)
                setDashboardData(transformedData)
                setLoading(false)
            }catch(e){
                setError(e instanceof Error ? e.message : 'Erro desconhecido (Dashboard Data)')
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    const pathParts = path
        .split('/')
        .filter(part => part !== '');

    if(error){
        return <div>Erro ao carregar dados: {error}</div>;
    }

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

                        <div className='justify-around'>
                            {loading ? (
                                <div className='m-4 p-2 border rounded bg-primary text-center text-white'>Carregando dados...</div>
                            ) : (
                                <div className='m-4 flex justify-around h-[15vh]'>

                                    {dashboardData.map((item, index)=>(
                                        <div key={index} className='bg-white w-[24.5%]'>
                                            <div className='m-2 p-4 pl-8 border h-[90%]'>
                                                <h1 className='mb-6 text-black/50'>{categoryNames[item.category]} Cadastrados</h1>
                                                <div className='flex items-center'>
                                                    {categoryIcons[item.category] || <div className="text-black/50">Ícone indisponível</div>}
                                                    <p className='text-4xl font-bold'>{item.count}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {/* <div className=' bg-white w-[24.5%]'>
                                        <div className='m-2 p-4 pl-8 border h-[90%]'>
                                            <h1 className='mb-6 text-black/50'>Clientes Cadastrados</h1>
                                            <div className='flex items-center'>
                                                <IoPersonAddSharp className='mr-4 text-5xl p-2 text-primary' />
                                                <p className='text-4xl font-bold'>{dashboardData[0]?.count}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=' bg-white w-[24.5%]'>
                                        <div className='m-2 p-4 pl-8 border h-[90%]'>
                                            <h1 className='mb-6 text-black/50'>Materiais Cadastrados</h1>
                                            <div className='flex items-center'>
                                                <BsBoxSeamFill className='mr-4 text-5xl p-2 text-primary' />
                                                <p className='text-4xl font-bold'>{dashboardData[1]?.count}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=' bg-white w-[24.5%]'>
                                        <div className='m-2 p-4 pl-8 border h-[90%]'>
                                            <h1 className='mb-6 text-black/50'>Recursos Cadastrados</h1>
                                            <div className='flex items-center'>
                                                <FaHammer className='mr-4 text-5xl p-2 text-primary' />
                                                <p className='text-4xl font-bold'>{dashboardData[2]?.category}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=' bg-white w-[24.5%]'>
                                        <div className='m-2 p-4 pl-8 border h-[90%]'>
                                            <h1 className='mb-6 text-black/50'>Orçamentos Cadastrados</h1>
                                            <div className='flex items-center'>
                                                <BsFillFileEarmarkSpreadsheetFill className='mr-4 text-5xl p-2 text-primary' />
                                                <p className='text-4xl font-bold'>{dashboardData[3]?.count}</p>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            )}
                            <div className='h-[45vh] bg-white m-4'>
                                <BarChart></BarChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
