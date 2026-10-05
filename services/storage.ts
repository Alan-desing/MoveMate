import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StoredActivity } from '@/types/activity';

function getStorageKey(userId?: string | null) {
  if (userId) {
    return `movemate_activities_${userId}`;
  }

  return 'movemate_activities_guest';
}

export async function getActivities(
  userId?: string | null
): Promise<StoredActivity[]> {
  try {
    const storageKey = getStorageKey(userId);

    const stored = await AsyncStorage.getItem(storageKey);

    if (!stored) {
      return [];
    }

    const activities = JSON.parse(stored) as StoredActivity[];

    return activities.sort(
      (a, b) => b.startedAt - a.startedAt
    );
  } catch (error) {
    console.error(
      'Error al cargar actividades:',
      error
    );

    return [];
  }
}

export async function saveActivity(
  activity: StoredActivity,
  userId?: string | null
): Promise<void> {
  const storageKey = getStorageKey(userId);

  const activities = await getActivities(userId);

  const updatedActivities = [
    activity,
    ...activities.filter(
      (item) => item.id !== activity.id
    ),
  ];

  await AsyncStorage.setItem(
    storageKey,
    JSON.stringify(updatedActivities)
  );
}

export async function deleteActivity(
  activityId: string,
  userId?: string | null
): Promise<void> {
  const storageKey = getStorageKey(userId);

  const activities = await getActivities(userId);

  const updatedActivities =
    activities.filter(
      (activity) =>
        activity.id !== activityId
    );

  await AsyncStorage.setItem(
    storageKey,
    JSON.stringify(updatedActivities)
  );
}