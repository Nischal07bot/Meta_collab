import React, { useEffect, useRef, useState } from 'react';
import * as mediasoupClient from 'mediasoup-client';

const VideoConference = ({ isOpen, onClose, socket }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    
    const localVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const deviceRef = useRef(null);
    const sendTransportRef = useRef(null);
    const recvTransportRef = useRef(null);
    const producersRef = useRef(new Map());
    const consumersRef = useRef(new Map());

    useEffect(() => {
        if (!isOpen || !socket) return;

        const initializeCall = async () => {
            try {
                setError(null);
                setPermissionDenied(false);
                
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

                // Initialize mediasoup device
                deviceRef.current = new mediasoupClient.Device();

                // Join the call
                socket.emit('joinCall', async (response) => {
                    if (response.success) {
                        console.log('Joined call successfully');
                        
                        // Load device with router capabilities
                        await deviceRef.current.load({ routerRtpCapabilities: response.rtpCapabilities });
                        
                        await createSendTransport(response.transportOptions);
                    } else {
                        setError(response.error);
                    }
                });

            } catch (err) {
                console.error('Error accessing media devices:', err);
                
                if (err.name === 'NotAllowedError') {
                    setPermissionDenied(true);
                    setError('Camera/microphone access was denied. Please allow access and try again.');
                } else if (err.name === 'NotFoundError') {
                    setError('No camera or microphone found. Please check your devices.');
                } else if (err.name === 'NotReadableError') {
                    setError('Camera or microphone is already in use by another application.');
                } else {
                    setError(`Could not access camera/microphone: ${err.message}`);
                }
            }
        };

        initializeCall();

        return () => {
            cleanup();
        };
    }, [isOpen, socket]);

    const createSendTransport = async (transportOptions) => {
        try {
            sendTransportRef.current = deviceRef.current.createSendTransport(transportOptions);

            sendTransportRef.current.on('connect', ({ dtlsParameters }, callback, errback) => {
                socket.emit('connectTransport', transportOptions.id, dtlsParameters, (response) => {
                    if (response.success) {
                        callback();
                    } else {
                        errback(new Error(response.error));
                    }
                });
            });

            sendTransportRef.current.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
                socket.emit('produce', transportOptions.id, kind, { rtpParameters }, (response) => {
                    if (response.success) {
                        callback({ id: response.producerId });
                    } else {
                        errback(new Error(response.error));
                    }
                });
            });

            // Produce tracks
            const tracks = localStreamRef.current.getTracks();
            for (const track of tracks) {
                const producer = await sendTransportRef.current.produce({ track });
                producersRef.current.set(producer.id, producer);
            }

            setIsConnected(true);

        } catch (err) {
            console.error('Error creating send transport:', err);
            setError('Failed to create transport');
        }
    };

    const createRecvTransport = async (transportOptions) => {
        try {
            recvTransportRef.current = deviceRef.current.createRecvTransport(transportOptions);

            recvTransportRef.current.on('connect', ({ dtlsParameters }, callback, errback) => {
                socket.emit('connectTransport', transportOptions.id, dtlsParameters, (response) => {
                    if (response.success) {
                        callback();
                    } else {
                        errback(new Error(response.error));
                    }
                });
            });

        } catch (err) {
            console.error('Error creating receive transport:', err);
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
            
            if (!recvTransportRef.current) {
                // Create receive transport if not exists
                socket.emit('joinCall', async (response) => {
                    if (response.success) {
                        await createRecvTransport(response.transportOptions);
                        await consumeProducer(data.producerId);
                    }
                });
            } else {
                await consumeProducer(data.producerId);
            }
        } catch (err) {
            console.error('Error handling new producer:', err);
        }
    };

    const consumeProducer = async (producerId) => {
        try {
            socket.emit('consume', producerId, async (response) => {
                if (response.success) {
                    const consumer = await recvTransportRef.current.consume({
                        id: response.consumerId,
                        producerId: response.producerId,
                        kind: response.kind,
                        rtpParameters: response.rtpParameters
                    });

                    consumersRef.current.set(consumer.id, consumer);

                    // Create a new MediaStream for the consumer
                    const stream = new MediaStream([consumer.track]);
                    setRemoteStreams(prev => new Map(prev.set(consumer.id, stream)));

                    // Resume the consumer
                    socket.emit('resumeConsumer', consumer.id, (resumeResponse) => {
                        if (resumeResponse.success) {
                            console.log('Consumer resumed successfully');
                        }
                    });
                } else {
                    console.error('Failed to create consumer:', response.error);
                }
            });
        } catch (err) {
            console.error('Error consuming producer:', err);
        }
    };

    const cleanup = () => {
        // Stop local stream tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        // Close producers
        producersRef.current.forEach(producer => producer.close());
        producersRef.current.clear();

        // Close consumers
        consumersRef.current.forEach(consumer => consumer.close());
        consumersRef.current.clear();

        // Close transports
        if (sendTransportRef.current) {
            sendTransportRef.current.close();
            sendTransportRef.current = null;
        }
        if (recvTransportRef.current) {
            recvTransportRef.current.close();
            recvTransportRef.current = null;
        }

        // Clear state
        setLocalStream(null);
        setRemoteStreams(new Map());
        setIsConnected(false);
    };

    const endCall = () => {
        socket.emit('endCall');
        cleanup();
        onClose();
    };

    const retryMediaAccess = async () => {
        try {
            setError(null);
            setPermissionDenied(false);
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            setLocalStream(stream);
            localStreamRef.current = stream;
            
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            
        } catch (err) {
            console.error('Retry failed:', err);
            setError('Still cannot access camera/microphone. Please check browser settings.');
        }
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
                    <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
                        <p className="font-semibold">Camera/Microphone Error</p>
                        <p>{error}</p>
                        {permissionDenied && (
                            <button
                                onClick={retryMediaAccess}
                                className="mt-2 bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100"
                            >
                                Retry Access
                            </button>
                        )}
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