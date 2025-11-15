import React from 'react';
import './StatusView.css';

function StatusView({ state, onApprove, onReject, loading }) {
  const getStatusColor = (status) => {
    const colors = {
      idle: '#6c757d',
      planning: '#ffc107',
      planned: '#17a2b8',
      researching: '#007bff',
      awaiting_approval: '#fd7e14',
      drafting: '#20c997',
      completed: '#28a745',
      error: '#dc3545',
      rejected: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusIcon = (status) => {
    const icons = {
      idle: '⏸️',
      planning: '🤔',
      planned: '📋',
      researching: '🔍',
      awaiting_approval: '⏳',
      drafting: '✍️',
      completed: '✅',
      error: '❌',
      rejected: '🚫'
    };
    return icons[status] || '📊';
  };

  return (
    <div className="status-view card">
      <div className="status-header">
        <h2>📊 Workflow Status</h2>
        <div 
          className="status-badge" 
          style={{ backgroundColor: getStatusColor(state.status) }}
        >
          {getStatusIcon(state.status)} {state.status.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Goal Display */}
      {state.goal && (
        <div className="section">
          <h3>🎯 Current Goal</h3>
          <div className="goal-display">{state.goal}</div>
        </div>
      )}

      {/* Plan Steps */}
      {state.plan && state.plan.length > 0 && (
        <div className="section">
          <h3>📝 Action Plan</h3>
          <div className="plan-steps">
            {state.plan.map((step, index) => (
              <div 
                key={step.step_number} 
                className={`plan-step ${index < state.current_step ? 'completed' : ''} ${index === state.current_step ? 'active' : ''}`}
              >
                <div className="step-number">{step.step_number}</div>
                <div className="step-content">
                  <div className="step-title">{step.title}</div>
                  <div className="step-description">{step.description}</div>
                </div>
                <div className="step-status">
                  {index < state.current_step ? '✅' : index === state.current_step ? '⏳' : '⏸️'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Findings */}
      {state.findings && (
        <div className="section">
          <h3>🔍 Research Findings</h3>
          
          {state.findings.summary && (
            <div className="findings-summary">
              <strong>Summary:</strong> {state.findings.summary}
            </div>
          )}

          {state.findings.statistics && (
            <div className="statistics-grid">
              <div className="stat-card">
                <div className="stat-value">{state.findings.statistics.total_suppliers}</div>
                <div className="stat-label">Total Suppliers</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{state.findings.statistics.average_rating?.toFixed(1)}</div>
                <div className="stat-label">Avg Rating</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{state.findings.statistics.active_count}</div>
                <div className="stat-label">Active</div>
              </div>
            </div>
          )}

          {state.findings.key_findings && state.findings.key_findings.length > 0 && (
            <div className="key-findings">
              <strong>Key Findings:</strong>
              <ul>
                {state.findings.key_findings.map((finding, index) => (
                  <li key={index}>{finding}</li>
                ))}
              </ul>
            </div>
          )}

          {state.findings.relevant_suppliers && state.findings.relevant_suppliers.length > 0 && (
            <div className="relevant-suppliers">
              <strong>Relevant Suppliers:</strong>
              <div className="suppliers-list">
                {state.findings.relevant_suppliers.map((supplier, index) => (
                  <div key={index} className="supplier-card">
                    <div className="supplier-header">
                      <span className="supplier-name">{supplier.name}</span>
                      <span className="supplier-id">{supplier.id}</span>
                    </div>
                    <div className="supplier-reason">{supplier.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {state.findings.recommendations && state.findings.recommendations.length > 0 && (
            <div className="recommendations">
              <strong>Recommendations:</strong>
              <ul>
                {state.findings.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Approval Buttons */}
          {state.status === 'awaiting_approval' && (
            <div className="approval-actions">
              <button 
                onClick={onApprove} 
                className="btn btn-success"
                disabled={loading}
              >
                ✅ Approve & Continue
              </button>
              <button 
                onClick={onReject} 
                className="btn btn-danger"
                disabled={loading}
              >
                ❌ Reject
              </button>
            </div>
          )}
        </div>
      )}

      {/* Email Drafts */}
      {state.drafts && state.drafts.emails && (
        <div className="section">
          <h3>✉️ Email Drafts</h3>
          
          {state.drafts.summary && (
            <div className="drafts-summary">
              <strong>Strategy:</strong> {state.drafts.summary}
            </div>
          )}

          <div className="email-drafts">
            {state.drafts.emails.map((email, index) => (
              <div key={index} className="email-card">
                <div className="email-header">
                  <div>
                    <strong>{email.supplier_name}</strong>
                    <span className="email-id"> ({email.supplier_id})</span>
                  </div>
                  <span className="email-to">{email.to}</span>
                </div>
                <div className="email-subject">
                  <strong>Subject:</strong> {email.subject}
                </div>
                <div className="email-body">
                  <pre>{email.body}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusView;
