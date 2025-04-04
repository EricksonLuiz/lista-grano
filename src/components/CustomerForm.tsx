import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { ItemPedido } from "../types";

interface CustomerFormProps {
  onSubmit: (data: InfoCliente) => void;
  initialData?: InfoCliente;
}

export interface InfoCliente {
  nomeCliente: string;
  nomeTime: string;
  telefone: string;
  tipoCamisa?: TipoCamisa;
  tipoGola?: TipoGola;
  tipoPunho?: TipoPunho;
  itens: ItemPedido[];
}

export type TipoCamisa = "Tradicional" | "Reglan";
export type TipoGola = "Tradicional" | "Gola V";
export type TipoPunho = "Com Punho" | "Sem Punho";

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmit,
  initialData,
}) => {
  // Inicializar com valores padrão e cast explícito
  const [formData, setFormData] = useState<InfoCliente>(
    initialData || {
      nomeCliente: "",
      nomeTime: "",
      telefone: "",
      tipoCamisa: "Tradicional" as TipoCamisa,
      tipoGola: "Tradicional" as TipoGola,
      tipoPunho: "Sem Punho" as TipoPunho,
      itens: [],
    }
  );

  // Garantir que os valores padrão sejam definidos
  useEffect(() => {
    if (!formData.tipoCamisa || !formData.tipoGola || !formData.tipoPunho) {
      const updatedData = {
        ...formData,
        tipoCamisa: formData.tipoCamisa || ("Tradicional" as TipoCamisa),
        tipoGola: formData.tipoGola || ("Tradicional" as TipoGola),
        tipoPunho: formData.tipoPunho || ("Sem Punho" as TipoPunho),
      };
      setFormData(updatedData);
      onSubmit(updatedData);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome do Cliente *
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          value={formData.nomeCliente}
          onChange={(e) => {
            setFormData({ ...formData, nomeCliente: e.target.value });
            onSubmit({ ...formData, nomeCliente: e.target.value });
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome do Time
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          value={formData.nomeTime}
          onChange={(e) => {
            setFormData({ ...formData, nomeTime: e.target.value });
            onSubmit({ ...formData, nomeTime: e.target.value });
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telefone de Contato *
        </label>
        <InputMask
          mask="(99) 9 9999-9999"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          value={formData.telefone}
          onChange={(e) => {
            setFormData({ ...formData, telefone: e.target.value });
            onSubmit({ ...formData, telefone: e.target.value });
          }}
        />
      </div>

      {/* Especificações da camisa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tipo de Camisa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Camisa *
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio cursor-pointer text-blue-600"
                checked={formData.tipoCamisa === "Tradicional"}
                onChange={() => {
                  const newData = {
                    ...formData,
                    tipoCamisa: "Tradicional" as TipoCamisa,
                  };
                  setFormData(newData);
                  onSubmit(newData);
                }}
              />
              <span className="ml-2">Tradicional</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio cursor-pointer text-blue-600"
                checked={formData.tipoCamisa === "Reglan"}
                onChange={() => {
                  const newData = {
                    ...formData,
                    tipoCamisa: "Reglan" as TipoCamisa,
                  };
                  setFormData(newData);
                  onSubmit(newData);
                }}
              />
              <span className="ml-2">Reglan</span>
            </label>
          </div>
        </div>

        {/* Tipo de Gola */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Gola *
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio cursor-pointer text-blue-600"
                checked={formData.tipoGola === "Tradicional"}
                onChange={() => {
                  const newData = {
                    ...formData,
                    tipoGola: "Tradicional" as TipoGola,
                  };
                  setFormData(newData);
                  onSubmit(newData);
                }}
              />
              <span className="ml-2">Tradicional</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio cursor-pointer text-blue-600"
                checked={formData.tipoGola === "Gola V"}
                onChange={() => {
                  const newData = {
                    ...formData,
                    tipoGola: "Gola V" as TipoGola,
                  };
                  setFormData(newData);
                  onSubmit(newData);
                }}
              />
              <span className="ml-2">Gola V</span>
            </label>
          </div>
        </div>

        {/* Punho */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Punho *
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio cursor-pointer text-blue-600"
                checked={formData.tipoPunho === "Com Punho"}
                onChange={() => {
                  const newData = {
                    ...formData,
                    tipoPunho: "Com Punho" as TipoPunho,
                  };
                  setFormData(newData);
                  onSubmit(newData);
                }}
              />
              <span className="ml-2">Com Punho</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio cursor-pointer text-blue-600"
                checked={formData.tipoPunho === "Sem Punho"}
                onChange={() => {
                  const newData = {
                    ...formData,
                    tipoPunho: "Sem Punho" as TipoPunho,
                  };
                  setFormData(newData);
                  onSubmit(newData);
                }}
              />
              <span className="ml-2">Sem Punho</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};
