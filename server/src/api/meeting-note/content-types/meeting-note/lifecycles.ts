export default {
  async afterCreate(event: any) {
    const { result, params } = event;
    const strapi = (global as any).strapi;
    
    try {
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
          action: 'CREATE_MEETING',
          description: `Добавлена заметка к проекту "${projectTitle}"`,
          project: projectId,
          user: params.data?.author || null,
          metadata: { projectTitle, textPreview: result.text?.substring(0, 100) },
        },
      });
    } catch (error) {
      console.error('Failed to log meeting activity:', error);
    }
  },

  async afterUpdate(event: any) {
    const { result, params } = event;
    const strapi = (global as any).strapi;
    
    try {
      const meeting = await strapi.entityService.findOne('api::meeting-note.meeting-note', result.id, {
        populate: ['project', 'author'],
      });
      
      const projectTitle = meeting?.project?.title || '';
      const projectId = meeting?.project?.id || null;
      
      await strapi.entityService.create('api::activity-log.activity-log', {
        data: {
          action: 'UPDATE_MEETING',
          description: `Обновлена заметка в проекте "${projectTitle}"`,
          project: projectId,
          user: meeting?.author?.id || null,
          metadata: { projectTitle },
        },
      });
    } catch (error) {
      console.error('Failed to log meeting activity:', error);
    }
  },

  async beforeDelete(event: any) {
    const { params } = event;
    const strapi = (global as any).strapi;
    
    try {
      const meeting = await strapi.entityService.findOne('api::meeting-note.meeting-note', params.where.id, {
        populate: ['project', 'author'],
      });
      
      if (meeting) {
        const projectTitle = meeting?.project?.title || '';
        const projectId = meeting?.project?.id || null;
        
        await strapi.entityService.create('api::activity-log.activity-log', {
          data: {
            action: 'DELETE_MEETING',
            description: `Удалена заметка из проекта "${projectTitle}"`,
            project: projectId,
            user: meeting?.author?.id || null,
            metadata: { projectTitle },
          },
        });
      }
    } catch (error) {
      console.error('Failed to log meeting deletion:', error);
    }
  },
};
