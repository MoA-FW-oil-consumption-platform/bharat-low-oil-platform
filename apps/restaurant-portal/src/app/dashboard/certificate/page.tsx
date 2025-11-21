import { CertificateViewer } from '@/components/certificate/CertificateViewer';
import { DownloadButton } from '@/components/certificate/DownloadButton';
import { ShareButton } from '@/components/certificate/ShareButton';

export default function CertificatePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Your Certificate
          </h1>
          <p className="text-gray-600 mt-1">
            View and share your low-oil certification
          </p>
        </div>
        <div className="flex space-x-3">
          <DownloadButton />
          <ShareButton />
        </div>
      </div>

      <CertificateViewer />
    </div>
  );
}
