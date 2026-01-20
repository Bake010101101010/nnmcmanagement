export default {
  routes: [
    {
      method: 'GET',
      path: '/analytics/summary',
      handler: 'analytics.summary',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
