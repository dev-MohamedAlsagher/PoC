'use client';

import { useEffect, useState } from 'react';

export default function RawData() {
  const [allStats, setAllStats] = useState([]);

  useEffect(() => {
    fetch('/api/log-login')
      .then(res => res.json())
      .then(setAllStats)
      .catch(console.error);
  }, []);

  if (allStats.length === 0) return <p style={{ textAlign: 'center' }}>Loading raw data...</p>;

  // Groeperen per browser → per methode
  const groupedStats = allStats.reduce((acc, stat) => {
    if (!acc[stat.browser]) acc[stat.browser] = {};
    if (!acc[stat.browser][stat.loginMethod]) acc[stat.browser][stat.loginMethod] = [];
    acc[stat.browser][stat.loginMethod].push(stat);
    return acc;
  }, {});

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '95vw',
        margin: 'auto',
        padding: '2rem',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        All Login Attempts (Grouped by Browser & Method)
      </h1>

      {Object.entries(groupedStats).map(([browser, methods]) =>
        Object.entries(methods).map(([method, stats]) => (
          <div
            key={`${browser}-${method}`}
            style={{
              padding: '1rem',
              borderRadius: 8,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              marginBottom: '2rem',
              overflowX: 'auto',
            }}
          >
            <h3
              style={{
                color: '#2980b9',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
            >
              {browser} - {method}
            </h3>

            <table
              style={{
                borderCollapse: 'collapse',
                minWidth: `${stats.length * 100 + 120}px`,
                width: '100%',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 2,
                      backgroundColor: '#f0f4f8',
                      padding: '8px 12px',
                      width: '120px',
                    }}
                  ></th>
                  {stats.map((_, idx) => (
                    <th
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f0f4f8',
                        textAlign: 'center',
                        fontWeight: '600',
                        minWidth: '100px',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      {idx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['durationMs', 'status'].map((property) => (
                  <tr key={property} style={{ borderBottom: '1px solid #eee' }}>
                    <td
                      style={{
                        fontWeight: '600',
                        padding: '8px 12px',
                        backgroundColor: '#f0f4f8',
                        minWidth: '120px',
                        textTransform: 'capitalize',
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                      }}
                    >
                      {property === 'durationMs'
                        ? 'Duration (ms)'
                        : property.charAt(0).toUpperCase() + property.slice(1)}
                    </td>
                    {stats.map((stat, idx) => (
                      <td
                        key={idx}
                        style={{
                          padding: '8px 12px',
                          textAlign: 'center',
                          minWidth: '100px',
                        }}
                      >
                        {stat[property]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
