import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaGlobe } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-red-700">
          <h1 className="text-3xl font-bold text-white">StreamHub</h1>
        </div>
        <div className="px-4 py-5 sm:p-6">

          <p className="text-lg mb-4 text-red-700 font-bold">
            Note: This App is for Project purpose only and it does not promote piracy
          </p>
          <p className="text-lg mb-4">
            StreamHub is a cutting-edge movie streaming platform that offers:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>HD free movie streaming</li>
            <li>User-friendly interface</li>
            <li>Extensive movie library</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
