import { useState, useEffect } from 'react';
import AccountTable from './components/AccountTable';
import api from './services/api';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(300);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await api.getAccounts();
      setAccounts(data);
      setLastUpdateTime(new Date());
      setNextUpdate(300);
    } catch (error) {
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNextUpdate(prev => {
        if (prev <= 1) {
          fetchAccounts();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading && !accounts.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Hesap Takip Sistemi
            </h1>
            <div className="flex items-center space-x-4">
              {lastUpdateTime && (
                <div className="text-sm text-gray-600">
                  Son Güncelleme: {lastUpdateTime.toLocaleTimeString()}
                </div>
              )}
              <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                <span className="text-blue-800">Sonraki Güncelleme:</span>
                <span className="font-mono text-blue-900">{formatTime(nextUpdate)}</span>
              </div>
              <button
                onClick={fetchAccounts}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Yenile
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : (
          <AccountTable accounts={accounts} />
        )}
      </main>
    </div>
  );
}

export default App;