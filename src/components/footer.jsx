import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black/40 backdrop-blur-sm text-gray-200 py-12 mt-12 border-t-1 border-white/10">
      <div className="flex gap-4 items-center justify-center">
        <div>
          <p className="text-lg font-semibold">Contacts</p>
          <div className="flex flex-col text-sm font-light  text-white/60 ">
            <p className="hover:text-white hover:underline cursor-pointer transition-all duration-150">
              Telegram
            </p>
            <p className="hover:text-white hover:underline cursor-pointer transition-all duration-150">
              Github
            </p>
            <p className="hover:text-white hover:underline cursor-pointer transition-all duration-150">
              LinkedIn
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
