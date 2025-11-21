import { CampaignList } from '@/components/campaigns/CampaignList';
import { CreateCampaignButton } from '@/components/campaigns/CreateCampaignButton';
import { CampaignStats } from '@/components/campaigns/CampaignStats';

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Awareness Campaigns
          </h1>
          <p className="text-gray-600 mt-1">
            Manage national and regional health campaigns
          </p>
        </div>
        <CreateCampaignButton />
      </div>

      <CampaignStats />
      <CampaignList />
    </div>
  );
}
