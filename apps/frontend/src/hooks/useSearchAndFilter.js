import { useState, useCallback, useMemo } from 'react';

const useSearchAndFilter = (initialData, searchFields, filterConfig) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleFilter = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      // Search
      const matchesSearch = searchFields.some(field => 
        item[field] && item[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // Skip empty filters
        const filterFn = filterConfig[key];
        return filterFn ? filterFn(item[key], value) : item[key] === value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [initialData, searchTerm, filters, searchFields, filterConfig]);

  return {
    searchTerm,
    filters,
    filteredData,
    handleSearch,
    handleFilter
  };
};

export default useSearchAndFilter;