import { useState, useEffect } from 'react';
import { getWarnings } from '../services/api';
import { mockWarnings } from '../mock/data';

export const useWarnings = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        setLoading(true);
        const response = await getWarnings();
        setWarnings(response.data);
        setLoading(false);
      } catch (err) {
        console.warn('⚠️ API not reachable, using mock data');
        setWarnings(mockWarnings);
        setLoading(false);
        setError(null);
      }
    };

    fetchWarnings();
  }, []);

  return { warnings, loading, error };
};

export default useWarnings;