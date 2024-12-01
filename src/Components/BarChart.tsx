import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { ChangeEvent, useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';


// props do series do chart
type ChartSeriesProps = {
    operacao: string,
    total_horas: number
}

type Month = {
  value: string,
  label: string
}

const BarChart = () => {

  const [maquinaData, setMaquinaData] = useState<ChartSeriesProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // estado para mes selecionado
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  // dados dos meses para o Selection
  const months: Month[] = [
    {value: '01', label: 'Janeiro'},
    {value: '02', label: 'Fevereiro'},
    {value: '03', label: 'Março'},
    {value: '04', label: 'Abril'},
    {value: '05', label: 'Maio'},
    {value: '06', label: 'Junho'},
    {value: '07', label: 'Julho'},
    {value: '08', label: 'Agosto'},
    {value: '09', label: 'Setembro'},
    {value: '10', label: 'Outubro'},
    {value: '11', label: 'Novembro'},
    {value: '12', label: 'Dezembro'}
  ]

  // funcao para pegar o mes atual
  const getCurrentMonth = ()=>{
    const currentDate = new Date()
    return (currentDate.getMonth() + 1).toString().padStart(2, '0')
  }

  const options: ApexOptions = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        columnWidth: '55%',
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: maquinaData.map(maquina => maquina.operacao)
    },
    yaxis: {
    },
    fill: {
      opacity: 1
    },
    tooltip: {
        followCursor: true,
        y: {
          formatter: function (val) {
            return `${val} horas`
          }
        }
    }
  };

  const series = [
    {
      name: 'Horas Utilizadas',
      data: maquinaData.map(maquina => maquina.total_horas)
    }
  ]


  const fetchMaquinaData = async (month: string)=>{
    try{
      setLoading(true)

      const response =  await fetch(`http://localhost:8000/api/dashboard/horas-operacoes?mes=${month}`)

      if(!response.ok){
        throw new Error('Falha na requisição')
      }

      const data: ChartSeriesProps[] = await response.json()

      setMaquinaData(data)
      setLoading(false)
    }catch(e){
      setError(e instanceof Error ? e.message : 'Erro Desconhecido')
      setLoading(false)
    }
  } 

  // useEffect para quando carregar o componente ou o mes mude
  useEffect(()=>{
    const monthFetch = selectedMonth || getCurrentMonth()
    fetchMaquinaData(monthFetch)
  }, [selectedMonth])

  const handleMonthChange = (event: ChangeEvent<HTMLSelectElement>)=>{
    setSelectedMonth(event.target.value)
  }

  if(error){
    return (
      <div>
        <span>Erro ao carregar dados: {error}</span>
      </div>
    )
  }


  return (
    <div className='h-[100%] bg-white'>

      {/* Selection para escolher o mes */}
      <div className='mb-4 flex justify-between'>
        <h1 className='ml-6 mt-4 p-4 text-black text-2xl font-semibold'>Horas de Máquina</h1>
        <select id="month-select" value={selectedMonth} onChange={handleMonthChange} className='m-8 text-sm border rounded p-2'>
          <option value="">Mês Atual</option>
          {months.map((month)=>(
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {/* Caso carregando exibe a div, caso nao exibe o grafico */}
      {loading ? (
        <div className='ml-4 p-2 border rounded flex text-center justify-center items-center'>
          <FaSpinner className='mr-2 animate-spin' />
          Carregando dados...
        </div>
      ) : (
        <div className='h-[100%] bg-white'>
          <Chart
            options={options}
            series={series}
            type='bar'
            height={'100%'}
          >
          </Chart>
        </div>
      )}
    </div>
  )
}

export default BarChart
