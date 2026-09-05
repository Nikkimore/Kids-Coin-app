import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Balloon Kiss',
    short_name: 'Balloon Kiss',
    description: 'Fly hot air balloons, catch kisses, dodge darts, and sponsor sky banners in World App.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff1f2',
    theme_color: '#f43f5e',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/kiss-balloon-icon-v2.jpg',
        sizes: '1024x1024',
        type: 'image/jpeg',
      },
    ],
  };
}
