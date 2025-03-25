import React, { useState, useEffect } from 'react';
import { ItemPedido, TipoModelagem, TipoProduto, TipoUniforme, TipoRegata, TipoManga } from '../types';
import { clsx } from 'clsx';

interface PropsFormularioItem {
  onSubmit: (item: ItemPedido) => void;
  editingItem?: ItemPedido | null;
  onCancelEdit?: () => void;
}

const TAMANHOS_MASCULINO = ['PP', 'P', 'M', 'G', 'GG', 'EG', 'EGG', 'XGG', 'XEGG', '5G'];
const TAMANHOS_FEMININO = ['PP', 'P', 'M', 'G', 'GG', 'EG', 'EGG', 'XGG'];
const TAMANHOS_INFANTIL = ['2', '4', '6', '8', '10', '12', '14'];

export const ItemForm: React.FC<PropsFormularioItem> = ({ onSubmit, editingItem, onCancelEdit }) => {
  const [item, setItem] = useState<ItemPedido>({
    id: '',
    nome: '',
    numero: '',
    tipoProduto: 'Camisa',
    tipoUniforme: 'Camisa',
    tipoManga: 'Curta',
    ehGoleiro: false,
    modelagem: 'Masculino',
    tamanhoCamisa: '',
    tamanhoCalcao: '',
  });

  useEffect(() => {
    if (editingItem) {
      setItem(editingItem);
    }
  }, [editingItem]);

  const obterTamanhos = (modelagem: TipoModelagem) => {
    switch (modelagem) {
      case 'Masculino':
        return TAMANHOS_MASCULINO;
      case 'Feminino':
        return TAMANHOS_FEMININO;
      case 'Infantil':
        return TAMANHOS_INFANTIL;
      default:
        return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (item.tipoUniforme === 'Camisa' && !item.tipoManga) {
      alert('Por favor, selecione o tipo de manga');
      return;
    }

    if (item.tipoUniforme === 'Regata' && !item.tipoRegata) {
      alert('Por favor, selecione o tipo de regata');
      return;
    }

    if (!item.tamanhoCamisa) {
      alert('Por favor, selecione o tamanho da camisa');
      return;
    }

    if (item.tipoProduto === 'Kit' && !item.tamanhoCalcao) {
      alert('Por favor, selecione o tamanho do calção');
      return;
    }
    
    onSubmit({
      ...item,
      id: item.id || Math.random().toString(36).substr(2, 9)
    });
    
    setItem({
      id: '',
      nome: '',
      numero: '',
      tipoProduto: 'Camisa',
      tipoUniforme: 'Camisa',
      tipoManga: 'Curta',
      ehGoleiro: false,
      modelagem: 'Masculino',
      tamanhoCamisa: '',
      tamanhoCalcao: '',
    });
  };

  const handleTipoUniformeChange = (tipo: TipoUniforme) => {
    setItem({
      ...item,
      tipoUniforme: tipo,
      tipoRegata: tipo === 'Regata' ? 'Nadadora' : undefined,
      tipoManga: tipo === 'Camisa' ? 'Curta' : undefined,
      ehGoleiro: tipo === 'Regata' ? false : item.ehGoleiro,
      modelagem: tipo === 'Regata' && item.modelagem === 'Infantil' ? 'Masculino' : item.modelagem,
      tamanhoCamisa: '',
      tamanhoCalcao: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Uniforme *
        </label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={item.tipoUniforme === 'Camisa'}
              onChange={() => handleTipoUniformeChange('Camisa')}
            />
            <span className="ml-2">Camisa</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={item.tipoUniforme === 'Regata'}
              onChange={() => handleTipoUniformeChange('Regata')}
            />
            <span className="ml-2">Regata</span>
          </label>
        </div>
      </div>

      {item.tipoUniforme === 'Regata' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Regata *
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                checked={item.tipoRegata === 'Nadadora'}
                onChange={() => setItem({ ...item, tipoRegata: 'Nadadora' })}
              />
              <span className="ml-2">Nadadora</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                checked={item.tipoRegata === 'Machão'}
                onChange={() => setItem({ ...item, tipoRegata: 'Machão' })}
              />
              <span className="ml-2">Machão</span>
            </label>
          </div>
        </div>
      )}

      {item.tipoUniforme === 'Camisa' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Manga *
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                checked={item.tipoManga === 'Curta'}
                onChange={() => setItem({ ...item, tipoManga: 'Curta' })}
              />
              <span className="ml-2">Curta</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                checked={item.tipoManga === 'Longa'}
                onChange={() => setItem({ ...item, tipoManga: 'Longa' })}
              />
              <span className="ml-2">Longa</span>
            </label>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome *
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={item.nome}
            onChange={(e) => setItem({ ...item, nome: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={item.numero}
            onChange={(e) => setItem({ ...item, numero: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Produto *
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                checked={item.tipoProduto === 'Camisa'}
                onChange={() => setItem({ ...item, tipoProduto: 'Camisa', tamanhoCalcao: '' })}
              />
              <span className="ml-2">Camisa</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                checked={item.tipoProduto === 'Kit'}
                onChange={() => setItem({ ...item, tipoProduto: 'Kit' })}
              />
              <span className="ml-2">Kit</span>
            </label>
          </div>
        </div>

        {item.tipoUniforme === 'Camisa' && (
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600"
                checked={item.ehGoleiro}
                onChange={(e) => setItem({ ...item, ehGoleiro: e.target.checked })}
              />
              <span className="ml-2">Goleiro</span>
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelagem *
          </label>
          <div className="flex gap-4">
            {(['Masculino', 'Feminino'] as TipoModelagem[]).map((tipo) => (
              <label key={tipo} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  checked={item.modelagem === tipo}
                  onChange={() => setItem({ ...item, modelagem: tipo, tamanhoCamisa: '', tamanhoCalcao: '' })}
                />
                <span className="ml-2">{tipo}</span>
              </label>
            ))}
            {item.tipoUniforme === 'Camisa' && (
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  checked={item.modelagem === 'Infantil'}
                  onChange={() => setItem({ ...item, modelagem: 'Infantil', tamanhoCamisa: '', tamanhoCalcao: '' })}
                />
                <span className="ml-2">Infantil</span>
              </label>
            )}
          </div>
        </div>

        <div className={clsx('grid gap-4', {
          'grid-cols-2': item.tipoProduto === 'Kit',
          'grid-cols-1': item.tipoProduto === 'Camisa'
        })}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tamanho da Camisa *
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={item.tamanhoCamisa}
              onChange={(e) => setItem({ ...item, tamanhoCamisa: e.target.value })}
            >
              <option value="" disabled>Selecione um tamanho</option>
              {obterTamanhos(item.modelagem).map((tamanho) => (
                <option key={tamanho} value={tamanho}>{tamanho}</option>
              ))}
            </select>
          </div>

          {item.tipoProduto === 'Kit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tamanho do Calção *
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={item.tamanhoCalcao}
                onChange={(e) => setItem({ ...item, tamanhoCalcao: e.target.value })}
              >
                <option value="" disabled>Selecione um tamanho</option>
                {obterTamanhos(item.modelagem).map((tamanho) => (
                  <option key={tamanho} value={tamanho}>{tamanho}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            value={item.observacoes || ''}
            onChange={(e) => setItem({ ...item, observacoes: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {editingItem && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {editingItem ? 'Atualizar Item' : 'Adicionar à Lista'}
        </button>
      </div>
    </form>
  );
};