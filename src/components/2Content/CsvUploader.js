import React, { useState } from 'react';
import styles from './styles.module.css';

function CsvUploader({ onCsvParsed }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid CSV file');
      e.target.value = null;
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a CSV file first');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0].map(header => header.trim());
        
        // Convert rows to array of objects with column headers as keys
        const data = rows.slice(1).map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            // Convert to number if possible, otherwise keep as string
            const value = row[index]?.trim();
            obj[header] = isNaN(value) ? value : Number(value);
          });
          return obj;
        });

        onCsvParsed(data);
      } catch (error) {
        alert('Error parsing CSV file: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      alert('Error reading file');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className={styles.uploaderContainer}>
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      <button 
        onClick={handleUpload} 
        disabled={!file || isLoading}
        className={styles.uploadButton}
      >
        {isLoading ? 'Processing...' : 'Upload CSV'}
      </button>
    </div>
  );
}

export default CsvUploader;
