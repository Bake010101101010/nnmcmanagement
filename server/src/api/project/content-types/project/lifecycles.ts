export default {
  async afterCreate(event: any) {
    const { result, params } = event;
    const strapi = (global as any).strapi;
    
    try {
      await strapi.entityService.create('api::activity-log.activity-log', {
        data: {
          action: 'CREATE_PROJECT',
          description: `Создан проект: "${result.title}"`,
          project: result.id,
          metadata: { projectTitle: result.title },
        },
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  },

  async afterUpdate(event: any) {
    const { result, params } = event;
    const strapi = (global as any).strapi;
    
    try {
      // Проверяем, был ли проект архивирован или восстановлен
      const data = params.data;
      let action = 'UPDATE_PROJECT';
      let description = `Обновлён проект: "${result.title}"`;
      
      if (data?.status === 'ARCHIVED') {
        action = 'ARCHIVE_PROJECT';
        description = `Архивирован проект: "${result.title}"`;
      } else if (data?.status === 'ACTIVE' && data?.status !== undefined) {
        action = 'RESTORE_PROJECT';
        description = `Восстановлен проект: "${result.title}"`;
      } else if (data?.manualStageOverride !== undefined) {
        action = 'MOVE_STAGE';
        description = `Изменена стадия проекта: "${result.title}"`;
      }
      
      await strapi.entityService.create('api::activity-log.activity-log', {
        data: {
          action,
          description,
          project: result.id,
          metadata: { projectTitle: result.title, changes: Object.keys(data || {}) },
        },
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  },
};
