import Head from 'next/head';
import HeroSection from '../components/HeroSection';
import FeaturedLawyers from '../components/FeaturedLawyers';
import Testimonials from '../components/Testimonial';
import ServicesSection from '../components/ServicesSections'
import BookAppointment from '@/components/BookAppointment';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home - Legal Consultancy App</title>
      </Head>
      <HeroSection />
      <ServicesSection />
      <BookAppointment />
      <FeaturedLawyers />
      <Testimonials />
    </div>
  );
}