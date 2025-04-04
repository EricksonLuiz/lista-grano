import React from "react";
import { Phone, MapPin } from "lucide-react";
import Logo from "../../public/logo.svg";

interface HeaderProps {
  phone: string;
  address: string;
}

export const Header: React.FC<HeaderProps> = ({ phone, address }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            {/* Replace with your actual logo */}
            <img src={Logo} className="max-w-[150px]" title="Logo Grano" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <a
              href={`https://wa.me/5547991467992`}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone size={20} />
              <span>{phone}</span>
            </a>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={20} />
              <span>{address}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
