import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, Pencil } from "lucide-react";
import { contentStrategyApi } from "@/utils/api";
import { showToastAlert } from "@/components/ui/toast-alert";

// Define the Channel type
type ChannelStatus = "cannot_use" | "currently_using" | "interested_in_using" | "not_interested_in_using";

interface Channel {
  id: string;
  name: string;
  status: ChannelStatus;
}

interface DistributionTabContentProps {
  channels: Channel[];
  setChannels: (channels: Channel[]) => void;
  isEditing: boolean;
  isLoading?: boolean;
}

export const DistributionTabContent: React.FC<DistributionTabContentProps> = ({
  channels,
  setChannels,
  isEditing,
  isLoading = false
}) => {
  const [previousChannels, setPreviousChannels] = useState(channels);

  // Save changes only when editing is turned off and changes were made
  useEffect(() => {
    if (!isEditing && JSON.stringify(channels) !== JSON.stringify(previousChannels)) {
      handleSave();
      setPreviousChannels(channels);
    }
  }, [isEditing]);

  const handleSave = async () => {
    try {
      await contentStrategyApi.updateDistribution({
        channels: channels
      });
      showToastAlert('Distribution channels updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating distribution channels:', error);
      showToastAlert('Error updating distribution channels. Please try again.', 'error');
    }
  };

  const handleStatusChange = (channelId: string, newStatus: ChannelStatus) => {
    const updatedChannels = channels.map(channel =>
      channel.id === channelId ? { ...channel, status: newStatus } : channel
    );
    setChannels(updatedChannels);
  };

  // Group channels by background color for zebra striping
  const renderChannel = (channel: Channel, index: number) => {
    const isEvenRow = index % 2 === 0;
    
    return (
      <div 
        key={channel.id} 
        className={`grid grid-cols-5 py-4 ${isEvenRow ? 'bg-gray-100' : 'bg-white'}`}
      >
        <div className="pl-4 font-medium text-gray-700 flex items-center">
          {channel.name}
        </div>
        
        <div className="flex justify-center items-center">
          <RadioGroup
            value={channel.status}
            onValueChange={(value) => handleStatusChange(channel.id, value as ChannelStatus)}
            className="flex items-center"
            disabled={!isEditing}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="cannot_use" 
                id={`${channel.id}-cannot_use`} 
                className="text-brand-primary border-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
              />
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-center items-center">
          <RadioGroup
            value={channel.status}
            onValueChange={(value) => handleStatusChange(channel.id, value as ChannelStatus)}
            className="flex items-center"
            disabled={!isEditing}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="currently_using" 
                id={`${channel.id}-currently_using`} 
                className="text-brand-primary border-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
              />
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-center items-center">
          <RadioGroup
            value={channel.status}
            onValueChange={(value) => handleStatusChange(channel.id, value as ChannelStatus)}
            className="flex items-center"
            disabled={!isEditing}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="interested_in_using" 
                id={`${channel.id}-interested_in_using`} 
                className="text-brand-primary border-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
              />
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-center items-center">
          <RadioGroup
            value={channel.status}
            onValueChange={(value) => handleStatusChange(channel.id, value as ChannelStatus)}
            className="flex items-center"
            disabled={!isEditing}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="not_interested_in_using" 
                id={`${channel.id}-not_interested_in_using`} 
                className="text-brand-primary border-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
              />
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                <CardContent className="p-0">
                  <div className="flex justify-between items-center p-4 bg-blue-50 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Distribution Channels</h2>
                  </div>

                  <div className="grid grid-cols-5 py-4 bg-white border-b border-gray-200">
                    <div className="pl-4 font-semibold text-gray-700">
                      CHANNELS
                    </div>
                    <div className="text-center font-semibold text-gray-700">
                      CANNOT USE
                    </div>
                    <div className="text-center font-semibold text-gray-700">
                      CURRENTLY<br />USING
                    </div>
                    <div className="text-center font-semibold text-gray-700">
                      INTERESTED IN<br />USING
                    </div>
                    <div className="text-center font-semibold text-gray-700">
                      NOT INTERESTED<br />IN USING
                    </div>
                  </div>
                  
                  {channels.map((channel, index) => renderChannel(channel, index))}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
