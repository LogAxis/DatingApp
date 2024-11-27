import React from 'react';
import { CometChatUsers } from '@cometchat-pro/react-ui-kit'; // Import CometChatUsers component from UI Kit

const UserList = ({ onSelectUser }) => {
  return (
    <div style={{ width: '300px' }}>
      {/* Render CometChatUsers which handles user fetching automatically */}
      <CometChatUsers onUserClick={onSelectUser} />
    </div>
  );
};

export default UserList;
