import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RAAGA: School of Indian Classical Music',
    short_name: 'RAAGA',
    description:
      'Carnatic vocal classes for children and adults in Hyderabad and online.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f3ea',
    theme_color: '#6b1f2a',
    icons: [
      {
        src: '/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon-96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
