import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./Pages/Login"
import Cadastro from "./Components/Layout/Cadastro"
import { ClienteCadastro } from "./Pages/Cadastro/ClienteCadastro"
import { MaterialCadastro } from "./Pages/Cadastro/MaterialCadastro"
import { OrcamentoCadastro } from "./Pages/Cadastro/OrcamentoCadastro"
import { RecursoCadastro } from "./Pages/Cadastro/RecursoCadastro"
import { Dashboard } from "./Pages/Dashboard"
import Listas from "./Components/Layout/Listas"
import { ClienteListas } from "./Pages/Listas/ClienteListas"
import { MaterialListas } from "./Pages/Listas/MaterialListas"
import { RecursoListas } from "./Pages/Listas/RecursoListas"
import { OrcamentoListas } from "./Pages/Listas/OrcamentoListas"

function App() {

  return (
    <div className="bg-[##edf5ff]">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/' element={<Dashboard path='Bem-vindo de volta/Usuario' />} />

          {/* Rotas Cadastro */}
          <Route path='/cadastro' element={<Cadastro path='cadastros' />} >
            <Route path='cliente' element={<ClienteCadastro title='Novo Cliente' />} />
            <Route path='material' element={<MaterialCadastro title='Novo Material' />} />
            <Route path='recurso' element={<RecursoCadastro title='Novo Recurso' />} />
            <Route path='orcamento' element={<OrcamentoCadastro title='Novo Orçamento' />} />
          </Route>

          {/* Rotas Listas */}
          <Route path='/listas' element={<Listas path='listas' />} >
            <Route path='cliente' element={<ClienteListas title='Lista Cliente' />} />
            <Route path='material' element={<MaterialListas title='Lista Material' />} />
            <Route path='recurso' element={<RecursoListas title='Lista Recurso' />} />
            <Route path='orcamento' element={<OrcamentoListas title='Lista Orçamento' />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
