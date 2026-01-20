import seedData from '../scripts/seed';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    // Run seed on first start (check if departments exist)
    const departments = await strapi.entityService.findMany('api::department.department');
    
    if (departments.length === 0) {
      console.log('🌱 First start detected, running seed...');
      await seedData();
    }
  },
};
