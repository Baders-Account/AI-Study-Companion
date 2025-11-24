// Footer.jsx
import React from "react";

function Footer({ webName, year, links }) {
  return (
    <footer className="w-full bg-white border-t border-neutral-200 flex justify-center py-6">
      <div className="max-w-7xl w-full px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-neutral-600 text-sm font-normal mb-4 md:mb-0">
          {year} {webName}. All rights reserved.
        </p>

        <nav aria-label="Footer navigation" className="flex gap-6">
          
            <a
              
              href={links}
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {links}
            </a>
          
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
