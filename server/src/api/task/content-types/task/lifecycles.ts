export default {
  async afterCreate(event: any) {
    const { result, params } = event;
    const strapi = (global as any).strapi;
    
    try {
      // Получаем проект для логирования
      let projectId = null;
      let projectTitle = '';
      
      if (params.data?.project) {
        const project = await strapi.entityService.findOne('api::project.project', params.data.project);
        if (project) {
          projectId = project.id;
          projectTitle = project.title;
        }
      }
      
      await strapi.entityService.create('api::activity-log.activity-log', {
        data: {
          action: 'CREATE_TASK',
          description: `Добавлена задача "${result.title}" в проект "${projectTitle}"`,
          project: projectId,
          metadata: { taskTitle: result.title, projectTitle },
        },
      });
    } catch (error) {
      console.error('Failed to log task activity:', error);
    }
  },

  async afterUpdate(event: any) {
    const { result, params } = event;
    const strapi = (global as any).strapi;
    
    try {
      // Получаем проект для логирования
      const task = await strapi.entityService.findOne('api::task.task', result.id, {
        populate: ['project'],
      });
      
      const projectTitle = task?.project?.title || '';
      const projectId = task?.project?.id || null;
      
      let description = `Обновлена задача "${result.title}"`;
      if (params.data?.status) {
        const statusLabels: Record<string, string> = {
          'TODO': 'К выполнению',
          'IN_PROGRESS': 'В работе',
          'DONE': 'Выполнено',
        };
        description = `Изменён статус задачи "${result.title}" на "${statusLabels[params.data.status] || params.data.status}"`;
      }
      
      await strapi.entityService.create('api::activity-log.activity-log', {
        data: {
          action: 'UPDATE_TASK',
          description,
          project: projectId,
          metadata: { taskTitle: result.title, projectTitle, changes: Object.keys(params.data || {}) },
        },
      });
    } catch (error) {
      console.error('Failed to log task activity:', error);
    }
  },

  async beforeDelete(event: any) {
    const { params } = event;
    const strapi = (global as any).strapi;
    
    try {
      // Получаем данные задачи до удаления
      const task = await strapi.entityService.findOne('api::task.task', params.where.id, {
        populate: ['project'],
      });
      
      if (task) {
        const projectTitle = task?.project?.title || '';
        const projectId = task?.project?.id || null;
        
        await strapi.entityService.create('api::activity-log.activity-log', {
          data: {
            action: 'DELETE_TASK',
            description: `Удалена задача "${task.title}" из проекта "${projectTitle}"`,
            project: projectId,
            metadata: { taskTitle: task.title, projectTitle },
          },
        });
      }
    } catch (error) {
      console.error('Failed to log task deletion:', error);
    }
  },
};
