import React, { useState } from 'react';
import { login } from '../utils/auth';

interface TestBackendConnectionProps {
  onSuccess?: (token: string, user: any) => void;
}

const TestBackendConnection: React.FC<TestBackendConnectionProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('admin@tecsolutions.com.br');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTestLogin = async () => {
    setLoading(true);
    setResult('');
    setError('');

    try {
      const user = await login({ email, password });
      if (user) {
        const token = localStorage.getItem('token') || 'N/A';
        setResult(`✅ Conexão com backend funcionando!\n\nUsuário: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nToken: ${token.substring(0, 50)}...`);
        if (onSuccess) {
          onSuccess(token, user);
        }
      } else {
        setError(`❌ Erro no login: Credenciais inválidas`);
      }
    } catch (err: any) {
      setError(`❌ Erro de conexão: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAPI = async () => {
    setLoading(true);
    setResult('');
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl.replace('/api', '')}/health`);
      const data = await response.json();
      
      if (data.success) {
        setResult(`✅ Backend está online!\n\nMensagem: ${data.message}\nTimestamp: ${data.timestamp}`);
      } else {
        setError('❌ Backend retornou erro');
      }
    } catch (err: any) {
      setError(`❌ Erro de conexão com backend: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Teste de Conexão Backend</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleTestAPI}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testando...' : 'Testar Health'}
          </button>
          
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testando...' : 'Testar Login'}
          </button>
        </div>
        
        {result && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <pre className="text-sm text-green-800 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <pre className="text-sm text-red-800 whitespace-pre-wrap">{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestBackendConnection;