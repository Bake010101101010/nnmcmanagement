export default {
  async beforeCreate(event: any) {
    const { params } = event;
    const strapi = (global as any).strapi;

    if (params?.data?.manualStageOverride) {
      return;
    }

    const firstStage = (await strapi.entityService.findMany('api::board-stage.board-stage', {
      sort: { order: 'asc' },
      pagination: { pageSize: 1 },
    })) as any[];

    if (firstStage[0]?.id) {
      params.data.manualStageOverride = firstStage[0].id;
    }
  },

  async afterCreate(event: any) {
    const { result } = event;
    const strapi = (global as any).strapi;
    const userId = event?.state?.user?.id ?? null;

    try {
      await strapi.entityService.create('api::activity-log.activity-log', {
        data: {
          action: 'CREATE_PROJECT',
          description: `Создан проект: "${result.title}"`,
          project: result.id,
          user: userId,
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
    const userId = event?.state?.user?.id ?? null;

    try {
      const data = params.data || {};
      const changes = Object.keys(data || {});
      const logEntries: Array<{ action: string; description: string; metadata?: any }> = [];

      if (Object.prototype.hasOwnProperty.call(data, 'manualStageOverride')) {
        logEntries.push({
          action: 'MOVE_STAGE',
          description: `Перемещён проект: "${result.title}"`,
          metadata: { projectTitle: result.title, changes },
        });
      }

      if (data?.status === 'DELETED') {
        logEntries.push({
          action: 'DELETE_PROJECT',
          description: `Удалён проект: "${result.title}"`,
          metadata: { projectTitle: result.title, changes },
        });
      }

      const assignmentFields = ['owner', 'supportingSpecialists', 'responsibleUsers'];
      const hasAssignmentChange = assignmentFields.some((field) =>
        Object.prototype.hasOwnProperty.call(data, field)
      );
      if (hasAssignmentChange) {
        logEntries.push({
          action: 'ASSIGN_USER',
          description: `Назначены исполнители проекта: "${result.title}"`,
          metadata: { projectTitle: result.title, changes, fields: assignmentFields },
        });
      }

      const updateFields = changes.filter(
        (field) => field !== 'manualStageOverride' && !assignmentFields.includes(field)
      );
      const shouldLogUpdate = updateFields.length > 0 && data?.status !== 'DELETED';

      if (shouldLogUpdate) {
        logEntries.push({
          action: 'UPDATE_PROJECT',
          description: `Обновлён проект: "${result.title}"`,
          metadata: { projectTitle: result.title, changes },
        });
      }

      for (const entry of logEntries) {
        await strapi.entityService.create('api::activity-log.activity-log', {
          data: {
            action: entry.action,
            description: entry.description,
            project: result.id,
            user: userId,
            metadata: entry.metadata || { projectTitle: result.title, changes },
          },
        });
      }
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  },
};
