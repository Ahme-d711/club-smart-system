import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './MenuImport.css';

const MenuImport = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select an Excel file (.xlsx or .xls)');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an Excel file');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/import/menus', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error importing menus');
      console.error('Import error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.get('/api/import/template', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'menu-template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Error downloading template');
      console.error('Template download error:', err);
    }
  };

  return (
    <div className="menu-import-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="page-title">Import Menus from Excel</h1>

      <div className="import-container">
        <div className="import-card">
          <div className="import-section">
            <h2>Upload Excel File</h2>
            <p className="description">
              Upload an Excel file (.xlsx) containing menu items. Each sheet represents one venue (café or restaurant).
            </p>

            <form onSubmit={handleSubmit} className="import-form">
              <div className="form-group">
                <label htmlFor="file">Select Excel File</label>
                <input
                  type="file"
                  id="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={loading}
                  required
                />
                {file && (
                  <div className="file-info">
                    <span>Selected: {file.name}</span>
                    <span>Size: {(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {result && (
                <div className="success-message">
                  <h3>✓ Import Successful!</h3>
                  <p>{result.message}</p>
                  {result.menus && (
                    <div className="import-summary">
                      <p><strong>Imported Venues:</strong></p>
                      <ul>
                        {result.menus.map((menu, index) => (
                          <li key={index}>
                            {menu.name.en || menu.name} - {menu.items.length} items
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading || !file}
                >
                  {loading ? 'Importing...' : 'Import Menus'}
                </button>
              </div>
            </form>
          </div>

          <div className="template-section">
            <h2>Excel File Format</h2>
            <p>
              Your Excel file should have the following columns:
            </p>
            <div className="format-info">
              <h3>Required Columns:</h3>
              <ul>
                <li><strong>Name (EN)</strong> - Item name in English</li>
                <li><strong>Name (AR)</strong> - Item name in Arabic (optional)</li>
                <li><strong>Description (EN)</strong> - Description in English</li>
                <li><strong>Description (AR)</strong> - Description in Arabic (optional)</li>
                <li><strong>Price</strong> - Item price (number)</li>
                <li><strong>Category</strong> - Item category (e.g., coffee, main, dessert)</li>
                <li><strong>Image URL</strong> - Image URL (optional)</li>
              </ul>
            </div>

            <div className="format-info">
              <h3>Alternative Format (Single Language):</h3>
              <ul>
                <li><strong>Name</strong> - Item name</li>
                <li><strong>Description</strong> - Item description</li>
                <li><strong>Price</strong> - Item price</li>
                <li><strong>Category</strong> - Item category</li>
                <li><strong>Image URL</strong> - Image URL (optional)</li>
              </ul>
            </div>

            <div className="format-info">
              <h3>Notes:</h3>
              <ul>
                <li>Each sheet in the Excel file represents one venue (café or restaurant)</li>
                <li>The sheet name will be used as the venue name</li>
                <li>Skip empty rows</li>
                <li>Items with missing names or prices will be skipped</li>
              </ul>
            </div>

            <button
              type="button"
              className="btn-template"
              onClick={downloadTemplate}
            >
              Download Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuImport;

