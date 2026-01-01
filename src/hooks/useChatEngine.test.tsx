import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatEngine } from './useChatEngine';
import * as api from '../api/constitutional';
import { AgentQueryResponse } from '../api/constitutional';

// Mock the constitutional API
vi.mock('../api/constitutional');

const mockAgentQuery = vi.spyOn(api, 'agentQuery');

describe('useChatEngine Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with a default system message', () => {
    const { result } = renderHook(() => useChatEngine());
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('assistant');
    expect(result.current.messages[0].content).toContain('SYSTEM INITIALIZED');
  });

  it('should handle sending a message and receiving a successful response', async () => {
    const mockResponse: AgentQueryResponse = {
      answer: 'This is a test answer.',
      sources: [{ id: 'src1', title: 'Source 1', snippet: '', score: 0.9, doc_type: 'LAG', source: 'test' }],
      reasoning_steps: [],
      model_used: 'test-model',
      total_time_ms: 1234,
      mode: 'EVIDENCE',
      warden_status: 'UNCHANGED',
      evidence_level: 'HIGH',
      corrections_applied: [],
    };
    mockAgentQuery.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChatEngine());

    // Set user input
    act(() => {
      result.current.setInput('Hello, world!');
    });

    // Send the message
    await act(async () => {
      await result.current.handleSend();
    });

    // Check messages array
    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[1].role).toBe('user');
    expect(result.current.messages[1].content).toBe('Hello, world!');
    expect(result.current.messages[2].role).toBe('assistant');
    expect(result.current.messages[2].content).toBe(mockResponse.answer);

    // Check RAG stats mapping
    const stats = result.current.messages[2].ragStats;
    expect(stats).toBeDefined();
    expect(stats?.latency).toBe('1,234ms');
    expect(stats?.confidence).toBe(0.9); // HIGH -> 0.90
    expect(stats?.sources).toHaveLength(1);
    expect(stats?.sources[0].title).toBe('Source 1');
    expect(stats?.sources[0].type).toBe('LAG'); // mapDocType

    // Check state changes
    expect(result.current.isTyping).toBe(false);
    expect(result.current.input).toBe('');
    expect(result.current.error).toBeNull();
  });

  it('should handle an API error gracefully', async () => {
    const errorMessage = 'Network Failure';
    mockAgentQuery.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useChatEngine());

    act(() => {
      result.current.setInput('Trigger error');
    });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[2].role).toBe('assistant');
    expect(result.current.messages[2].content).toContain(errorMessage);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isTyping).toBe(false);
  });

  it('should not send a message if input is empty or just whitespace', async () => {
    const { result } = renderHook(() => useChatEngine());

    act(() => {
      result.current.setInput('   ');
    });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(result.current.messages).toHaveLength(1); // Only the initial message
    expect(mockAgentQuery).not.toHaveBeenCalled();
  });
});
