import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import styles from './styles.module.css';

function ChartsView({ data }) {
  if (!data || data.length === 0) return null;

  // Extract column names, excluding any index/id columns
  const columnNames = Object.keys(data[0]).filter(col => 
    !['id', 'index', 'ID', 'Index'].includes(col)
  );

  return (
    <div className={styles.chartsContainer}>
      {columnNames.map((col) => (
        <div key={col} className={styles.chartWrapper}>
          <h3 className={styles.chartTitle}>{col}</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={columnNames[0]} /> {/* Use first column as X-axis */}
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={col} 
                stroke="#8884d8" 
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

export default ChartsView;
