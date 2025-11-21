'use client';

import { Award, CheckCircle } from 'lucide-react';

export function CertificationStatus() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Certification Status
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <Award className="w-10 h-10 text-green-600 mr-3" />
            <div>
              <p className="font-semibold text-green-900">
                Low-Oil Certified
              </p>
              <p className="text-sm text-green-700">Certificate ID: #LOC-2024-12345</p>
            </div>
          </div>
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Issue Date:</span>
            <span className="font-medium">Jan 1, 2025</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Expiry Date:</span>
            <span className="font-medium">Dec 31, 2025</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Certification Level:</span>
            <span className="font-medium text-green-600">Gold</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Compliance:</span>
            <span className="font-medium">92%</span>
          </div>
        </div>

        <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          View Certificate
        </button>
      </div>
    </div>
  );
}
