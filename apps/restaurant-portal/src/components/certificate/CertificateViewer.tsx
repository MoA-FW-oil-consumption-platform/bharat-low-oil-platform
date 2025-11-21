'use client';

import { QRCodeSVG } from 'qrcode.react';

export function CertificateViewer() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-500 max-w-4xl mx-auto">
      {/* Certificate Design */}
      <div className="text-center space-y-6">
        <div className="flex justify-center items-center space-x-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🇮🇳</span>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900">Government of India</h1>
            <p className="text-sm text-gray-600">Ministry of Health & Family Welfare</p>
          </div>
        </div>

        <div className="border-t-2 border-b-2 border-green-500 py-6">
          <h2 className="text-3xl font-bold text-green-700 mb-2">
            LOW-OIL CERTIFICATION
          </h2>
          <p className="text-gray-600">This certifies that</p>
          <h3 className="text-2xl font-bold text-gray-900 my-3">
            Green Leaf Restaurant
          </h3>
          <p className="text-gray-600">Mumbai, Maharashtra</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-700">
            has been certified for maintaining low-oil cooking standards
            in accordance with ICMR dietary guidelines
          </p>
          <div className="flex justify-center items-center space-x-8 mt-4">
            <div>
              <p className="text-gray-600">Certificate ID</p>
              <p className="font-bold text-gray-900">#LOC-2024-12345</p>
            </div>
            <div>
              <p className="text-gray-600">Level</p>
              <p className="font-bold text-green-600">Gold</p>
            </div>
            <div>
              <p className="text-gray-600">Valid Until</p>
              <p className="font-bold text-gray-900">Dec 31, 2025</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <QRCodeSVG
            value="https://bharatlowoil.gov.in/verify/LOC-2024-12345"
            size={120}
            level="H"
          />
        </div>

        <div className="text-xs text-gray-500">
          <p>Scan QR code to verify authenticity on blockchain</p>
          <p className="mt-1">Issued on: January 1, 2025</p>
        </div>
      </div>
    </div>
  );
}
