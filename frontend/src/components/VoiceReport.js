import React, { useState } from 'react';
import axios from 'axios';
import './VoiceReport.css';

const API_BASE = 'http://localhost:5000/api';

function VoiceReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [textReport, setTextReport] = useState(null);
  const [showText, setShowText] = useState(false);

  const handleGetVoiceReport = async () => {
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await axios.get(`${API_BASE}/get-voice-report`, {
        responseType: 'blob'
      });

      // Create URL for audio blob
      const url = URL.createObjectURL(response.data);
      setAudioUrl(url);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate voice report');
      console.error('Error:', err);

      // Try to get text report as fallback
      try {
        const textResponse = await axios.get(`${API_BASE}/get-text-report`);
        setTextReport(textResponse.data.report);
      } catch (textErr) {
        console.error('Failed to get text report:', textErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetTextReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE}/get-text-report`);
      setTextReport(response.data.report);
      setShowText(true);
    } catch (err) {
      setError('Failed to get text report');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="voice-report card">
      <h2>🎙️ Status Report</h2>
      
      <div className="report-actions">
        <button 
          onClick={handleGetVoiceReport}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? '🔄 Generating...' : '🔊 Get Voice Report'}
        </button>
        
        <button 
          onClick={handleGetTextReport}
          className="btn btn-secondary"
          disabled={loading}
        >
          📄 Get Text Report
        </button>
      </div>

      {error && (
        <div className="report-error">
          ⚠️ {error}
          {textReport && (
            <button onClick={() => setShowText(true)} className="btn-link">
              View text version instead
            </button>
          )}
        </div>
      )}

      {audioUrl && (
        <div className="audio-player">
          <div className="audio-header">
            <span>🎵 Voice Report Generated</span>
          </div>
          <audio controls src={audioUrl} autoPlay>
            Your browser does not support the audio element.
          </audio>
          <div className="audio-actions">
            <a href={audioUrl} download="status_report.mp3" className="btn-link">
              💾 Download MP3
            </a>
          </div>
        </div>
      )}

      {(showText && textReport) && (
        <div className="text-report">
          <div className="text-report-header">
            <h3>📄 Text Report</h3>
            <button onClick={() => setShowText(false)} className="btn-link">
              ✕ Close
            </button>
          </div>
          <div className="text-report-content">
            {textReport}
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceReport;
