import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::task.task', {
  config: {
    create: { policies: ['global::task-department'] },
    update: { policies: ['global::task-department'] },
    delete: { policies: ['global::task-department'] },
  },
});
