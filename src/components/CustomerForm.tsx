import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { InfoCliente } from '../types';

interface CustomerFormProps {
  onSubmit: (data: InfoCliente) => void;
  initialData?: InfoCliente;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<InfoCliente>(initialData || {
    nomeCliente: '',
    nomeTime: '',
    telefone: '',
    itens: []
  });

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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.telefone}
          onChange={(e) => {
            setFormData({ ...formData, telefone: e.target.value });
            onSubmit({ ...formData, telefone: e.target.value });
          }}
        />
      </div>
    </form>
  );
};