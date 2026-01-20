import client from './client';
import type { Task } from '../types';

export const tasksApi = {
  create: async (data: {
    title: string;
    description?: string;
    project: string; // documentId
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    order?: number;
  }): Promise<Task> => {
    const response = await client.post('/tasks', { data });
    return response.data.data;
  },

  update: async (documentId: string, data: Partial<Task>): Promise<Task> => {
    const response = await client.put(`/tasks/${documentId}`, { data });
    return response.data.data;
  },

  delete: async (documentId: string): Promise<void> => {
    await client.delete(`/tasks/${documentId}`);
  },

  updateStatus: async (documentId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Promise<Task> => {
    const response = await client.put(`/tasks/${documentId}`, {
      data: { status },
    });
    return response.data.data;
  },
};
