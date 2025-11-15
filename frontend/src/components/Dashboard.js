import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusView from './StatusView';
import VoiceReport from './VoiceReport';
import './Dashboard.css';

const API_BASE = 'http://localhost:5000/api';

function Dashboard() {
  const [goal, setGoal] = useState('');
  const [workflowState, setWorkflowState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial state
  useEffect(() => {
    fetchState();
  }, []);

  const fetchState = async () => {
    try {
      const response = await axios.get(`${API_BASE}/state`);
      setWorkflowState(response.data);
    } catch (err) {
      console.error('Failed to fetch state:', err);
    }
  };

  const handleSubmitGoal = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Submit goal
      const response = await axios.post(`${API_BASE}/submit-goal`, { goal });
      setWorkflowState(response.data.state);

      // Step 2: Automatically execute research
      const researchResponse = await axios.post(`${API_BASE}/execute-research`);
      setWorkflowState(researchResponse.data.state);

      setGoal('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process goal');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/approve-findings`, {
        approved: true
      });
      setWorkflowState(response.data.state);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve findings');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/approve-findings`, {
        approved: false
      });
      setWorkflowState(response.data.state);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject findings');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset the workflow?')) return;

    try {
      await axios.post(`${API_BASE}/reset`);
      setGoal('');
      setError(null);
      fetchState();
    } catch (err) {
      setError('Failed to reset workflow');
      console.error('Error:', err);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🤖 SourceBot - Multi-Agent Orchestrator</h1>
        <p>AI-Powered Supplier Relationship Management</p>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="dashboard-content">
        {/* Goal Input Section */}
        <section className="goal-section card">
          <h2>📝 Submit Your Goal</h2>
          <form onSubmit={handleSubmitGoal}>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Identify top-rated electronics suppliers for potential partnership..."
              rows="4"
              disabled={loading || workflowState?.status === 'awaiting_approval'}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !goal.trim() || workflowState?.status === 'awaiting_approval'}
            >
              {loading ? '🔄 Processing...' : '🚀 Start Workflow'}
            </button>
          </form>
        </section>

        {/* Status View */}
        {workflowState && workflowState.status !== 'idle' && (
          <StatusView 
            state={workflowState}
            onApprove={handleApprove}
            onReject={handleReject}
            loading={loading}
          />
        )}

        {/* Voice Report Section */}
        {workflowState && workflowState.status !== 'idle' && (
          <VoiceReport />
        )}

        {/* Reset Button */}
        {workflowState && workflowState.status !== 'idle' && (
          <section className="reset-section">
            <button onClick={handleReset} className="btn btn-secondary">
              🔄 Reset Workflow
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
