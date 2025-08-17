import type { Album, Profile, RoadmapItem, ApiKeys, ThemeSettings, HeroSlide } from './types';

export const initialAlbums: Album[] = [
  {
    id: 'aether-current',
    title: 'Aether Current',
    releaseYear: 2024,
    coverArt: 'https://placehold.co/800x800.png',
    tracks: [
      { id: 't1', title: 'First Contact', duration: '4:22', url: '' },
      { id: 't2', title: 'Solar Winds', duration: '5:10', url: '' },
      { id: 't3', title: 'Event Horizon', duration: '3:56', url: '' },
      { id: 't4', title: 'Geodesic', duration: '4:48', url: '' },
    ],
  },
  {
    id: 'silicon-heart',
    title: 'Silicon Heart',
    releaseYear: 2022,
    coverArt: 'https://placehold.co/800x800.png',
    tracks: [
      { id: 't5', title: 'Ghost in the Machine', duration: '3:59', url: '' },
      { id: 't6', title: 'Chrome Dreams', duration: '4:33', url: '' },
      { id: 't7', title: 'I/O', duration: '2:50', url: '' },
      { id: 't8', title: 'The Network', duration: '5:01', url: '' },
      { id: 't9', title: 'Reboot', duration: '1:30', url: '' },
    ],
  },
    {
    id: 'arcology',
    title: 'Arcology',
    releaseYear: 2020,
    coverArt: 'https://placehold.co/800x800.png',
    tracks: [
      { id: 't10', title: 'Level 101', duration: '4:00', url: '' },
      { id: 't11', title: 'Neon Canyons', duration: '5:21', url: '' },
      { id: 't12', title: 'Sky-High', duration: '3:45', url: '' },
    ],
  },
];

export const initialProfile: Profile = {
  bio: "RUDYBTZ is a visionary artist from the digital frontier, crafting sonic landscapes that blur the lines between humanity and technology. With a signature blend of synthwave, techno, and ambient sounds, RUDYBTZ's music is an odyssey through neon-drenched cityscapes and cosmic voids.",
  profileImage: 'https://placehold.co/300x300.png',
  socials: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    soundcloud: 'https://soundcloud.com',
  },
};

export const initialRoadmap: RoadmapItem[] = [
    {
        id: 'roadmap-1',
        title: 'Launch Music NFT Collection',
        description: 'Create a limited edition NFT collection for a new exclusive track. Integrate with a marketplace.',
        status: 'Planned',
        dueDate: '2024-12-31',
    },
    {
        id: 'roadmap-2',
        title: 'Virtual Concert in Decentraland',
        description: 'Plan and execute a live virtual performance in the Decentraland metaverse.',
        status: 'In Progress',
        dueDate: '2024-10-15',
    },
    {
        id: 'roadmap-3',
        title: 'Website Redesign V2',
        description: 'Overhaul the website with a new visual theme and improved user experience.',
        status: 'Completed',
        dueDate: '2024-07-20',
    }
];

export const initialApiKeys: ApiKeys = {
    gemini: '',
    huggingFace: '',
    deepseek: '',
};

export const initialThemeSettings: ThemeSettings = {
  background: {
    type: 'particles',
    value: '#0A0514' // Default background color if particles are off
  },
  primary: '170 80% 50%', // Neon Cyan/Green
  accent: '330 90% 60%' // Neon Magenta/Pink
};

export const initialHeroSlides: HeroSlide[] = [
  { id: 'slide-1', type: 'video', url: 'https://cdn.pixabay.com/video/2022/08/24/127118-742498260_large.mp4' },
  { id: 'slide-2', type: 'image', url: 'https://placehold.co/1920x1080.png', hint: 'abstract circuitry' },
  { id: 'slide-3', type: 'video', url: 'https://cdn.pixabay.com/video/2022/05/23/117288-718698115_large.mp4' },
  { id: 'slide-4', type: 'image', url: 'https://placehold.co/1920x1080.png', hint: 'cosmic nebula' },
  { id: 'slide-5', type: 'video', url: 'https://cdn.pixabay.com/video/2022/09/20/130103-752994191_large.mp4' },
];
