export type TipoModelagem = 'Masculino' | 'Feminino' | 'Infantil';
export type TipoProduto = 'Camisa' | 'Kit';
export type TipoUniforme = 'Camisa' | 'Regata';
export type TipoRegata = 'Nadadora' | 'Machão';
export type TipoManga = 'Curta' | 'Longa';

export interface InfoCliente {
  nomeCliente: string;
  nomeTime: string;
  telefone: string;
  itens: ItemPedido[];
}

export interface ItemPedido {
  id: string;
  nome: string;
  numero: string;
  tipoProduto: TipoProduto;
  tipoUniforme: TipoUniforme;
  tipoRegata?: TipoRegata;
  tipoManga?: TipoManga;
  ehGoleiro: boolean;
  modelagem: TipoModelagem;
  tamanhoCamisa: string;
  tamanhoCalcao?: string;
  observacoes?: string;
}