export interface PinData {
  id: string;
  x: number;
  y: number;
  gridCell: string;
  note: string | null;
  voteScore: number;
  hidden: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    group: string;
    color: string;
    iconPath: string;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  userVote?: number | null;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  group: string;
  color: string;
  iconPath: string;
  sortOrder: number;
}

export interface RegionData {
  id: string;
  name: string;
  slug: string;
  rotationStart: string | null;
  rotationEnd: string | null;
}
