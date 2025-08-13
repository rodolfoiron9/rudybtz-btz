import type { Album, Profile, RoadmapItem } from './types';

export const initialAlbums: Album[] = [
  {
    id: 'cybernetic-dreams',
    title: 'Cybernetic Dreams',
    releaseYear: 2023,
    coverArt: 'https://placehold.co/500x500.png',
    tracks: [
      { id: 't1', title: 'Neon Pulse', duration: '3:45', url: '' },
      { id: 't2', title: 'Digital Ghost', duration: '4:12', url: '' },
      { id: 't3', title: 'Chrome Heart', duration: '5:02', url: '' },
      { id: 't4', title: 'Data Stream', duration: '2:55', url: '' },
      { id: 't5', title: 'Future Shock', duration: '4:40', url: '' },
    ],
  },
  {
    id: 'void-runner',
    title: 'Void Runner',
    releaseYear: 2021,
    coverArt: 'https://placehold.co/500x500.png',
    tracks: [
      { id: 't6', title: 'Starlight Echoes', duration: '4:30', url: '' },
      { id: 't7', title: 'Zero Gravity', duration: '3:58', url: '' },
      { id: 't8', title: 'Asteroid Field', duration: '5:15', url: '' },
      { id: 't9', title: 'Hypersleep', duration: '6:10', url: '' },
    ],
  },
    {
    id: 'grid-runner',
    title: 'Grid Runner',
    releaseYear: 2019,
    coverArt: 'https://placehold.co/500x500.png',
    tracks: [
      { id: 't10', title: 'Vector', duration: '3:33', url: '' },
      { id: 't11', title: 'Mainframe', duration: '4:04', url: '' },
      { id: 't12', title: 'Circuit', duration: '3:50', url: '' },
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
