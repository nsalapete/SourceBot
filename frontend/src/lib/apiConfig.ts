// API Configuration for SourceBot
// Handles connection to Flask backend via local or ngrok URL

const getApiUrl = (): string => {
  // Priority: ngrok URL > local API URL > fallback
  const ngrokUrl = import.meta.env.VITE_NGROK_URL;
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (ngrokUrl && ngrokUrl !== '') {
    console.log('🌐 Using ngrok URL:', ngrokUrl);
    return ngrokUrl;
  }
  
  if (apiUrl && apiUrl !== '') {
    console.log('🔗 Using local API URL:', apiUrl);
    return apiUrl;
  }
  
  console.log('⚠️ No API URL configured, using fallback');
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();

// API endpoints
export const API_ENDPOINTS = {
  // State management
  STATE: `${API_BASE_URL}/api/state`,
  
  // Task operations
  SUBMIT_GOAL: `${API_BASE_URL}/api/submit-goal`,
  EXECUTE_RESEARCH: `${API_BASE_URL}/api/execute-research`,
  APPROVE_FINDINGS: `${API_BASE_URL}/api/approve-findings`,
  RESET: `${API_BASE_URL}/api/reset`,
  
  // Reports
  VOICE_REPORT: `${API_BASE_URL}/api/get-voice-report`,
  TEXT_REPORT: `${API_BASE_URL}/api/get-text-report`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
};

// Fetch wrapper with error handling
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Check backend connectivity
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}
