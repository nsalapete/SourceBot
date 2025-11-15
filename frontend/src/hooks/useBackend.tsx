import { useState, useEffect, useCallback } from 'react';
import { getState, submitGoal, executeResearch, approveFindings, resetWorkflow, BackendState } from '@/lib/backendApi';
import { toast } from '@/hooks/use-toast';

export function useBackend() {
  const [state, setState] = useState<BackendState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current state
  const fetchState = useCallback(async () => {
    try {
      const currentState = await getState();
      setState(currentState);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch state';
      setError(message);
      console.error('Error fetching state:', err);
    }
  }, []);

  // Submit new goal
  const handleSubmitGoal = useCallback(async (goal: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await submitGoal(goal);
      setState(result.state);
      toast({
        title: "Goal Submitted",
        description: result.message,
      });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit goal';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Execute research
  const handleExecuteResearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeResearch();
      setState(result.state);
      toast({
        title: "Research Started",
        description: result.message,
      });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to execute research';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Approve findings
  const handleApproveFindings = useCallback(async (approved: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const result = await approveFindings(approved);
      setState(result.state);
      toast({
        title: approved ? "Findings Approved" : "Findings Rejected",
        description: result.message,
      });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve findings';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset workflow
  const handleReset = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await resetWorkflow();
      setState(result.state);
      toast({
        title: "Workflow Reset",
        description: result.message,
      });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset workflow';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch state on mount
  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return {
    state,
    loading,
    error,
    fetchState,
    submitGoal: handleSubmitGoal,
    executeResearch: handleExecuteResearch,
    approveFindings: handleApproveFindings,
    resetWorkflow: handleReset,
  };
}
