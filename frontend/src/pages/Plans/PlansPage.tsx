import { useEffect, useState } from 'react';
import type { PlanPreview } from '@shared/types/plan';
import PlanList from '@frontend/pages/Plans/PlanList';

function PlansPage() {
  const [plans, setPlans] = useState<PlanPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('HAHAHA');

    const fetchPlans = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/v1/plans');
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <>
      <main style={{ padding: '2rem' }}>
        {loading ? <p>Loading...</p> : <PlanList plans={plans} />}
      </main>
    </>
  );
}

export default PlansPage;
