import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Input } from '../Components/Input';
import { MdEmail } from 'react-icons/md';
import { CiLock } from 'react-icons/ci';
import { Button } from '../Components/Button';
import imageLogin from '../Assets/login/imageLogin.jpg';

// Interface para o payload de login
interface LoginPayload {
    email: string;
    password: string;
}

// Interface para a resposta da API
interface ApiResponse {
    token?: string;
    message?: string;
}

export const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Função para verificar se já existe um token no localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            alert('Já existe um token');
        }
    }, []);

    // Função para realizar o login
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        // Construir o payload do login
        const payload: LoginPayload = { email, password };

        try {
            const response = await fetch('http://localhost:8000/api/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data: ApiResponse = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                setErrorMessage('Login bem-sucedido');
            } else {
                setErrorMessage(data.message || 'Erro ao realizar login. Verifique suas credenciais.');
            }
        } catch (error) {
            setErrorMessage('Erro de conexão com o servidor. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='h-[100vh] flex items-center'>
            <div className="container">
                <div className='flex justify-center items-center'>
                    <div className='w-[900px] h-[500px] bg-white rounded-md flex shadow-md'>
                        <div className='w-1/2 flex flex-col p-10'>
                            {/* Texto Login */}
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

                            {/* Input password */}
                            <div className='mt-2'>
                                <p className='text-sm ml-1 mb-2 font-medium'>Senha</p>
                                <div>
                                    <Input
                                        value={password}
                                        type='password'
                                        placeholder='Coloque sua senha'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
    );
};