import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../Context/Socketprovide';

const VideoConference = ({ isOpen, onClose, roomId }) => {
    const socket = useSocket();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    
    const localVideoRef = useRef(null);
    const localStreamRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !roomId) return;

        const initializeCall = async () => {
            try {
                // Get user media
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                
                setLocalStream(stream);
                localStreamRef.current = stream;
                
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Join the call room
                socket.emit('joinCall', roomId, async (response) => {
                    if (response.success) {
                        console.log('Joined call successfully');
                        // Connect transport first
                        await connectTransport(response.transportOptions);
                    } else {
                        setError(response.error);
                    }
                });

            } catch (err) {
                console.error('Error accessing media devices:', err);
                setError('Could not access camera/microphone');
            }
        };

        initializeCall();

        // Socket event listeners
        socket.on('callStarted', handleCallStarted);
        socket.on('callEnded', handleCallEnded);
        socket.on('newProducer', handleNewProducer);

        return () => {
            socket.off('callStarted');
            socket.off('callEnded');
            socket.off('newProducer');
            cleanup();
        };
    }, [isOpen, roomId]);

    const connectTransport = async (transportOptions) => {
        try {
            socket.emit('connectTransport', transportOptions.id, transportOptions.dtlsParameters, (response) => {
                if (response.success) {
                    console.log('Transport connected successfully');
                    setIsConnected(true);
                    // Start producing tracks after transport is connected
                    produceTracks(transportOptions.id);
                } else {
                    setError(response.error);
                }
            });
        } catch (err) {
            console.error('Error connecting transport:', err);
            setError('Failed to connect transport');
        }
    };

    const produceTracks = async (transportId) => {
        try {
            if (!localStreamRef.current) return;

            const tracks = localStreamRef.current.getTracks();
            
            for (const track of tracks) {
                const params = {
                    track: track,
                    encodings: [
                        { maxBitrate: 100000, scalabilityMode: 'S1T3' }
                    ],
                    codecOptions: {
                        videoGoogleStartBitrate: 1000
                    }
                };

                socket.emit('produce', transportId, track.kind, params, (response) => {
                    if (response.success) {
                        console.log('Producer created:', response.producerId);
                    } else {
                        console.error('Failed to create producer:', response.error);
                    }
                });
            }
        } catch (err) {
            console.error('Error producing tracks:', err);
        }
    };

    const handleCallStarted = (data) => {
        console.log('Call started:', data);
    };

    const handleCallEnded = (data) => {
        console.log('Call ended:', data);
        cleanup();
        onClose();
    };

    const handleNewProducer = async (data) => {
        try {
            console.log('New producer available:', data);
            
            // Create consumer for the new producer
            socket.emit('consume', data.producerId, (response) => {
                if (response.success) {
                    console.log('Consumer created:', response.consumerId);
                    
                    // Create a new MediaStream for this consumer
                    const stream = new MediaStream();
                    
                    // Add the track to the stream
                    const track = new MediaStreamTrack();
                    stream.addTrack(track);
                    
                    setRemoteStreams(prev => new Map(prev.set(response.consumerId, stream)));
                    
                    // Resume the consumer
                    socket.emit('resumeConsumer', response.consumerId, (resumeResponse) => {
                        if (resumeResponse.success) {
                            console.log('Consumer resumed successfully');
                        }
                    });
                } else {
                    console.error('Failed to create consumer:', response.error);
                }
            });
        } catch (err) {
            console.error('Error handling new producer:', err);
        }
    };

    const cleanup = () => {
        // Stop local stream
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }

        // Clear remote streams
        setRemoteStreams(new Map());
        setIsConnected(false);
    };

    const endCall = () => {
        socket.emit('endCall', roomId);
        cleanup();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-indigo-950 rounded-lg p-6 max-w-4xl w-full max-h-full overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Video Conference</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={endCall}
                            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            End Call
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Local video */}
                    <div className="relative">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-48 object-cover rounded-lg bg-gray-800"
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                            You
                        </div>
                    </div>

                    {/* Remote videos */}
                    {Array.from(remoteStreams.values()).map((stream, index) => (
                        <div key={index} className="relative">
                            <video
                                autoPlay
                                playsInline
                                className="w-full h-48 object-cover rounded-lg bg-gray-800"
                                ref={(el) => {
                                    if (el) el.srcObject = stream;
                                }}
                            />
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                Participant {index + 1}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-center">
                    <p className="text-white">
                        {isConnected ? 'Connected to video call' : 'Connecting...'}
                    </p>
                    <p className="text-white text-sm mt-2">
                        Participants: {remoteStreams.size + 1}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VideoConference; 