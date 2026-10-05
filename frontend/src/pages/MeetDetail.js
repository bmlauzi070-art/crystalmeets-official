import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import MeetMap from '@/components/MeetMap';
import EventSchedule from '../components/EventSchedule';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

const date = v => new Intl.DateTimeFormat('en-IE', { weekday: 'short', day: '2-digit', month: 'short' }).format(new Date(v));
const time = v => new Intl.DateTimeFormat('en-IE', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(v));
const Fact = ({ label, value }) => <div className="fact"><small>{label}</small><strong>{value}</strong></div>;

export default function MeetDetail() {
  const { id } = useParams(); 
  const { meets, setSelectedMeetId } = useApp(); 
  const { theme, toggleTheme } = useTheme(); 
  const meet = meets.find(item => item.meet_id === id) || meets[0];

  useEffect(() => { 
    if (meet) setSelectedMeetId(meet.meet_id); 
  }, [meet, setSelectedMeetId]); 

  if (!meet) return null;

  return (
    <main className="detail-page">
      <header className="detail-header">
        <Link to="/">← BACK</Link>
        <div>
          <button>♧ SAVE</button>
          <button>⌯ SHARE</button>
          <button onClick={toggleTheme}>{theme === 'dark' ? '☼' : '◐'}</button>
        </div>
      </header>

      <section className="detail-hero" style={{ backgroundImage: `linear-gradient(0deg,var(--page) 0%,rgba(0,0,0,.06) 75%),url(${meet.image})` }}>
        <div>
          <p className="tags">
            <span>{meet.category}</span>
            {meet.featured && <b>FEATURED</b>}
          </p>
          <h1>{meet.name}</h1>
        </div>
      </section>

      <section className="detail-content">
        <div>
          <p className="eyebrow">ABOUT THE MEET</p>
          <p className="description">{meet.description}</p>
          
          {/* Dynamic Drag-and-Drop Timeline Powered by Sanity.io */}
          <EventSchedule />

          <div className="fact-grid"><Fact label="DATE" value={date(meet.date)} /><Fact label="TIME" value={time(meet.date)} /><Fact label="LOCATION" value={meet.location_name} /><Fact label="ENTRY" value={meet.price} /><Fact label="ORGANISER" value={meet.organiser} /></div>
          <p className="eyebrow address-label">ADDRESS</p>
          <p>{meet.address}</p>
          <div className="directions">
            <a href={`https://www.google.com/maps/search/?api=1&query=${meet.lat},${meet.lon}`} target="_blank" rel="noreferrer">⌁ OPEN IN GOOGLE MAPS</a>
            <a href={`https://maps.apple.com/?ll=${meet.lat},${meet.lon}`} target="_blank" rel="noreferrer">⌁ OPEN IN APPLE MAPS</a>
          </div>
        </div>

        <aside className="detail-side">
          <div className="detail-map">
            <MeetMap />
          </div>
          <p className="eyebrow">LIVE WEATHER <b className="weather">☁ OVERCAST · 18°C</b></p>
        </aside>
      </section>
    </main>
  );
}
