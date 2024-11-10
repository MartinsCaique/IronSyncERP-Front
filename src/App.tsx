import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./Pages/Login"

function App() {

  return (
    <div className="bg-[##edf5ff]">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
