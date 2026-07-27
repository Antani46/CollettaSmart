import { isAdmin } from '@/lib/auth';
import { getDatiColletta } from '@/lib/kv';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const autenticato = await isAdmin();

  if (!autenticato) {
    return <AdminLogin />;
  }

  const { costi, amici } = await getDatiColletta();

  return <AdminDashboard costi={costi} amici={amici} />;
}
