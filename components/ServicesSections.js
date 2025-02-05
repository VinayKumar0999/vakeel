// ServicesSection.js
import React from 'react';
import Grid from '@mui/material/Grid2';

const services = [
  {
    id: 1,
    title: 'Online Consultation with a Lawyer',
    description: 'Now consult a lawyer or get your legal documents reviewed anytime from the convenience of your home. With secure calls and verified Lawyers',
    icon: 'fas fa-home',
  },
  {
    id: 2,
    title: 'Documentation by Expert Professionals',
    description: 'Corporate, HR, professional or personal, Get any legal document drafted and customised to your business or personal needs in the most affordable way.',
    icon: 'fas fa-briefcase',
  },
  {
    id: 3,
    title: 'Property legal solutions for all your property investments',
    description: `Trusted Property Legal Services. We help you take the right Property investment decisions. India's #1 Property Legal Solutions.`,
    icon: 'fas fa-lightbulb',
  },
  {
    id: 4,
    title: 'Start-up Legal Solutions',
    description: 'Planning a start-up or have an on-going business, now You focus on your business and leave the legal worries on us. Consulting, Drafting, Review and Filing all under one roof.',
    icon: 'fas fa-lightbulb',

  }
  // Add more services as needed
];

const ServicesSection = () => {
  return (
    <section id="services" className="services-section d-flex">
      <div className="container">
        <h2 className='py-4 fs-4'>Our Services</h2>
        <div>Need expert consultation on Legal Matters? You're in the right place! Experienced legal professionals are here for you 24X7. Whether it's a small query or a big concern, experts are ready to help with clear & reliable advice in your Own Language.
          No legal jargon, just simple, straightforward support. Let us take the worry out of your legal matters.</div>
        <div className="row">
          <Grid container spacing={2}>
            {services.map((service, index) => {
              const xs = index < 3 ? 4 : 12 / (services.length - 3);
              return (
                <Grid key={index} item size={xs}>
                  <div key={service.id} className="py-4">
                    <div className="service-card p-4">
                      <i className={service.icon} aria-hidden="true"></i>
                      <h3 className='service-title'>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;