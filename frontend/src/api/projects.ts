import client from './client';
import type { Project } from '../types';

export const projectsApi = {
  getAll: async (params?: {
    status?: Project['status'];
    department?: string;
    search?: string;
  }): Promise<Project[]> => {
    const query: Record<string, string | number | boolean | undefined> = {
      'populate[0]': 'department',
      'populate[1]': 'tasks',
      'populate[2]': 'responsibleUsers',
      'populate[3]': 'manualStageOverride',
      'populate[4]': 'meetings',
      'populate[5]': 'meetings.author',
      'sort[0]': 'createdAt:desc',
      'pagination[pageSize]': 100,
    };

    if (params?.status) {
      query['filters[status][$eq]'] = params.status;
    } else {
      query['filters[status][$ne]'] = 'DELETED';
    }
    if (params?.department) {
      query['filters[department][key][$eq]'] = params.department;
    }
    if (params?.search) {
      query['filters[title][$containsi]'] = params.search;
    }

    const response = await client.get('/projects', {
      params: query,
    });
    
    // Map Strapi v5 response to include documentId as id for routing
    const data = response.data.data || [];
    return data.map((item: any) => ({
      ...item,
      id: item.id,
      documentId: item.documentId,
    }));
  },

  getOne: async (id: number | string): Promise<Project> => {
    // In Strapi v5, we need to use documentId for single item access
    // Use string format for nested populate (like in surveys.ts)
    const response = await client.get(`/projects/${id}`, {
      params: {
        'populate[0]': 'department',
        'populate[1]': 'tasks',
        'populate[2]': 'tasks.assignee',
        'populate[3]': 'responsibleUsers',
        'populate[4]': 'manualStageOverride',
        'populate[5]': 'meetings',
        'populate[6]': 'meetings.author',
      },
    });
    return response.data.data;
  },

  create: async (data: Partial<Project>): Promise<Project> => {
    const response = await client.post('/projects', { data });
    return response.data.data;
  },

  update: async (id: number | string, data: Partial<Project>): Promise<Project> => {
    const response = await client.put(`/projects/${id}`, { data });
    return response.data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await client.delete(`/projects/${id}`);
  },

  softDelete: async (id: number | string): Promise<Project> => {
    const response = await client.put(`/projects/${id}`, {
      data: { status: 'DELETED' },
    });
    return response.data.data;
  },

  archive: async (id: number | string): Promise<Project> => {
    const response = await client.put(`/projects/${id}`, {
      data: { status: 'ARCHIVED' },
    });
    return response.data.data;
  },

  restore: async (id: number | string): Promise<Project> => {
    const response = await client.put(`/projects/${id}`, {
      data: { status: 'ACTIVE' },
    });
    return response.data.data;
  },

  updateStage: async (id: number | string, stageId: number | null): Promise<Project> => {
    const response = await client.put(`/projects/${id}`, {
      data: { manualStageOverride: stageId },
    });
    return response.data.data;
  },
};
