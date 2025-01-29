import Head from 'next/head';
import LawyerList from '../components/LawyerList';

export default function Lawyers() {
  return (
    <div>
      <Head>
        <title>Lawyers - Legal Consultancy App</title>
      </Head>
      <LawyerList />
    </div>
  );
}