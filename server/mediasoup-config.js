import mediasoup from "mediasoup";
const workersettings={
    loglevel:"warn",
    rtcMinPort:10000,
    rtcMaxPort:10100,
};
const routerOptions = {
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000
      }
    ]
  };
  let worker;
  let router;
  const createWorker=async()=>{
    worker=await mediasoup.createWorker(workersettings);
    worker.on("died",()=>{
        console.log("mediasoup worker has died");
    })
    router = await worker.createRouter({ mediaCodecs: routerOptions.mediaCodecs });
  }
  export {createWorker,worker,router};