/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/en/dashboards', 
        destination: '/en/dashboards/doctypelist', 
        permanent: true, 
      },
      {
        source: '/en', // Redirect `/en`
        destination: '/en/dashboards/doctypelist', 
        permanent: true,
      },
      {
        source: '/',
        destination: '/en/dashboards/doctypelist',
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(en|fr|ar)',
        destination: '/:lang/dashboards/doctypelist',
        permanent: true,
        locale: false
      },
      {
        source: '/((?!(?:en|fr|ar|front-pages|favicon.ico)\\b)):path',
        destination: '/en/:path',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
