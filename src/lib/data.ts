import type { Album, Profile } from './types';

export const initialAlbums: Album[] = [
  {
    id: 'cybernetic-dreams',
    title: 'Cybernetic Dreams',
    releaseYear: 2023,
    coverArt: 'https://placehold.co/500x500.png',
    tracks: [
      { id: 't1', title: 'Neon Pulse', duration: '3:45' },
      { id: 't2', title: 'Digital Ghost', duration: '4:12' },
      { id: 't3', title: 'Chrome Heart', duration: '5:02' },
      { id: 't4', title: 'Data Stream', duration: '2:55' },
      { id: 't5', title: 'Future Shock', duration: '4:40' },
    ],
  },
  {
    id: 'void-runner',
    title: 'Void Runner',
    releaseYear: 2021,
    coverArt: 'https://placehold.co/500x500.png',
    tracks: [
      { id: 't6', title: 'Starlight Echoes', duration: '4:30' },
      { id: 't7', title: 'Zero Gravity', duration: '3:58' },
      { id: 't8', title: 'Asteroid Field', duration: '5:15' },
      { id: 't9', title: 'Hypersleep', duration: '6:10' },
    ],
  },
    {
    id: 'grid-runner',
    title: 'Grid Runner',
    releaseYear: 2019,
    coverArt: 'https://placehold.co/500x500.png',
    tracks: [
      { id: 't10', title: 'Vector', duration: '3:33' },
      { id: 't11', title: 'Mainframe', duration: '4:04' },
      { id: 't12', title: 'Circuit', duration: '3:50' },
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
