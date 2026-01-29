export default ({ env }) => {
  const frontendUrl = env('FRONTEND_URL', 'http://192.168.101.25:13005');

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        enabled: true,
        headers: '*',
        origin: [
          frontendUrl,
          'http://localhost:13005',
          'http://127.0.0.1:13005',
        ].filter(Boolean),
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
