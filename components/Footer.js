import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import { Mail, Phone, LocationOn } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box className="bg-gray-900 text-white p-8 md:p-16">
      <Box className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Us Section */}
        <Box>
          <img src="/logo.png" alt="Emerge Legal" className="mb-4 w-32" />
          <Typography variant="h6" className="mb-2">About Us</Typography>
          <Typography variant="body2">
            At Emerge Legal, we understand that every legal matter is unique, and therefore we offer personalized and bespoke solutions to address the specific needs of our clients.
          </Typography>
          <Link href="#" className="text-pink-500 mt-2 inline-block">Read More</Link>
        </Box>

        {/* Practice Areas */}
        <Box>
          <Typography variant="h6" className="mb-2">Our Practice Areas</Typography>
          <ul className="space-y-1">
            {['Regulatory & Statutory Audits', 'Arbitration & Litigation', 'Real Estate & Infrastructure', 'General Corporate', 'Mergers & Acquisitions', 'Competition / Anti-Trust', 'Insolvency & Bankruptcy'].map((area, index) => (
              <li key={index}>› {area}</li>
            ))}
          </ul>
        </Box>

        {/* Quick Links */}
        <Box>
          <Typography variant="h6" className="mb-2">Quick Links</Typography>
          <ul className="space-y-1">
            {['Home', 'About Us', 'Our Team', 'Blog', 'Career', 'Contact', 'Ground Water Extraction Approval'].map((link, index) => (
              <li key={index}>› {link}</li>
            ))}
          </ul>
          <Button variant="contained" className="bg-pink-500 mt-4">Book Appointment</Button>
        </Box>

        {/* Contact Information */}
        <Box>
          <Typography variant="h6" className="mb-2">Contact Information</Typography>
          <Box className="space-y-2">
            <Box className="flex items-center">
              <Mail className="mr-2" /> info@emergelegal.in
            </Box>
            <Box className="flex items-center">
              <Phone className="mr-2" /> +918054639220, 01614040899
            </Box>
            {['Gurugram: 4th Floor, Venture X, Landmark Cyber Park, Sector - 67, Gurugram, Haryana, India', 'Ludhiana: 713 - F, SBS Nagar, Pakhowal Road Ludhiana, Punjab', 'Chandigarh: Plot No 10, Timber Square, Madhya Marg, Sector 26 East, Chandigarh, 160019'].map((address, index) => (
              <Box key={index} className="flex items-start">
                <LocationOn className="mr-2 mt-1" />
                <Typography variant="body2">{address}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer Bottom */}
      <Box className="text-center text-sm mt-8 border-t border-gray-700 pt-4">
        © 2025 Emerge Legal. All rights reserved.
        <Box className="flex justify-center space-x-4 mt-2">
          <Link href="#" className="text-pink-500">Terms of Use</Link>
          <Link href="#" className="text-pink-500">Privacy Policy</Link>
        </Box>
      </Box>
    </Box>
  );
}
