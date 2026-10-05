import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/services/firebase';

import type { StoredActivity } from '@/types/activity';

const COLLECTION_NAME = 'activities';

export async function saveActivityToCloud(
  activity: StoredActivity,
  userId: string
) {
  const activityRef = doc(
    db,
    COLLECTION_NAME,
    activity.id
  );

  await setDoc(activityRef, {
    ...activity,
    userId,
  });
}

export async function getActivitiesFromCloud(
  userId: string
): Promise<StoredActivity[]> {
  const activitiesQuery = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(activitiesQuery);

  return snapshot.docs
    .map((document) => {
      const data = document.data();

      return {
        id: document.id,
        type: data.type,
        startedAt: data.startedAt,
        finishedAt: data.finishedAt,
        durationSeconds: data.durationSeconds,
        distanceKm: data.distanceKm,
        calories: data.calories,
        route: data.route ?? [],
      } as StoredActivity;
    })
    .sort(
      (a, b) => b.startedAt - a.startedAt
    );
}

export async function deleteActivityFromCloud(
  activityId: string
) {
  await deleteDoc(
    doc(
      db,
      COLLECTION_NAME,
      activityId
    )
  );
}