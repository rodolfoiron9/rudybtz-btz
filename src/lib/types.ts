export interface Track {
  id: string;
  title: string;
  duration: string;
}

export interface Album {
  id: string;
  title: string;
  releaseYear: number;
  coverArt: string;
  tracks: Track[];
}

export interface Profile {
  bio: string;
  profileImage: string;
  socials: {
    twitter: string;
    instagram: string;
    youtube: string;
    soundcloud: string;
  };
}
