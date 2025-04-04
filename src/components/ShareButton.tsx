import React from "react";
import { InfoCliente } from "../types";
import { generateWhatsAppText } from "../utils/generateWhatsAppText";

interface ShareButtonProps {
  clienteInfo: InfoCliente;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ clienteInfo }) => {
  const handleShare = () => {
    const text = generateWhatsAppText(clienteInfo);
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      Compartilhar no WhatsApp
    </button>
  );
};
