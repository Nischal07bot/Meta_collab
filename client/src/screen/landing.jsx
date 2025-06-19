// LandingPage.jsx
import React from "react";

const LandingPage = () => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-blue-700 text-white z-20">
      {/* Starry background wrapper */}
      <div className="starry-bg_wrapper fixed inset-0 -z-10 pointer-events-none">
        {/* Star 6 */}
        <div className="starry-bg_star-6 is-homepage absolute top-8 left-6 opacity-80 z-20">
          <img
            src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640642d487bb294c34df2050_Star%206.svg"
            loading="lazy"
            alt=""
            className="w-8 h-8"
          />
        </div>

        {/* Star 5 */}
        <div className="starry-bg_star-5 is-homepage absolute top-32 right-8 opacity-70 z-20">
          <img
            src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640642962d6a7b0b4d469a27_Star%205.svg"
            loading="lazy"
            alt=""
            className="w-6 h-6"
          />
        </div>

        {/* Star 8 */}
        <div className="starry-bg_star-8 is-homepage absolute bottom-24 left-1/4 opacity-60 z-20">
          <img
            src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640643218def2ffb98cefcee_Star%208.svg"
            loading="lazy"
            alt=""
            className="w-10 h-10"
          />
        </div>

        {/* Star 9 */}
        <div className="starry-bg_star-9 is-homepage absolute bottom-16 right-1/3 opacity-75 z-20">
          <img
            src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640644b54c044561733508ca_Star%209.svg"
            loading="lazy"
            alt=""
            className="w-7 h-7"
          />
        </div>

        {/* Center stars (4 & 7) */}
        <div className="starry-bg_center-anchor is-homepage absolute inset-0 flex justify-center items-center z-20">
          <div className="starry-bg_star-4 z-20">
            <img
              src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/6406427fd35e3db12a52cfc4_Star%204.svg"
              loading="lazy"
              alt=""
              className="w-5 h-5"
            />
          </div>
            <div className="starry-bg_star-7 z-20">
            <img
              src="https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640642fa7d41d60cbce94fe0_Star%207.svg"
              loading="lazy"
              alt=""
              className="w-5 h-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
