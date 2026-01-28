export default {
  routes: [
    {
      method: 'GET',
      path: '/projects/assignable-users',
      handler: 'project.assignableUsers',
      config: {
        policies: [],
      },
    },
  ],
};
