import React, { useState } from 'react';
import {
  FileText,
  Users,
  Bell,
  Phone,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  BarChart2,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { StatsOverview } from '../types.ts';
import barangayHallImg from '../assets/images/4bafadd7-9cc1-4a66-84be-729df7b21bfa.jpg';
import barangaySealImg from '../assets/images/barangay_seal_logo_1792164527116.jpg';
import { RESIDENT_DEFAULT_IMG, onSealError, onResidentError } from '../constants/assets.ts';

interface Props {
  onOpenAuth: (mode?: 'signin' | 'register' | 'split') => void;
  onSelectService: (service: 'document' | 'report' | 'announcements') => void;
  onEnterPortal?: () => void;
  stats: StatsOverview;
}

export const LandingPage: React.FC<Props> = ({
  onOpenAuth,
  onSelectService,
  onEnterPortal,
  stats,
}) => {
  const [activeFeature, setActiveFeature] = useState<number>(1);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [activeFilterPill, setActiveFilterPill] = useState<string>('services');

  const featuredServices = [
    {
      id: 'srv-1',
      title: 'Barangay Clearance & Certification',
      subtitle: 'Issued for employment, IDs, postal, and business permits',
      fee: '₱50.00 / Free Indigent',
      badge: 'Rapid Issuance',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      image: barangayHallImg,
      category: 'Document Issuance',
      actionKey: 'document' as const,
    },
    {
      id: 'srv-2',
      title: 'Libreng Tuli & Medical Mission',
      subtitle: 'Free minor surgery & medical assistance for San Juan youth',
      fee: '100% Free Service',
      badge: 'Upcoming Event',
      badgeColor: 'bg-amber-100 text-amber-800',
      image: barangayHallImg,
      category: 'Community Welfare',
      actionKey: 'announcements' as const,
    },
    {
      id: 'srv-3',
      title: 'Certificate of Indigency & Residency',
      subtitle: 'Official municipal endorsement for scholarships & hospital aid',
      fee: 'Free of Charge',
      badge: 'Social Welfare',
      badgeColor: 'bg-purple-100 text-purple-800',
      image: barangayHallImg,
      category: 'Civic Records',
      actionKey: 'document' as const,
    },
  ];

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % (featuredServices.length - 2));
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? featuredServices.length - 3 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-[#0084ff] text-slate-900 flex flex-col font-mono selection:bg-[#d7e635] selection:text-slate-950">
      {/* 1. TOP FLOATING NAVIGATION BAR (Old Palette: Light Grey #d7d8dc with Yellow #d7e635 Button) */}
      <header className="fixed top-5 inset-x-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto bg-[#d7d8dc]/95 backdrop-blur-md border border-white/60 shadow-xl rounded-full py-2.5 px-5 sm:px-7 flex items-center gap-4 sm:gap-7 text-xs sm:text-sm font-bold text-slate-900">
          <a
            href="#home"
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            Home
          </a>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <a
            href="#services"
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            Services
          </a>

          {/* Center Circular Official Seal Badge */}
          <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-600 border-2 border-white shadow-md shrink-0">
            <img
              src={barangaySealImg}
              onError={onSealError}
              alt="Barangay Seal"
              className="w-full h-full object-cover"
            />
          </div>

          <a
            href="#insights"
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            Programs
          </a>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <a
            href="#contact"
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            Contact
          </a>

          {/* Yellow Action Button (From Old Design: #d7e635) */}
          <button
            onClick={onEnterPortal || (() => onOpenAuth('signin'))}
            className="ml-1 sm:ml-2 px-4 py-1.5 bg-[#d7e635] hover:bg-[#c9d82a] text-slate-950 text-xs font-bold rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION WITH VIBRANT BLUE CANVAS & BARANGAY HALL ARCHITECTURAL SHOWCASE */}
      <section id="home" className="relative pt-32 pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          
          {/* Main Hero Headline (White text on Blue) */}
          <div className="text-center max-w-4xl mx-auto pt-4 sm:pt-6 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 text-white text-xs mb-4 backdrop-blur-xs border border-white/30 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#d7e635]" />
              <span>Barangay San Juan, Licab, Nueva Ecija</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.12] drop-shadow-sm">
              Empowering Barangay San Juan Through <br />
              Digital <span className="font-serif-italic font-normal underline decoration-[#d7e635] decoration-4 underline-offset-8">Transformation</span>
            </h1>

            {/* Centered Yellow CTA Pill Button (Old Palette: #d7e635) */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => onOpenAuth('split')}
                className="px-8 py-3.5 bg-[#d7e635] hover:bg-[#c9d82a] text-slate-950 font-bold text-xs sm:text-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={onEnterPortal || (() => onOpenAuth('signin'))}
                className="px-6 py-3.5 bg-white/90 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm rounded-full shadow-md transition-all cursor-pointer"
              >
                Access Portal
              </button>
            </div>
          </div>

          {/* Architectural Showcase Frame with Barangay Hall Building Photo */}
          <div className="relative mt-8 sm:mt-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 bg-slate-900">
            <div className="relative h-[360px] sm:h-[480px] md:h-[520px] w-full">
              <img
                src={barangayHallImg}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== '/4bafadd7-9cc1-4a66-84be-729df7b21bfa.jpg' && !target.src.includes('4bafadd7-9cc1-4a66-84be-729df7b21bfa')) {
                    target.src = '/4bafadd7-9cc1-4a66-84be-729df7b21bfa.jpg';
                  }
                }}
                alt="Barangay San Juan Multi Purpose Hall, Licab"
                className="w-full h-full object-cover object-center filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

              {/* FLOATING CARD 1 (LEFT): Population & Registered Voters Donut Chart in Light Grey #cfd1d6 */}
              <div className="absolute top-6 left-6 sm:top-10 sm:left-10 bg-[#cfd1d6]/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-300 w-52 sm:w-56 transition-transform hover:scale-105 duration-300">
                <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
                  <span className="font-bold text-slate-900">Population Stats</span>
                  <span className="text-slate-500 font-bold">•••</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Circular Radial Donut Graph Representation */}
                  <div className="relative w-16 h-16 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        className="stroke-[#3a4be3]"
                        strokeWidth="4"
                        strokeDasharray="62, 100"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        className="stroke-[#d7e635]"
                        strokeWidth="4"
                        strokeDasharray="25, 100"
                        strokeDashoffset="-62"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        className="stroke-cyan-500"
                        strokeWidth="4"
                        strokeDasharray="13, 100"
                        strokeDashoffset="-87"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-bold text-xs text-slate-900 leading-none tabular-nums">
                        {(stats?.totalPopulation ?? 0).toLocaleString()}
                      </span>
                      <span className="text-[8px] text-slate-600 font-medium">Residents</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-1 text-[10px] text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#3a4be3] shrink-0" />
                      <span className="font-bold text-slate-900">75%</span>
                      <span>Voters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#d7e635] shrink-0" />
                      <span className="font-bold text-slate-900">18%</span>
                      <span>Youth</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                      <span className="font-bold text-slate-900">7%</span>
                      <span>Children</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING CARD 2 (RIGHT): Municipal Officer & Services Tracker in Light Grey #cfd1d6 */}
              <div className="hidden sm:block absolute top-12 right-6 sm:top-16 sm:right-10 bg-[#cfd1d6]/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-300 w-64 transition-transform hover:scale-105 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={RESIDENT_DEFAULT_IMG}
                      onError={onResidentError}
                      alt="Hon. Harold Jason M. Villaroman"
                      className="w-8 h-8 rounded-full object-cover border border-white shrink-0 bg-black"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">Hon. Harold Jason M. Villaroman</p>
                      <p className="text-[10px] text-slate-600">Punong Barangay</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-900 bg-white/70 px-2 py-0.5 rounded">7 Puroks</span>
                </div>

                {/* Progress bar indicator */}
                <div className="flex items-center gap-0.5 h-3 my-2">
                  {[...Array(24)].map((_, i) => (
                    <span
                      key={i}
                      className={`h-full w-1 rounded-xs ${
                        i < 18 ? 'bg-[#3a4be3]' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-700 pt-1 border-t border-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3a4be3]" /> Released
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Pending
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {stats?.totalDocuments ?? 3} Inquiries
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: DATA-DRIVEN COMMUNITY INSIGHTS (Old Palette: Light Grey Containers on Vibrant Blue) */}
      <section id="insights" className="py-20 bg-[#0084ff]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Top Pill Badges */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveFilterPill('services')}
              className={`px-3.5 py-1 text-xs font-bold tracking-wider uppercase rounded-full transition-all cursor-pointer ${
                activeFilterPill === 'services'
                  ? 'bg-[#d7e635] text-slate-950 shadow-xs'
                  : 'bg-white/30 text-white'
              }`}
            >
              RESIDENT SERVICES
            </button>
            <button
              onClick={() => setActiveFilterPill('exclusive')}
              className={`px-3.5 py-1 text-xs font-bold tracking-wider uppercase rounded-full transition-all cursor-pointer ${
                activeFilterPill === 'exclusive'
                  ? 'bg-[#d7e635] text-slate-950 shadow-xs'
                  : 'bg-white/30 text-white'
              }`}
            >
              COMMUNITY WELFARE
            </button>
          </div>

          {/* Split Heading & Description (White on Blue) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
            <div className="lg:col-span-6">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Data-driven <br />
                barangay <span className="font-serif-italic font-normal underline decoration-[#d7e635] decoration-2 underline-offset-4">insights</span>
              </h2>
            </div>
            <div className="lg:col-span-6 lg:pt-2">
              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-lg">
                Our digital portal accelerates public services, civil clearances, and community welfare programs with transparent dashboards and real-time community records for Barangay San Juan, Licab.
              </p>
            </div>
          </div>

          {/* Feature Showcase Container: Left 3 Items + Right Chart Card in Light Grey #cfd1d6 */}
          <div className="bg-[#cfd1d6] rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: 01, 02 (Dark Active Card), 03 */}
              <div className="lg:col-span-6 space-y-4">
                {/* Item 01: Document Issuance & Verification */}
                <div
                  onClick={() => {
                    setActiveFeature(0);
                    onSelectService('document');
                  }}
                  className={`p-5 rounded-2xl transition-all cursor-pointer ${
                    activeFeature === 0
                      ? 'bg-[#002f54] text-white shadow-xl'
                      : 'bg-white/50 hover:bg-white/80 text-slate-900 border border-slate-300/80'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`text-xs font-bold ${
                        activeFeature === 0 ? 'text-[#d7e635]' : 'text-slate-500'
                      }`}
                    >
                      01
                    </span>
                    <h3 className="font-bold text-base">Document Issuance</h3>
                  </div>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      activeFeature === 0 ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Generate Barangay Clearance, Certificates of Indigency, and Residency in minutes. Verified with official control numbers and digital security seals.
                  </p>
                </div>

                {/* Item 02: Community Welfare & Health Programs */}
                <div
                  onClick={() => {
                    setActiveFeature(1);
                    onSelectService('announcements');
                  }}
                  className={`p-5 rounded-2xl transition-all cursor-pointer ${
                    activeFeature === 1
                      ? 'bg-[#002f54] text-white shadow-xl'
                      : 'bg-white/50 hover:bg-white/80 text-slate-900 border border-slate-300/80'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        activeFeature === 1 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-base">Community Welfare & Health</h3>
                  </div>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      activeFeature === 1 ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Direct access to municipal medical missions, Libreng Tuli schedules, and community livelihood support for San Juan families.
                  </p>
                </div>

                {/* Item 03: Community Welfare & Events */}
                <div
                  onClick={() => {
                    setActiveFeature(2);
                    onSelectService('announcements');
                  }}
                  className={`p-5 rounded-2xl transition-all cursor-pointer ${
                    activeFeature === 2
                      ? 'bg-[#002f54] text-white shadow-xl'
                      : 'bg-white/50 hover:bg-white/80 text-slate-900 border border-slate-300/80'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`text-xs font-bold ${
                        activeFeature === 2 ? 'text-[#d7e635]' : 'text-slate-500'
                      }`}
                    >
                      03
                    </span>
                    <h3 className="font-bold text-base">Community Welfare & Events</h3>
                  </div>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      activeFeature === 2 ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Track medical missions (e.g. Libreng Tuli), General Assemblies, relief drives, and emergency weather advisories with interactive comment threads.
                  </p>
                </div>
              </div>

              {/* Right Column: Service Volume Bar Chart Card in Clean White Card */}
              <div className="lg:col-span-6">
                <div className="relative rounded-3xl p-6 sm:p-8 bg-[#c6c8ce] border border-slate-300 shadow-inner flex items-center justify-center">
                  
                  {/* Floating White Service Metric Widget Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 w-full max-w-sm">
                    {/* Header with 3 dots */}
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                      <span className="font-bold text-slate-900">Monthly Services</span>
                      <span className="text-slate-400 font-bold">•••</span>
                    </div>

                    {/* Main Request Metric Value */}
                    <div className="mb-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
                        {activeFeature === 0 ? '1,437' : activeFeature === 1 ? '2,894' : '3,120'}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">Requests</span>
                    </div>

                    {/* Percentage Growth Indicator */}
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-6">
                      <span className="inline-flex items-center">↑ 18.4%</span>
                      <span className="text-slate-500 font-normal">faster turnaround</span>
                    </div>

                    {/* Bar Chart Container with Trendline */}
                    <div className="relative pt-6">
                      {/* Dotted Trendline SVG */}
                      <svg
                        className="absolute inset-x-0 top-0 w-full h-24 overflow-visible pointer-events-none"
                        viewBox="0 0 280 80"
                        fill="none"
                      >
                        <path
                          d="M 10 60 Q 50 55, 90 65 T 170 30 T 230 55 T 270 45"
                          stroke="#3a4be3"
                          strokeWidth="2.5"
                          strokeDasharray="4 4"
                          fill="none"
                        />
                      </svg>

                      {/* 7 Daily Bars */}
                      <div className="grid grid-cols-7 gap-2 items-end h-36 relative z-10">
                        {/* Mon */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-lg h-16 transition-colors" />
                          <span className="text-[10px] text-slate-500">Mon</span>
                        </div>
                        {/* Tue */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-lg h-20 transition-colors" />
                          <span className="text-[10px] text-slate-500">Tue</span>
                        </div>
                        {/* Wed */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-lg h-14 transition-colors" />
                          <span className="text-[10px] text-slate-500">Wed</span>
                        </div>
                        {/* Thu */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-lg h-24 transition-colors" />
                          <span className="text-[10px] text-slate-500">Thu</span>
                        </div>
                        {/* Fri (Highlighted with +20% Tooltip!) */}
                        <div className="flex flex-col items-center gap-2 relative">
                          <div className="absolute -top-6 px-1.5 py-0.5 bg-[#3a4be3] text-white rounded text-[9px] font-bold shadow-xs whitespace-nowrap">
                            +20%
                          </div>
                          <div className="w-full bg-[#3a4be3] rounded-t-lg h-32 shadow-md" />
                          <span className="text-[10px] font-bold text-blue-900">Fri</span>
                        </div>
                        {/* Sat */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-lg h-20 transition-colors" />
                          <span className="text-[10px] text-slate-500">Sat</span>
                        </div>
                        {/* Sun */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-lg h-24 transition-colors" />
                          <span className="text-[10px] text-slate-500">Sun</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: FEATURED COMMUNITY SERVICES (3 Cards in Light Grey #cfd1d6 with Yellow accents) */}
      <section id="services" className="py-20 bg-[#0084ff]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Centered Title (White on Blue) */}
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Featured <br />
              <span className="font-serif-italic font-normal underline decoration-[#d7e635] decoration-2 underline-offset-4">barangay services</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-3 max-w-md mx-auto">
              Each service below represents a direct digital channel for certificates, community safety, and resident welfare in San Juan.
            </p>
          </div>

          {/* 3 Featured Services Cards Grid in Light Grey #cfd1d6 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredServices.slice(carouselIndex, carouselIndex + 3).map((item) => (
              <div
                key={item.id}
                className="bg-[#cfd1d6] rounded-3xl overflow-hidden shadow-xl border border-slate-300 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
              >
                {/* Service Card Image with Status Badge */}
                <div className="relative h-56 overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== '/4bafadd7-9cc1-4a66-84be-729df7b21bfa.jpg' && !target.src.includes('4bafadd7-9cc1-4a66-84be-729df7b21bfa')) {
                        target.src = '/4bafadd7-9cc1-4a66-84be-729df7b21bfa.jpg';
                      }
                    }}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {item.badge && (
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Fee / Schedule & Action Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-300">
                    <span className="text-xs font-bold text-slate-900 tracking-tight">
                      {item.fee}
                    </span>
                    <button
                      onClick={() => onSelectService(item.actionKey)}
                      className="px-4 py-2 bg-[#3a4be3] hover:bg-[#2c3cc9] text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Arrows Bottom Controls (shown only when more than 3 items) */}
          {featuredServices.length > 3 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-white/60 bg-[#d7d8dc] hover:bg-white flex items-center justify-center text-slate-900 shadow-md transition-all cursor-pointer hover:scale-105"
                aria-label="Previous service"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-white/60 bg-[#d7d8dc] hover:bg-white flex items-center justify-center text-slate-900 shadow-md transition-all cursor-pointer hover:scale-105"
                aria-label="Next service"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. FOOTER (Old Palette: Light Grey #d7d8dc with Blue & Facebook icon) */}
      <footer id="contact" className="bg-[#d7d8dc] text-slate-800 py-6 px-6 border-t border-slate-300 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-600 border border-slate-400 flex items-center justify-center shrink-0">
              <img
                src={barangaySealImg}
                onError={onSealError}
                alt="Barangay Seal"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Pamahalaang Barangay San Juan</p>
              <p className="text-[11px] text-slate-600">Licab, Nueva Ecija · Hotline: 09944258953</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#home" className="hover:text-blue-700 transition-colors font-bold">Home</a>
            <a href="#insights" className="hover:text-blue-700 transition-colors font-bold">Programs</a>
            <a href="#services" className="hover:text-blue-700 transition-colors font-bold">Services</a>
            <button
              onClick={onEnterPortal || (() => onOpenAuth('signin'))}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors cursor-pointer"
            >
              Portal →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
