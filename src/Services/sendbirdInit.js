import SendBird from 'sendbird';

// Initialize SendBird instance with your application ID
const sb = new SendBird({ appId: '9FD0F563-359A-4D98-8EE9-A2B548706773' }); // Replace with your actual SendBird App ID

/**
 * Initialize the user in SendBird.
 * @param {string} userId - The user's unique ID.
 * @param {string} nickname - The user's nickname.
 * @param {string} profileImageUrl - URL of the user's profile image.
 * @returns {Promise} Resolves with the connected user or rejects with an error.
 */
export const initializeSendBirdUser = (userId, nickname, profileImageUrl) => {
    return new Promise((resolve, reject) => {
        const userIdStr = userId.toString(); // Ensure userId is a string
        console.log('Connecting user with ID:', userIdStr);

        sb.connect(userIdStr, (user, error) => {
            if (error) {
                console.error('SendBird connection failed:', error);
                reject(error);
                return;
            }

            console.log('Connected with Nickname:', nickname);

            // Optionally update user info (nickname and profile image)
            sb.updateCurrentUserInfo(nickname, profileImageUrl, (response, err) => {
                if (err) {
                    console.error('Failed to update user info:', err);
                    reject(err);
                } else {
                    console.log('User info updated successfully:', response);
                    resolve(user);
                }
            });
        });
    });
};

/**
 * Create or retrieve a one-on-one chat channel.
 * @param {string} userId1 - The first user's ID.
 * @param {string} userId2 - The second user's ID.
 * @returns {Promise} Resolves with the created or existing channel.
 */
export const createChatChannel = (userId1, userId2) => {
    return new Promise((resolve, reject) => {
        const channelParams = new sb.GroupChannelParams();
        channelParams.isDistinct = true; // Use distinct channels for one-on-one chat
        channelParams.addUserIds([userId1, userId2]);

        sb.GroupChannel.createChannel(channelParams, (channel, error) => {
            if (error) {
                console.error('Channel creation failed:', error);
                reject(error);
            } else {
                console.log('Chat channel created:', channel.url);
                resolve(channel);
            }
        });
    });
};

/**
 * Fetch all past chats for the current user.
 * @returns {Promise} Resolves with a list of group channels.
 */
export const fetchPastChats = () => {
    return new Promise((resolve, reject) => {
        const query = sb.GroupChannel.createMyGroupChannelListQuery();
        query.includeEmpty = false; // Exclude empty channels
        query.limit = 20; // Limit the number of channels retrieved

        query.next((channels, error) => {
            if (error) {
                console.error('Failed to fetch past chats:', error);
                reject(error);
            } else {
                console.log('Fetched past chats:', channels);
                resolve(channels);
            }
        });
    });
};

export default sb;
