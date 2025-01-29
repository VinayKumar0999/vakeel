import Head from 'next/head';
import HeroSection from '../components/HeroSection';
import FeaturedLawyers from '../components/FeaturedLawyers';
import Testimonials from '../components/Testimonial';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home - Legal Consultancy App</title>
      </Head>
      <HeroSection />
      <FeaturedLawyers />
      <Testimonials />
    </div>
  );
}