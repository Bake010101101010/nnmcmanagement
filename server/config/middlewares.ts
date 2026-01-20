export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      credentials: true,
      origin: [
        'http://localhost:13004',
        'http://127.0.0.1:13004',
        'http://192.168.101.25:13004',
        env('FRONTEND_URL', 'http://192.168.101.25:13004'),
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
