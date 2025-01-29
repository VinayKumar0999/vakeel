import Head from 'next/head';
import LawyerProfile from '../components/LawyerProfile';

export default function Lawyer({ lawyer }) {
  return (
    <div>
      <Head>
        <title>{lawyer.name} - Legal Consultancy App</title>
      </Head>
      <LawyerProfile lawyer={lawyer} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  // Fetch lawyer data from API or database
  const lawyer = await fetchLawyerData(id);
  return {
    props: { lawyer },
  };
}