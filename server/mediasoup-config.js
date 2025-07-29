  import mediasoup from "mediasoup";

   const workerSettings = {
     logLevel: 'warn',
     rtcMinPort: 10000,
     rtcMaxPort: 10100
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

   const createWorker = async () => {
     worker = await mediasoup.createWorker(workerSettings);
     worker.on('died', () => {
       console.error('MediaSoup worker has died');
     });

     // Fix: Pass routerOptions.mediaCodecs instead of routerOptions
     router = await worker.createRouter({ mediaCodecs: routerOptions.mediaCodecs });
   };

  export { createWorker, worker, router };
