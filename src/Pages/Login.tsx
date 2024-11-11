import { ChangeEvent, FormEvent, useState } from 'react'
import { Input } from '../Components/Input'
import { MdEmail } from 'react-icons/md'
import { CiLock } from 'react-icons/ci'
import { Button } from '../Components/Button'
import imageLogin from '../Assets/login/imageLogin.jpg'

export const Login = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Função para mandar api
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage('')

        try {

            // await getCsrfToken()

            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha })
            })

            const data = await response.json()
            console.log(data); 

            if (response.ok) {
                localStorage.setItem('token', data.token)
            } else {
                setErrorMessage(data.message || 'Erro ao realizar login. Verifique suas credenciais.')
            }
        } catch (error) {
            setErrorMessage('Erro de conexão com o servidor. Tente novamente mais tarde.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='h-[100vh] flex items-center'>
            <div className="container">
                <div className='flex justify-center items-center'>
                    <div className='w-[900px] h-[500px] bg-white rounded-md flex shadow-md'>
                        <div className='w-1/2 flex flex-col p-10'>
                            {/* Texto Login  */}
                            <div>
                                <h2 className='text-center text-2xl font-semibold capitalize mb-4'>Login</h2>
                            </div>

                            {/* Input email */}
                            <div>
                                <p className='text-sm ml-1 mb-2 font-medium'>Endereço de email</p>
                                <div>
                                    <Input
                                        value={email}
                                        type='email'
                                        placeholder='Coloque seu email'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        icon={<MdEmail />}
                                    />
                                </div>
                            </div>

                            {/* Input Senha */}
                            <div className='mt-2'>
                                <p className='text-sm ml-1 mb-2 font-medium'>Senha</p>
                                <div>
                                    <Input
                                        value={senha}
                                        type='password'
                                        placeholder='Coloque sua senha'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                                        icon={<CiLock />}
                                    />
                                </div>
                            </div>

                            {/* Botão de login */}
                            <div className='flex flex-col justify-center items-center mt-12'>
                                <Button
                                    bgColor='bg-secondary'
                                    label={isLoading ? 'Carregando...' : 'Login'}
                                    textColor='text-white'
                                    size='text-lg'
                                    handleFunction={handleLogin}
                                />
                                <p className='mt-2 text-sm text-gray-400 font-medium'>Você já possui conta? <a className='text-blue-700 underline' href="#">Login</a></p>
                            </div>

                            {/* Mensagem de erro */}
                            {errorMessage && <p className='text-red-500 mt-4'>{errorMessage}</p>}
                        </div>

                        {/* Imagem da direita de login */}
                        <div className='w-1/2'>
                            <img src={imageLogin} alt="Imagem decorativa" className='w-full h-full object-cover' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
