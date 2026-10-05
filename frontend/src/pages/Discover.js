import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MeetMap from '@/components/MeetMap';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

const date = v => new Intl.DateTimeFormat('en-IE', { weekday: 'short', day: '2-digit', month: 'short' }).format(new Date(v));
const time = v => new Intl.DateTimeFormat('en-IE', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(v));
const label = meet => (meet.category || 'Meet').replace('CarsCoffee', 'Cars & Coffee');

const categoryOptions = ['ALL', 'JDM', 'German', 'Supercars', 'Track', 'Classic', 'Cars & Coffee', 'Rally', 'Drift', 'Charity'];
const STOCK_LINK = 'PASTE_YOUR_STOCK_OR_GOOGLE_LINK_HERE';

function FilterDrawer({ onClose }) {
  const { filters, setFilters, clearFilters } = useApp();
  const set = (key, value) => setFilters({ ...filters, [key]: value });
  return <aside className="filter-drawer" aria-label="Meet filters"><div className="filter-head"><h2>FILTERS</h2><button onClick={onClose} aria-label="Close filters">×</button></div><p className="filter-label">CATEGORY</p><div className="filter-categories">{categoryOptions.map(category => <button key={category} className={filters.category === category ? 'active' : ''} onClick={() => set('category', category)}>{category === 'ALL' ? 'ALL MEETS' : category}</button>)}</div><div className="filter-rule" />{[['familyFriendly', 'Family Friendly Only'], ['weekend', 'This Weekend'], ['featuredOnly', 'Featured Only']].map(([key, text]) => <label className="filter-switch" key={key}>{text}<button className={filters[key] ? 'switch on' : 'switch'} onClick={() => set(key, !filters[key])}><b /></button></label>)}<button className="clear-filters" onClick={clearFilters}>CLEAR ALL</button></aside>;
}

function Header({ filtersOpen, setFiltersOpen, menuOpen, setMenuOpen }) {
  const { theme, toggleTheme } = useTheme(); const { simpleView, setSimpleView } = useApp();
  return <header className="site-header"><a className="brand" href="/"><i />CRYSTAL.MEETS</a><label className="list-toggle"><button className={simpleView ? 'switch on' : 'switch'} onClick={() => setSimpleView(!simpleView)}><b /></button>JUST SHOW ME THE LIST</label><button className="theme-button" onClick={toggleTheme}>{theme === 'dark' ? '☼' : '◐'}</button><div className="header-actions"><button className={filtersOpen ? 'active-action' : ''} onClick={() => setFiltersOpen(!filtersOpen)}>⌕ FILTERS</button><Link className="header-button" to="/submit">⊞ SUBMIT A MEET</Link><button onClick={() => setMenuOpen(!menuOpen)}>☰</button></div>{menuOpen && <div className="menu-panel"><button>SIGN IN</button><a href={STOCK_LINK} target="_blank" rel="noreferrer">STOCK LINK</a><small>Replace <code>STOCK_LINK</code> in Discover.js with your URL.</small></div>}</header>;
}

export default function Discover() {
  const { meets, featured, selectedMeetId, setSelectedMeetId, simpleView } = useApp(); const navigate = useNavigate(); const open = meet => navigate(`/meet/${meet.meet_id}`); const [filtersOpen, setFiltersOpen] = useState(false); const [menuOpen, setMenuOpen] = useState(false);
  return <main className="app-shell"><Header filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen} menuOpen={menuOpen} setMenuOpen={setMenuOpen} /><section className="featured-rail"><p className="eyebrow">✧ FEATURED · PROMOTED</p><div className="featured-row">{featured.slice(0, 3).map(meet => <button key={meet.meet_id} className="featured-card" style={{ backgroundImage: `linear-gradient(90deg,rgba(10,13,15,.18),rgba(10,13,15,.7)),url(${meet.image})` }} onClick={() => open(meet)}><span><b>{label(meet)}</b><small>{date(meet.date)}</small></span><strong>{meet.name}</strong><em>⌖ {meet.location_name}</em></button>)}</div></section><section className={simpleView ? 'discover-body list-only' : 'discover-body'}><aside className="meet-list">{meets.length ? meets.map(meet => <article className={meet.meet_id === selectedMeetId ? 'meet-card selected' : 'meet-card'} key={meet.meet_id} onMouseEnter={() => setSelectedMeetId(meet.meet_id)}><img src={meet.image} alt="" /><div><p className="tags"><span>{label(meet)}</span>{meet.featured && <b>FEATURED</b>}</p><button className="meet-name" onClick={() => open(meet)}>{meet.name}</button><small>▣ {date(meet.date)} · {time(meet.date)}<br />⌖ {meet.location_name}</small></div></article>) : <div className="empty-meets"><h2>No meets match</h2><p>Try clearing filters or checking again later.</p></div>}</aside>{!simpleView && <div className="map-panel"><MeetMap />{filtersOpen && <FilterDrawer onClose={() => setFiltersOpen(false)} />}<i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" /></div>}</section></main>;
}
