import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { demoMeets } from '@/data/demoMeets';

const AppContext = createContext(null);

const initialFilters = { category: 'ALL', familyFriendly: false, weekend: false, featuredOnly: false };

const normalizeMeet = (meet, index) => ({
  ...meet,
  meet_id: meet.meet_id || meet.id || meet.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `meet-${index}`,
});

export function AppProvider({ children }) {
  const [meets, setMeets] = useState(demoMeets);
  const [loading, setLoading] = useState(true);
  const [selectedMeetId, setSelectedMeetId] = useState(demoMeets[0].meet_id);
  const [hoveredMeetId, setHoveredMeetId] = useState(null);
  const [simpleView, setSimpleView] = useState(() => localStorage.getItem('cm_simple_view') === '1');
  const [filters, setFilters] = useState(initialFilters);

  const fetchMeets = useCallback(async () => {
    const base = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001').replace(/\/$/, '');
    try {
      const response = await fetch(`${base}/api/meets`);
      if (!response.ok) throw new Error('Could not load meets');
      const data = await response.json();
      if (Array.isArray(data) && data.length) setMeets(data.map(normalizeMeet));
    } catch (error) {
      // The catalogue remains usable when the local API has not been started yet.
      console.info('Using the included demo meet catalogue.', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMeets(); }, [fetchMeets]);
  useEffect(() => { localStorage.setItem('cm_simple_view', simpleView ? '1' : '0'); }, [simpleView]);

  const visibleMeets = useMemo(() => meets.filter(meet => {
    const rawCategory = (meet.category || '').toLowerCase();
    const categoryMatch = filters.category === 'ALL' || rawCategory.includes(filters.category.toLowerCase().replace(' & ', '')) || rawCategory.includes(filters.category.toLowerCase());
    const date = new Date(meet.date);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return categoryMatch && (!filters.familyFriendly || meet.family_friendly) && (!filters.featuredOnly || meet.featured) && (!filters.weekend || isWeekend);
  }), [meets, filters]);
  const featured = useMemo(() => visibleMeets.filter(meet => meet.featured), [visibleMeets]);
  const value = { meets: visibleMeets, allMeets: meets, featured, loading, selectedMeetId, setSelectedMeetId, hoveredMeetId, setHoveredMeetId, simpleView, setSimpleView, filters, setFilters, clearFilters: () => setFilters(initialFilters), refetch: fetchMeets };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside an AppProvider');
  return context;
}
