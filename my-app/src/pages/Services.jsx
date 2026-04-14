import React from 'react';
import { Car, Map, MessageSquare, Banknote, Building, Hammer, FileText, Globe, PhoneCall } from 'lucide-react'; // Importing Lucide icons

export default function Services() {
  const services = [
    {
      title: 'Pick & Drop Facility',
      desc: 'Enjoy convenient and comfortable transportation for all your property visits, ensuring a hassle-free experience from start to finish.',
      icon: Car,
    },
    {
      title: 'Guided Site Visits',
      desc: 'Benefit from personalized and insightful tours to your prospective properties, accompanied by our expert real estate advisors.',
      icon: Map,
    },
    {
      title: 'Expert Property Counseling',
      desc: 'Receive personalized guidance and honest advice from our seasoned experts, empowering you to make informed real estate decisions.',
      icon: MessageSquare,
    },
    {
      title: 'Financial & Loan Assistance',
      desc: 'Get streamlined support and expert guidance in securing property loans and managing financial aspects of your real estate investment.',
      icon: Banknote,
    },
    {
      title: 'Society Development Support',
      desc: 'We provide comprehensive assistance for community and society development projects, fostering better living environments.',
      icon: Building,
    },
    {
      title: 'Custom Construction Services',
      desc: 'Our company offers dedicated assistance for house construction and farmhouse construction on your own land, ensuring quality and compliance.',
      icon: Hammer,
    },
    {
      title: 'Documentation & Legal Aid',
      desc: 'Receive comprehensive support in preparing and submitting all necessary property-related documents, ensuring a smooth and legally sound process.',
      icon: FileText,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 py-16 sm:py-20 md:py-24">
      {/* Edge-to-edge container with responsive padding */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 xl:px-24 space-y-16 sm:space-y-20">

        {/* ── Hero Section ───────────────────────────────────────────────────── */}
        <header className="text-center space-y-6 px-4">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight drop-shadow-md">
            Our <span className="text-blue-600">Comprehensive Services</span>
          </h1>
          <p className="text-gray-700 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed">
            Empowering your real estate journey with unparalleled support and expertise at every step.
          </p>
        </header>

        {/* ── Services Grid ──────────────────────────────────────────────── */}
        <section className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 transform transition-transform duration-300 hover:scale-[1.005]">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-8 inline-block">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-blue-600 mb-4">
                  <service.icon size={48} strokeWidth={1.5} /> {/* Dynamic Lucide Icon */}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Our Extensive Reach ───────────────────────────────────────── */}
        <section className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 transform transition-transform duration-300 hover:scale-[1.005]">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-8 inline-block">Our Extensive Reach</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
            <div className="text-blue-600 flex-shrink-0 mb-4 md:mb-0">
              <Globe size={80} strokeWidth={1.5} />
            </div>
            <div className="space-y-4">
              <p className="text-gray-800 leading-relaxed text-lg">
                PixieNest BuildWell proudly operates in **18 key locations** across the country, ensuring comprehensive coverage and local expertise wherever you are.
              </p>
              <p className="text-gray-800 leading-relaxed text-lg">
                Our operations extend significantly across **Delhi NCR** and also cater to clients in various regions **outside NCR**, bringing our trusted services closer to you.
              </p>
            </div>
          </div>
        </section>

        {/* ── Call to Action ───────────────────────────────────────────────── */}
        <section className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl space-y-6 text-center border border-gray-100 transform transition-transform duration-300 hover:scale-[1.005]">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-4 inline-block">Ready to Begin Your Property Journey?</h2>
          <p className="text-gray-800 leading-relaxed text-lg max-w-3xl mx-auto">
            Connect with our team of dedicated professionals today to explore how we can assist you with your unique real estate needs. We're here to build your dreams.
          </p>
          <div className="pt-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <PhoneCall size={20} className="mr-2" /> Get in Touch
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}