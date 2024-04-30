const path = require('path');

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*', // Définit le chemin pour accéder aux fichiers dans le répertoire d'uploads
        destination: `${process.cwd()}/uploads/:path*`, // Spécifie le chemin absolu vers le répertoire d'uploads sur le serveur
      },
    ];
  },
};
