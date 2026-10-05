export type ActivityType = 'walk' | 'run' | 'bike';

export type RoutePoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

export type ActiveActivity = {
  type: ActivityType;
  startedAt: number;
  route: RoutePoint[];
};