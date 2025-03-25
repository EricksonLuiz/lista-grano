import React from 'react';
import { ItemPedido } from '../types';
import { Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

interface PropsListaItens {
  items: ItemPedido[];
  onEdit: (item: ItemPedido) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

const ordenarItens = (items: ItemPedido[]): ItemPedido[] => {
  const obterOrdemTipo = (item: ItemPedido): number => {
    if (item.tipoProduto === 'Kit') return 0;
    return 1;
  };

  const obterOrdemModelagem = (modelagem: string): number => {
    switch (modelagem) {
      case 'Masculino': return 0;
      case 'Feminino': return 1;
      case 'Infantil': return 2;
      default: return 3;
    }
  };

  const obterOrdemTamanho = (tamanho: string, modelagem: string): number => {
    const tamanhos = {
      'Masculino': ['PP', 'P', 'M', 'G', 'GG', 'EG', 'EGG', 'XGG', 'XEGG', '5G'],
      'Feminino': ['PP', 'P', 'M', 'G', 'GG', 'EG', 'EGG', 'XGG'],
      'Infantil': ['2', '4', '6', '8', '10', '12', '14']
    };
    return tamanhos[modelagem as keyof typeof tamanhos].indexOf(tamanho);
  };

  return [...items].sort((a, b) => {
    const ordemTipo = obterOrdemTipo(a) - obterOrdemTipo(b);
    if (ordemTipo !== 0) return ordemTipo;

    const ordemModelagem = obterOrdemModelagem(a.modelagem) - obterOrdemModelagem(b.modelagem);
    if (ordemModelagem !== 0) return ordemModelagem;

    return obterOrdemTamanho(a.tamanhoCamisa, a.modelagem) - obterOrdemTamanho(b.tamanhoCamisa, b.modelagem);
  });
};

export const ItemList: React.FC<PropsListaItens> = ({ items, onEdit, onDelete, disabled }) => {
  const itensSorted = ordenarItens(items);

  const obterClasseLinha = (item: ItemPedido) => {
    return clsx('border-b transition-colors', {
      'bg-blue-50': item.tipoProduto === 'Kit',
      'bg-green-50': item.ehGoleiro,
      'bg-gray-50': !item.ehGoleiro && item.tipoProduto === 'Camisa',
      'opacity-50': disabled
    });
  };

  let ultimaModelagem = '';
  let ultimoTipo = '';

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uniforme</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelagem</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamanho Camisa</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamanho Calção</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {itensSorted.map((item, index) => {
            const mostrarDivisor = ultimaModelagem !== item.modelagem || ultimoTipo !== item.tipoProduto;
            ultimaModelagem = item.modelagem;
            ultimoTipo = item.tipoProduto;

            return (
              <React.Fragment key={item.id}>
                {mostrarDivisor && index > 0 && (
                  <tr>
                    <td colSpan={9} className="h-4 bg-gray-100" />
                  </tr>
                )}
                <tr className={obterClasseLinha(item)}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.numero}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.tipoProduto}{item.ehGoleiro ? ' Goleiro' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.tipoUniforme === 'Regata' 
                      ? `Regata ${item.tipoRegata}` 
                      : `Camisa ${item.tipoManga}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.modelagem}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.tamanhoCamisa}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.tamanhoCalcao || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.observacoes || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onEdit(item)}
                      disabled={disabled}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      disabled={disabled}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};