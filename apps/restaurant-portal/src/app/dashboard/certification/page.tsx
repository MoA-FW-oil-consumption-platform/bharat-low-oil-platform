import { CertificationForm } from '@/components/certification/CertificationForm';
import { CertificationHistory } from '@/components/certification/CertificationHistory';
import { CertificationBenefits } from '@/components/certification/CertificationBenefits';

export default function CertificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Low-Oil Certification
        </h1>
        <p className="text-gray-600 mt-1">
          Apply for government certification and increase visibility
        </p>
      </div>

      <CertificationBenefits />
      <CertificationForm />
      <CertificationHistory />
    </div>
  );
}
