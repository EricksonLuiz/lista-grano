export type TipoModelagem = "Masculino" | "Feminino" | "Infantil";
export type TipoProduto = "Camisa" | "Kit";
export type TipoUniforme = "Camisa" | "Regata";
export type TipoRegata = "Nadadora" | "Machão";
export type TipoManga = "Curta" | "Longa";
export type TipoCamisa = "Tradicional" | "Reglan";
export type TipoGola = "Tradicional" | "Gola V";
export type TipoPunho = "Com Punho" | "Sem Punho";

export interface InfoCliente {
  nomeCliente: string;
  nomeTime: string;
  telefone: string;
  tipoCamisa?: TipoCamisa;
  tipoGola?: TipoGola;
  tipoPunho?: TipoPunho;
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
  tipoCamisa?: TipoCamisa;
  tipoGola?: TipoGola;
  tipoPunho?: TipoPunho;
  ehGoleiro: boolean;
  modelagem: TipoModelagem;
  tamanhoCamisa: string;
  tamanhoCalcao?: string;
  observacoes?: string;
}
