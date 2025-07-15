import { useEffect, useState } from 'react';
import type { AdminInfoDTO } from '@shared/types/admin';
import type { UserDto } from '@shared/types/user';
import type { PlanCreatorData } from '@shared/types/plan';
import type {
  CreatorApplicationDTO,
  CreatorFullDTO,
} from '@shared/types/creator';
import { toast } from '@frontend/hooks/use-toast';

export const useAdminDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminInfoDTO>();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [plans, setPlans] = useState<PlanCreatorData[]>([]);
  const [creators, setCreators] = useState<CreatorFullDTO[]>([]);

  const [applications, setApplications] = useState<CreatorApplicationDTO[]>([]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, plansRes, creatorsRes, appsRes] =
        await Promise.all([
          //TODO BUG ADMIN PANEL REVENUE MISSING: FETCH FROM ADMIN SOURCES, NOT GETTING FULL DATA
          fetch('/api/v1/admin/stats'),
          fetch('/api/v1/users'),
          fetch('/api/v1/admin/plans'),
          fetch('/api/v1/admin/creators'),
          fetch('/api/v1/admin/creator-applications'),
        ]);

      if (!statsRes.ok || !usersRes.ok || !plansRes.ok || !appsRes.ok)
        throw new Error('Failed to fetch dashboard data');

      const statsData: AdminInfoDTO = await statsRes.json();
      const usersData: UserDto[] = await usersRes.json();
      const plansData: PlanCreatorData[] = await plansRes.json();
      const creatorsData: CreatorFullDTO[] = await creatorsRes.json();
      const appsData: CreatorApplicationDTO[] = await appsRes.json();

      setStats(statsData);
      setUsers(usersData);
      setPlans(plansData);
      setCreators(creatorsData);
      setApplications(appsData);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    loading,
    stats,
    users,
    plans,
    applications,
    creators,
    refetch: fetchAllData,
  };
};
