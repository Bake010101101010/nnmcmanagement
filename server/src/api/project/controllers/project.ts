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
