import { useState, useEffect } from 'react';

interface Entry {
  id: number;
  title: string;
  content: string;
  tags: string;
  created_at: string;
}

export const useEntries = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/entries/');
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      const data = await response.json();
      setEntries(data);
      setFilteredEntries(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const resetEntries = () => {
    setFilteredEntries(entries);
  };

  return {
    entries,
    setEntries,
    filteredEntries,
    setFilteredEntries,
    resetEntries,
    loading,
    error,
    setError
  };
}; 