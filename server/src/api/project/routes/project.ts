import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::project.project', {
  config: {
    create: { policies: ['global::project-assignees'] },
    update: { policies: ['global::project-assignees'] },
  },
});
