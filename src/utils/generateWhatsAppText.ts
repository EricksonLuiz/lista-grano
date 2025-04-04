import { InfoCliente } from "../types";

export const generateWhatsAppText = (clienteInfo: InfoCliente): string => {
  let text = `*PEDIDO - ${clienteInfo.nomeCliente}*\n\n`;

  // Informações do cliente
  text += `*Informações do Cliente:*\n`;
  text += `Nome: ${clienteInfo.nomeCliente}\n`;
  text += `Time: ${clienteInfo.nomeTime || "-"}\n`;
  text += `Telefone: ${clienteInfo.telefone}\n`;
  text += `Tipo de Camisa: ${clienteInfo.tipoCamisa || "Tradicional"}\n`;
  text += `Tipo de Gola: ${clienteInfo.tipoGola || "Tradicional"}\n`;
  text += `Punho: ${clienteInfo.tipoPunho || "Sem Punho"}\n\n`;

  // Itens do pedido
  text += `*Itens do Pedido:*\n`;

  clienteInfo.itens.forEach((item, index) => {
    text += `\n*Item ${index + 1}:*\n`;
    text += `Nome: ${item.nome}\n`;
    text += `Número: ${item.numero || "-"}\n`;
    text += `Tipo: ${item.tipoProduto}${item.ehGoleiro ? " (Goleiro)" : ""}\n`;
    text += `Uniforme: ${
      item.tipoUniforme === "Camisa"
        ? `Camisa ${item.tipoManga}`
        : `Regata ${item.tipoRegata}`
    }\n`;
    text += `Modelagem: ${item.modelagem}\n`;
    text += `Tamanho Camisa: ${item.tamanhoCamisa}\n`;

    if (item.tipoProduto === "Kit") {
      text += `Tamanho Calção: ${item.tamanhoCalcao}\n`;
    }

    if (item.observacoes) {
      text += `Observações: ${item.observacoes}\n`;
    }
  });

  return text;
};
