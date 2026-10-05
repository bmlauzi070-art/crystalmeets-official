// frontend/src/components/EventSchedule.js
import React, { useEffect, useState } from 'react';
import { sanityClient } from '../sanityClient';

export default function EventSchedule() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Write a secure query fetch string to grab your latest published car meet schedule sequence
    const fetchSchedule = async () => {
      try {
        const data = await sanityClient.fetch(
          `*[_type == "meetEvent"][0]{
            itinerary
          }`
        );
        if (data && data.itinerary) {
          setTimeline(data.itinerary);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading timeline from Sanity:", error);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return <div style={{ color: '#666', padding: '10px' }}>Loading timeline specs...</div>;
  }

  if (timeline.length === 0) {
    return <div style={{ color: '#444', padding: '10px' }}>No timeline milestones set yet.</div>;
  }

  return (
    <div style={{ padding: '20px 0', maxWidth: '500px' }}>
      <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '20px', letterSpacing: '0.5px' }}>
        Event Itinerary
      </h3>
      <div style={{ borderLeft: '2px solid #ff7a00', paddingLeft: '20px', marginLeft: '10px' }}>
        {timeline.map((item, index) => (
          <div key={item.itemId || index} style={{ position: 'relative', marginBottom: '25px' }}>
            {/* Timeline modern visual dot anchor */}
            <div style={{
              position: 'absolute',
              left: '-26px',
              top: '4px',
              width: '10px',
              height: '10px',
              backgroundColor: '#ff7a00',
              borderRadius: '50%',
              border: '3px solid #000'
            }} />
            
            {/* Row text content elements layout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#ff7a00', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {item.time}
              </span>
              <span style={{ color: '#fff', fontSize: '1.05rem' }}>
                {item.activity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
