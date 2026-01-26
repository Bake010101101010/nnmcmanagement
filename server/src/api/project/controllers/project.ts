import { factories } from '@strapi/strapi';

async function checkSuperAdmin(
  ctx: any,
  strapi: any,
  options: { throwOnFail?: boolean } = {}
): Promise<boolean> {
  const throwOnFail = options.throwOnFail !== false;
  const user = ctx.state.user;
  if (!user) {
    if (throwOnFail) {
      ctx.throw(401, 'Not authenticated');
    }
    return false;
  }

  const userWithRole = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
    populate: ['role'],
  });

  const roleName = (userWithRole?.role?.name || '').toLowerCase().replace(/\s+/g, '');
  const roleType = (userWithRole?.role?.type || '').toLowerCase().replace(/\s+/g, '');

  const allowedRoles = ['admin', 'superadmin', 'super_admin', 'суперадмин'];
  const isAllowed = allowedRoles.some((role) => roleName.includes(role) || roleType.includes(role));

  if (!isAllowed) {
    if (throwOnFail) {
      ctx.throw(403, 'Access denied. Only Super Admin can delete projects.');
    }
    return false;
  }

  return true;
}

export default factories.createCoreController('api::project.project', ({ strapi }) => ({
  async find(ctx) {
    const isSuperAdmin = await checkSuperAdmin(ctx, strapi, { throwOnFail: false });
    const { data, meta } = await super.find(ctx);
    const visibleData = isSuperAdmin
      ? data
      : data.filter((project: any) => project?.status !== 'DELETED');
    
    // Добавляем вычисляемые поля
    const enrichedData = await Promise.all(
      visibleData.map(async (project: any) => {
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
      const isSuperAdmin = await checkSuperAdmin(ctx, strapi, { throwOnFail: false });
      if (!isSuperAdmin && response.data.status === 'DELETED') {
        ctx.throw(404, 'Project not found');
        return;
      }
      response.data = enrichProjectWithComputedFields(response.data);
    }
    return response;
  },

  async delete(ctx) {
    await checkSuperAdmin(ctx, strapi);
    return await super.delete(ctx);
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
