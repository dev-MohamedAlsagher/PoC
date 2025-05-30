'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Stats() {
  const [allStats, setAllStats] = useState([]);

  useEffect(() => {
    fetch('/api/log-login')
      .then(res => res.json())
      .then(data => setAllStats(data));
  }, []);

  if (allStats.length === 0)
    return <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '4rem' }}>Loading statistics...</p>;

  const average = arr => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

  const groupBy = (arr, key) =>
    arr.reduce((acc, cur) => {
      const k = cur[key] || 'Unknown';
      if (!acc[k]) acc[k] = [];
      acc[k].push(cur);
      return acc;
    }, {});

  const avgDurationPerMethod = () =>
    Object.entries(groupBy(allStats, 'loginMethod')).map(([method, entries]) => ({
      method,
      avgDuration: Math.round(average(entries.map(e => e.durationMs)))
    }));

  const statsPerBrowser = () =>
    Object.entries(groupBy(allStats, 'browser')).map(([browser, entries]) => {
      const methods = Object.entries(groupBy(entries, 'loginMethod')).map(([method, records]) => ({
        method,
        avgDuration: Math.round(average(records.map(e => e.durationMs)))
      }));
      return { browser, methods };
    });

  const statsPerMethod = () =>
    Object.entries(groupBy(allStats, 'loginMethod')).map(([method, entries]) => {
      const success = entries.filter(e => e.status === 'success').length;
      const failed = entries.filter(e => e.status === 'failed').length;
      return {
        method,
        avgDuration: Math.round(average(entries.map(e => e.durationMs))),
        total: entries.length,
        success,
        failed
      };
    });

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: 'auto',
        padding: '3rem 2rem',
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
        color: '#333'
      }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>📊 Login Statistieken</h1>

      {/* Section: Avg per method */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Gemiddelde Duur per Methode</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={avgDurationPerMethod()}>
            <XAxis dataKey="method" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgDuration" fill="#4a90e2" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Section: Per browser */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Per Browser (met inwendige methodes)</h2>
        {statsPerBrowser().map(({ browser, methods }) => (
          <div key={browser} style={cardStyle}>
            <h3 style={cardTitle}>{browser}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={methods}>
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgDuration" fill="#50e3c2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </section>

      {/* Section: Per method totaaloverzicht */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Overzicht per Methode in totaal</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Methode</th>
                <th>Gem. Duur (ms)</th>
                <th>Totaal</th>
                <th style={{ color: 'green' }}>Success</th>
                <th style={{ color: 'red' }}>Failed</th>
              </tr>
            </thead>
            <tbody>
              {statsPerMethod().map(row => (
                <tr key={row.method}>
                  <td>{row.method}</td>
                  <td>{row.avgDuration}</td>
                  <td>{row.total}</td>
                  <td style={{ color: 'green' }}>{row.success}</td>
                  <td style={{ color: 'red' }}>{row.failed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section: Per Methode per Browser */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Overzicht per methode per browser</h2>
        {Object.entries(groupBy(allStats, 'loginMethod')).map(([method, entries]) => {
          const browserGroups = groupBy(entries, 'browser');
          return (
            <div key={method} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{method}</h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th>Browser</th>
                    <th>Gem. Duur (ms)</th>
                    <th>Totaal</th>
                    <th style={{ color: 'green' }}>Success</th>
                    <th style={{ color: 'red' }}>Failed</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(browserGroups).map(([browser, records]) => {
                    const avg = Math.round(average(records.map(e => e.durationMs)));
                    const total = records.length;
                    const success = records.filter(e => e.status === 'success').length;
                    const failed = records.filter(e => e.status === 'failed').length;

                    return (
                      <tr key={browser}>
                        <td>{browser}</td>
                        <td>{avg}</td>
                        <td>{total}</td>
                        <td style={{ color: 'green' }}>{success}</td>
                        <td style={{ color: 'red' }}>{failed}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>
    </div>
  );
}

// Reusable styles
const sectionStyle = {
  marginBottom: '4rem'
};

const sectionTitle = {
  fontSize: '1.8rem',
  marginBottom: '1rem',
  borderBottom: '2px solid #eee',
  paddingBottom: '0.5rem'
};

const cardStyle = {
  background: '#f9f9f9',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginBottom: '2rem'
};

const cardTitle = {
  marginBottom: '1rem',
  fontSize: '1.4rem',
  fontWeight: 600
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '1rem'
};
