import React, { useEffect, useState } from 'react';
import { initializeSendBirdUser } from '../Services/sendbirdInit';
import { SendBirdProvider, Channel, ChannelList, ChannelSettings } from '@sendbird/uikit-react';
import { useParams } from 'react-router-dom';  // Import useParams to get the URL parameters
import '@sendbird/uikit-react/dist/index.css';  // Ensure CSS is included

const ChatPage = () => {
  const { userId, userName } = useParams();  // Fetch userId and userName from URL params
  const [channelUrl, setChannelUrl] = useState('');  // This will store the selected channel URL

  useEffect(() => {
    if (userId && userName) {
      // Initialize SendBird when the component mounts with userId and userName from the URL
      initializeSendBirdUser(userId, userName);
    }
  }, [userId, userName]);  // Add userId and userName to the dependency array

  return (
    userId && (  // Ensure `userId` is set before rendering the provider
      <SendBirdProvider appId="9FD0F563-359A-4D98-8EE9-A2B548706773" userId={userId}>
        <div style={{ display: 'flex', height: '100vh' }}>
          {/* Channel List */}
          <div style={{ width: '30%' }}>
            <ChannelList
              onChannelSelect={(channel) => {
                console.log('Selected channel:', channel);
                setChannelUrl(channel?.url);  // Set the selected channel's URL dynamically
              }}
            />
          </div>

          {/* Chat Box */}
          <div style={{ width: '70%' }}>
            {channelUrl ? (
              <Channel channelUrl={channelUrl} />
            ) : (
              <div>Select a channel to start chatting</div>  // Display a message if no channel is selected
            )}
          </div>
        </div>

        {/* Channel Settings */}
        {channelUrl && <ChannelSettings channelUrl={channelUrl} />}
      </SendBirdProvider>
    )
  );
};

export default ChatPage;
