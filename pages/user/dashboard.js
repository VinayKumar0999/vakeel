import Head from 'next/head';
import UserDashboard from '../components/UserDashboard';

export default function Dashboard() {
  return (
    <div>
      <Head>
        <title>Dashboard - Legal Consultancy App</title>
      </Head>
      <UserDashboard />
    </div>
  );
}