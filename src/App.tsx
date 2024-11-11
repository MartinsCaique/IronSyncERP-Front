import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./Pages/Login"
import Cadastro from "./Components/Layout/Cadastro"
import { Cliente } from "./Pages/Cliente"
import { Material } from "./Pages/Material"
import { Orcamento } from "./Pages/Orcamento"
import { Recurso } from "./Pages/Recurso"
import { Dashboard } from "./Pages/Dashboard"

function App() {

  return (
    <div className="bg-[##edf5ff]">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/' element={<Dashboard path='Bem-vindo de volta/Usuario' />} />

          {/* Rotas Cadastro */}
          <Route path='/cadastro' element={<Cadastro path='cadastros' />} >
            <Route path='cliente' element={<Cliente title='Novo Cliente' />} />
            <Route path='material' element={<Material title='Novo Material' />} />
            <Route path='recurso' element={<Recurso title='Novo Recurso' />} />
            <Route path='orcamento' element={<Orcamento title='Novo Orçamento' />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
