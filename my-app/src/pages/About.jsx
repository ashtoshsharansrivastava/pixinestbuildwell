import React from 'react';

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-16 sm:py-20 md:py-24">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 xl:px-24 space-y-16 sm:space-y-20">

        {/* ── Hero Section ─────────────────────────────────── */}
        <section className="text-center bg-gradient-to-b from-white via-blue-50 to-white rounded-2xl p-12 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
              About <span className="text-blue-600">PNBW Officials</span>
            </h1>
            <div className="mt-6 mb-8 w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
            <p className="text-gray-700 text-xl sm:text-2xl max-w-3xl mx-auto">
              Building trust, delivering dreams—your partner in real estate excellence.
            </p>
          </div>
        </section>

        {/* ── Our Story (UPDATED) ────────────────────────────────── */}
        <section className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8 items-start">
            <div className="lg:col-span-1">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight border-l-4 border-blue-600 pl-6">
                Our
                <br />
                Story
              </h2>
            </div>
            
            <div className="lg:col-span-2 space-y-5">
              <p className="text-gray-800 leading-relaxed text-lg">
                <strong>PixieNest BuildWell Pvt Ltd</strong>, operating as PNBW Officials, was founded on <strong>February 12, 2018</strong>, by visionary founder, <strong>Mr. Hans Raj Singh</strong>. His journey began with a passion to revolutionize the real estate landscape in India, making property transactions transparent, accessible, and truly rewarding for everyone involved.
              </p>
              <p className="text-gray-800 leading-relaxed text-lg">
                What started as a commitment to redefine real estate has blossomed into a trusted platform, connecting countless individuals with their ideal properties and empowering partners across the nation. We blend cutting-edge technology with deep industry expertise, ensuring a seamless experience from your first search to the final handshake.
              </p>
            </div>
          </div>
        </section>

        {/* ── Our Vision ───────────────────────────────────────── */}
        <section className="bg-white p-8 sm:p-10 rounded-xl shadow-lg space-y-8 border border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 border-b-2 border-blue-500 pb-3 mb-4">Our Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vision Point 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Empowering Earning Opportunities</h3>
              <p className="text-gray-700">
                To help as many individuals as possible achieve financial growth through real estate.
              </p>
            </div>
            {/* Vision Point 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 18.7c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/><circle cx="12" cy="12" r="3"/><path d="M12 22v-2"/><path d="M12 2h-0.01"/><path d="M19 12h2"/><path d="M3 12h2"/><path d="M17 17l1.41 1.41"/><path d="M6.59 6.59L8 8"/><path d="M17 7l1.41-1.41"/><path d="M6.59 17.41L8 16"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prime Locations for Everyone</h3>
              <p className="text-gray-700">
                To provide access to the best properties in prime locations across the entire country.
              </p>
            </div>
            {/* Vision Point 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.5.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.3-.6h4.4c1.3 0 2.4-.7 2.4-2.7V5c0-1.3-.8-2.4-2.4-2.4H7.6C6.7 2.6 6 3.4 6 4.4V12c0 1.3.8 2.4 2.4 2.4h2.6"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Strong Channel Partner Network</h3>
              <p className="text-gray-700">
                To cultivate and build a robust network of reliable Channel Partners nationwide.
              </p>
            </div>
            {/* Vision Point 4 */}
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Optimal Investor Returns</h3>
              <p className="text-gray-700">
                To ensure investors receive the best possible returns in the shortest feasible time.
              </p>
            </div>
            {/* Vision Point 5 */}
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="7" r="4"/><path d="M22 21a8 8 0 0 0-16 0"/><circle cx="14" cy="7" r="4"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Honesty & Teamwork</h3>
              <p className="text-gray-700">
                To advance with unwavering honesty, fostering a collaborative team spirit with everyone.
              </p>
            </div>
            {/* Vision Point 6 */}
            <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real Estate as Trust</h3>
              <p className="text-gray-700">
                To deliver real estate as a symbol of earning and trust, combating fraud and deceit in the industry.
              </p>
            </div>
          </div>
        </section>

        {/* ── What Makes Us Different ───────────────────────────────── */}
        <section className="bg-white p-8 sm:p-10 rounded-xl shadow-lg space-y-6 border border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 border-b-2 border-blue-500 pb-3 mb-4">What Makes Us Different</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-800 text-lg">
            <li>
              <strong>Verified Listings:</strong> Every property is personally
              vetted by our in-house team to ensure authenticity and quality.
            </li>
            <li>
              <strong>Transparent Pricing:</strong> No hidden fees or surprises—what you see
              is precisely what you pay, fostering complete trust.
            </li>
            <li>
              <strong>Expert Support:</strong> Our dedicated local brokers and
              customer-success managers provide personalized guidance from your initial inquiry to closing the deal.
            </li>
            <li>
              <strong>Advanced Search:</strong> Utilize powerful filters by school districts,
              commute times, essential amenities, property types, and much more, to find your perfect match.
            </li>
            <li>
              <strong>Community Focus:</strong> We are committed to giving back; a significant portion of every
              transaction is proudly donated to affordable-housing projects, building stronger communities.
            </li>
          </ul>
        </section>

        {/* ── Meet the Founder (REDESIGNED) ────────────────────────────────── */}
        <section className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg space-y-8 border border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 border-b-2 border-blue-500 pb-3 mb-4">Meet the Founder</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            {/* Founder Image */}
            <div className="md:col-span-1 flex justify-center">
              <img 
                src="/images/hansraj.jpg" 
                alt="Mr. Hans Raj Singh, Founder & CEO" 
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-2xl border-4 border-white"
              />
            </div>
            {/* Founder Bio */}
            <div className="md:col-span-2 text-center md:text-left">
              <h3 className="text-4xl font-bold text-gray-900">Mr. Hans Raj Singh</h3>
              <p className="text-blue-600 text-xl font-semibold mt-1">Founder & CEO</p>
              <div className="mt-4 w-20 h-1 bg-blue-600 mx-auto md:mx-0 rounded-full" />
              <p className="text-gray-700 mt-6 text-lg leading-relaxed">
                A seasoned real estate veteran with over two decades of experience, Mr. Singh brings unparalleled strategic vision and a deep understanding of market dynamics to PNBW Officials. His leadership is the cornerstone of our commitment to integrity and client success.
              </p>
            </div>
          </div>
        </section>

        {/* ── Join Us ───────────────────────────────────────────────── */}
        <section className="bg-white p-8 sm:p-10 rounded-xl shadow-lg space-y-6 text-center border border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 border-b-2 border-blue-500 pb-3 mb-4">Join Us on This Journey</h2>
          <p className="text-gray-800 leading-relaxed text-lg max-w-3xl mx-auto">
            Whether you’re a first-time homebuyer, an experienced investor, or a valued channel partner, PNBW Officials is designed to unlock your next opportunity. Explore our curated listings, connect with top agents, or reach out directly to discover how we can empower your real estate aspirations.
          </p>
          <div className="pt-4">
            <a
              href="/contact"
              className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Contact&nbsp;Us Today
            </a>
          </div>
        </section>
        
      </div>
    </main>
  );
}