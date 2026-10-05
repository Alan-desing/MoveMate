import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StoredActivity } from '@/types/activity';

const ACTIVITIES_STORAGE_KEY = 'movemate_activities';

export async function getActivities(): Promise<StoredActivity[]> {
  try {
    const stored = await AsyncStorage.getItem(ACTIVITIES_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const activities = JSON.parse(stored) as StoredActivity[];

    return activities.sort(
      (a, b) => b.startedAt - a.startedAt
    );
  } catch (error) {
    console.error('Error al cargar actividades:', error);
    return [];
  }
}

export async function saveActivity(
  activity: StoredActivity
): Promise<void> {
  const activities = await getActivities();

  const updatedActivities = [
    activity,
    ...activities.filter((item) => item.id !== activity.id),
  ];

  await AsyncStorage.setItem(
    ACTIVITIES_STORAGE_KEY,
    JSON.stringify(updatedActivities)
  );
}

export async function deleteActivity(
  activityId: string
): Promise<void> {
  const activities = await getActivities();

  const updatedActivities = activities.filter(
    (activity) => activity.id !== activityId
  );

  await AsyncStorage.setItem(
    ACTIVITIES_STORAGE_KEY,
    JSON.stringify(updatedActivities)
  );
}