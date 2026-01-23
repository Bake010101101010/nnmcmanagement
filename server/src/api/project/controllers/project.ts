import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::project.project', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    
    // Добавляем вычисляемые поля
    const enrichedData = await Promise.all(
      data.map(async (project: any) => {
        return enrichProjectWithComputedFields(project);
      })
    );
    
    return { data: enrichedData, meta };
  },

  async findOne(ctx) {
    // Ensure author is populated for meetings
    // In Strapi v5, populate can be an array or object
    if (ctx.query.populate) {
      if (Array.isArray(ctx.query.populate)) {
        // If it's an array, add meetings.author if not already present
        if (!ctx.query.populate.includes('meetings.author')) {
          ctx.query.populate.push('meetings.author');
        }
      } else if (typeof ctx.query.populate === 'object' && ctx.query.populate !== null) {
        // If it's an object, ensure meetings.author is populated
        const populateObj = ctx.query.populate as any;
        if (!populateObj.meetings) {
          populateObj.meetings = {};
        }
        if (typeof populateObj.meetings === 'object') {
          populateObj.meetings.populate = populateObj.meetings.populate || [];
          if (Array.isArray(populateObj.meetings.populate) && !populateObj.meetings.populate.includes('author')) {
            populateObj.meetings.populate.push('author');
          }
        }
      }
    }
    
    const response = await super.findOne(ctx);
    if (response?.data) {
      response.data = enrichProjectWithComputedFields(response.data);
    }
    return response;
  },
}));

function enrichProjectWithComputedFields(project: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = project.tasks || [];
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t: any) => t.status === 'DONE').length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const dueDate = project.dueDate ? new Date(project.dueDate) : null;
  let overdue = false;
  let dueSoon = false;

  if (dueDate && project.status === 'ACTIVE') {
    dueDate.setHours(0, 0, 0, 0);
    overdue = today > dueDate;
    
    if (!overdue) {
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      dueSoon = diffDays <= 3 && diffDays >= 0;
    }
  }

  return {
    ...project,
    progressPercent,
    overdue,
    dueSoon,
    totalTasks,
    doneTasks,
  };
}
