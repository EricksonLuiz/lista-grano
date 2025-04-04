import * as XLSX from "xlsx";
import { InfoCliente } from "../types";

export const exportToExcel = (clienteInfo: InfoCliente) => {
  // Criar uma planilha com informações do cliente
  const clienteSheet = XLSX.utils.json_to_sheet([
    {
      "Nome do Cliente": clienteInfo.nomeCliente,
      "Nome do Time": clienteInfo.nomeTime,
      Telefone: clienteInfo.telefone,
      "Tipo de Camisa": clienteInfo.tipoCamisa || "Tradicional",
      "Tipo de Gola": clienteInfo.tipoGola || "Tradicional",
      Punho: clienteInfo.tipoPunho || "Sem Punho",
    },
  ]);

  // Criar uma planilha com os itens
  const itensData = clienteInfo.itens.map((item) => ({
    Nome: item.nome,
    Número: item.numero,
    "Tipo de Produto": item.tipoProduto,
    "Tipo de Uniforme": item.tipoUniforme,
    "Manga/Regata":
      item.tipoUniforme === "Camisa" ? item.tipoManga : item.tipoRegata,
    Goleiro: item.ehGoleiro ? "Sim" : "Não",
    Modelagem: item.modelagem,
    "Tamanho Camisa": item.tamanhoCamisa,
    "Tamanho Calção": item.tamanhoCalcao || "-",
    Observações: item.observacoes || "-",
  }));

  const itensSheet = XLSX.utils.json_to_sheet(itensData);

  // Criar um novo workbook e adicionar as planilhas
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, clienteSheet, "Informações do Cliente");
  XLSX.utils.book_append_sheet(wb, itensSheet, "Itens do Pedido");

  // Gerar o arquivo Excel
  XLSX.writeFile(
    wb,
    `Pedido_${clienteInfo.nomeCliente}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`
  );
};
