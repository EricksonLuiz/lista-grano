import React from "react";
import { InfoCliente } from "../types";
import { exportToExcel } from "../utils/exportToExcel";

interface ExportButtonProps {
  clienteInfo: InfoCliente;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ clienteInfo }) => {
  return (
    <button
      onClick={() => exportToExcel(clienteInfo)}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Exportar para Excel
    </button>
  );
};
