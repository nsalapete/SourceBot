// Real Backend API Integration for SourceBot
// Connects to Flask orchestrator endpoints

import { API_BASE_URL, apiFetch } from './apiConfig';

// Backend State Interface
export interface BackendState {
  goal: string | null;
  status: 'idle' | 'planning' | 'planned' | 'researching' | 'awaiting_approval' | 'reviewing' | 'rejected' | 'drafting' | 'completed' | 'error';
  current_step: number;
  plan: string[];
  findings: any;
  drafts: any;
  suppliers_data: any;
}

// API Functions

/**
 * Get current workflow state
 */
export async function getState(): Promise<BackendState> {
  return apiFetch<BackendState>(`${API_BASE_URL}/api/state`, {
    method: 'GET',
  });
}

/**
 * Submit a new procurement goal
 */
export async function submitGoal(goal: string): Promise<{ message: string; state: BackendState }> {
  return apiFetch(`${API_BASE_URL}/api/submit-goal`, {
    method: 'POST',
    body: JSON.stringify({ goal }),
  });
}

/**
 * Execute research phase
 */
export async function executeResearch(): Promise<{ message: string; state: BackendState }> {
  return apiFetch(`${API_BASE_URL}/api/execute-research`, {
    method: 'POST',
  });
}

/**
 * Approve or reject findings
 */
export async function approveFindings(approved: boolean): Promise<{ message: string; state: BackendState }> {
  return apiFetch(`${API_BASE_URL}/api/approve-findings`, {
    method: 'POST',
    body: JSON.stringify({ approved }),
  });
}

/**
 * Get voice report
 */
export async function getVoiceReport(): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/get-voice-report`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return await response.blob();
}

/**
 * Get text report
 */
export async function getTextReport(): Promise<{ report: string }> {
  return apiFetch(`${API_BASE_URL}/api/get-text-report`, {
    method: 'GET',
  });
}

/**
 * Reset workflow
 */
export async function resetWorkflow(): Promise<{ message: string; state: BackendState }> {
  return apiFetch(`${API_BASE_URL}/api/reset`, {
    method: 'POST',
  });
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  return apiFetch(`${API_BASE_URL}/api/health`, {
    method: 'GET',
  });
}
