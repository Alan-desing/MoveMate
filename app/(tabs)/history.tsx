import { useCallback, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  deleteActivityFromCloud,
  getActivitiesFromCloud,
} from '@/services/cloudActivities';

import { useFocusEffect } from 'expo-router';

import ActivityHistoryCard from '@/components/ActivityHistoryCard';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

import {
  deleteActivity,
  getActivities,
  saveActivity,
} from '@/services/storage';

import type {
  ActivityType,
  StoredActivity,
} from '@/types/activity';

type TypeFilter = 'all' | ActivityType;

type DateFilter =
  | 'all'
  | 'today'
  | 'week'
  | 'month';

export default function HistoryScreen() {
  const { theme } = useAppTheme();

  const { user } = useAuth();

  const colors = Colors[theme];

  const [activities, setActivities] = useState<StoredActivity[]>([]);

  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>('all');

  const [dateFilter, setDateFilter] =
    useState<DateFilter>('all');

  const [refreshing, setRefreshing] = useState(false);

  const loadActivities = useCallback(async () => {
    let storedActivities = await getActivities(user?.uid);

    if (user) {
      try {
        const cloudActivities =
          await getActivitiesFromCloud(user.uid);

        for (const activity of cloudActivities) {
          await saveActivity(
            activity,
            user.uid
          );
        }

        storedActivities =
          await getActivities(user.uid);
      } catch (error) {
        console.error(
          'Error al recuperar actividades de Firebase:',
          error
        );
      }
    }

    setActivities(storedActivities);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadActivities();
    }, [loadActivities])
  );

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadActivities();

    setRefreshing(false);
  };

  const handleDelete = async (
    activityId: string
  ) => {
    await deleteActivity(
      activityId,
      user?.uid
    );

    if (user) {
      try {
        await deleteActivityFromCloud(
          activityId
        );
      } catch (error) {
        console.error(
          'Error al eliminar actividad de Firebase:',
          error
        );
      }
    }

    setActivities((current) =>
      current.filter(
        (activity) =>
          activity.id !== activityId
      )
    );
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesType =
        typeFilter === 'all' ||
        activity.type === typeFilter;

      const matchesDate = matchesDateFilter(
        activity.startedAt,
        dateFilter
      );

      return matchesType && matchesDate;
    });
  }, [
    activities,
    typeFilter,
    dateFilter,
  ]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Historial
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Revisá las actividades que registraste.
        </Text>

        <Text
          style={[
            styles.filterTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Tipo de actividad
        </Text>

        <View style={styles.filterRow}>
          <FilterButton
            label="Todas"
            active={typeFilter === 'all'}
            onPress={() => setTypeFilter('all')}
            colors={colors}
          />

          <FilterButton
            label="Caminata"
            active={typeFilter === 'walk'}
            onPress={() => setTypeFilter('walk')}
            colors={colors}
          />

          <FilterButton
            label="Carrera"
            active={typeFilter === 'run'}
            onPress={() => setTypeFilter('run')}
            colors={colors}
          />

          <FilterButton
            label="Bici"
            active={typeFilter === 'bike'}
            onPress={() => setTypeFilter('bike')}
            colors={colors}
          />
        </View>

        <Text
          style={[
            styles.filterTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Fecha
        </Text>

        <View style={styles.filterRow}>
          <FilterButton
            label="Todas"
            active={dateFilter === 'all'}
            onPress={() => setDateFilter('all')}
            colors={colors}
          />

          <FilterButton
            label="Hoy"
            active={dateFilter === 'today'}
            onPress={() => setDateFilter('today')}
            colors={colors}
          />

          <FilterButton
            label="7 días"
            active={dateFilter === 'week'}
            onPress={() => setDateFilter('week')}
            colors={colors}
          />

          <FilterButton
            label="30 días"
            active={dateFilter === 'month'}
            onPress={() => setDateFilter('month')}
            colors={colors}
          />
        </View>

        <Text
          style={[
            styles.resultCount,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {filteredActivities.length}{' '}
          {filteredActivities.length === 1
            ? 'actividad'
            : 'actividades'}
        </Text>

        {filteredActivities.length === 0 ? (
          <View
            style={[
              styles.emptyState,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Todavía no hay actividades
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Iniciá una actividad desde la pantalla principal
              para verla acá.
            </Text>
          </View>
        ) : (
          filteredActivities.map((activity) => (
            <ActivityHistoryCard
              key={activity.id}
              activity={activity}
              onDelete={handleDelete}
              colors={colors}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function FilterButton({
  label,
  active,
  onPress,
  colors,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
  };
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterButton,
        {
          backgroundColor: active
            ? colors.primary
            : colors.card,

          borderColor: active
            ? colors.primary
            : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: active
              ? '#ffffff'
              : colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function matchesDateFilter(
  timestamp: number,
  filter: DateFilter
) {
  if (filter === 'all') {
    return true;
  }

  const activityDate = new Date(timestamp);
  const now = new Date();

  if (filter === 'today') {
    return (
      activityDate.getDate() === now.getDate() &&
      activityDate.getMonth() === now.getMonth() &&
      activityDate.getFullYear() === now.getFullYear()
    );
  }

  const difference =
    now.getTime() - activityDate.getTime();

  const days =
    difference / (1000 * 60 * 60 * 24);

  if (filter === 'week') {
    return days <= 7;
  }

  return days <= 30;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 100,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    marginBottom: 26,
  },

  filterTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },

  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  resultCount: {
    fontSize: 12,
    marginBottom: 12,
  },

  emptyState: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginTop: 8,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
});