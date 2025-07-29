# Gather.Town Clone with Video Conferencing

A virtual office space where users can move around a 2D map and participate in video conferences with other players in the same room.

## Features

- **2D Virtual Map**: Users can move around using WASD keys
- **Multiplayer Support**: Real-time movement synchronization
- **Video Conferencing**: Click the "Start Call" button to initiate a video conference with all players currently in the map
- **Room Management**: Create and join rooms with password protection
- **User Authentication**: Login/signup system

## Video Conferencing Implementation

The video conferencing feature uses **mediasoup** for WebRTC handling and includes:

### Server-Side (Node.js + Socket.IO + mediasoup)
- **Transport Management**: Creates WebRTC transports for each client
- **Producer/Consumer Handling**: Manages audio/video streams
- **Room Management**: Tracks active video call rooms
- **Resource Cleanup**: Properly closes transports, producers, and consumers

### Client-Side (React + Socket.IO)
- **Video Conference Component**: Modal interface for video calls
- **WebRTC Integration**: Handles local and remote streams
- **Call Controls**: Start/end call functionality
- **Real-time Updates**: Automatic connection to new participants

## How to Use Video Conferencing

1. **Join the Map**: Navigate to the game page and move around the 2D map
2. **Start Call**: Click the green "📞 Start Call" button in the top-right corner
3. **Join Conference**: All players currently in the map will automatically join the video conference
4. **Video Interface**: A modal will open showing:
   - Your local video feed
   - Remote video feeds from other participants
   - Call controls (End Call, Close)
5. **End Call**: Click "End Call" to terminate the conference for all participants

## Technical Details

### Mediasoup Configuration
- **Worker Settings**: Configured for optimal performance
- **Media Codecs**: Supports VP8 video and Opus audio
- **Transport**: WebRTC transport with UDP/TCP support

### Socket Events
- `startCall`: Initiates a video conference
- `joinCall`: Joins an existing call room
- `connectTransport`: Establishes WebRTC transport connection
- `produce`: Creates media producers
- `consume`: Creates media consumers
- `resumeConsumer`: Resumes paused consumers
- `endCall`: Terminates the video conference

### File Structure
```
server/
├── serverr.js          # Main server with Socket.IO and mediasoup
├── mediasoup-config.js # Mediasoup worker and router configuration
└── ...

client/src/screen/
├── game.jsx           # Main game with call button
├── VideoConference.jsx # Video conference modal component
└── ...
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   # Server
   cd server
   npm install

   # Client
   cd client
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the server directory:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```

3. **Start the Application**:
   ```bash
   # Start server
   cd server
   npm start

   # Start client (in another terminal)
   cd client
   npm run dev
   ```

4. **Access the Application**:
   - Open `http://localhost:5173` in your browser
   - Create an account or login
   - Create or join a room
   - Navigate to the game map
   - Click "Start Call" to begin video conferencing

## Browser Requirements

- Modern browser with WebRTC support
- Camera and microphone permissions
- HTTPS required for production (WebRTC requirement)

## Troubleshooting

- **Camera/Microphone Access**: Ensure browser permissions are granted
- **Connection Issues**: Check firewall settings and network connectivity
- **Video Not Showing**: Verify camera is not being used by another application
- **Audio Issues**: Check microphone permissions and system audio settings

## Future Enhancements

- Screen sharing functionality
- Chat during video calls
- Recording capabilities
- Virtual backgrounds
- Breakout rooms
- Call quality indicators 