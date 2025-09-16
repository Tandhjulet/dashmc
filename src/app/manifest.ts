import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DashMC',
    short_name: 'DashMC',
    description: 'DashMC.net er et klassisk, men nyfortolket, minecraft servernetværk, der tilbyder både skyblock og kitpvp.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}