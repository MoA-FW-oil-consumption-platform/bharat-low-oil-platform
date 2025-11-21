'use client';

import { Award, TrendingUp, Users, Shield } from 'lucide-react';

export function CertificationBenefits() {
  const benefits = [
    {
      icon: Award,
      title: 'Government Recognition',
      description: 'Official certification from Ministry of Health',
    },
    {
      icon: TrendingUp,
      title: 'Increased Visibility',
      description: 'Featured in the national health app with 2.4M users',
    },
    {
      icon: Users,
      title: 'Health-Conscious Customers',
      description: 'Attract customers looking for healthy dining options',
    },
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Tamper-proof certificate stored on blockchain',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Benefits of Certification
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="flex items-start p-4 bg-gray-50 rounded-lg">
            <benefit.icon className="w-8 h-8 text-green-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">{benefit.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
