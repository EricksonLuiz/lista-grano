import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CustomerForm } from "./components/CustomerForm";
import { ItemForm } from "./components/ItemForm";
import { ItemList } from "./components/ItemList";
import { InfoCliente, ItemPedido } from "./types";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { Send, PlusCircle } from "lucide-react";

// Chave para armazenamento local
const STORAGE_KEY = "pedido_uniformes_data";

function App() {
  const [infoCliente, setInfoCliente] = useState<InfoCliente>(() => {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    return dadosSalvos
      ? JSON.parse(dadosSalvos)
      : {
          nomeCliente: "",
          nomeTime: "",
          telefone: "",
          itens: [],
        };
  });
  const [editandoItem, setEditandoItem] = useState<ItemPedido | null>(null);

  // Salva os dados no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(infoCliente));
  }, [infoCliente]);

  const handleAddItem = (item: ItemPedido) => {
    if (!infoCliente.nomeCliente.trim()) {
      alert(
        "Por favor, preencha o nome do cliente antes de adicionar itens à lista."
      );
      return;
    }

    if (!infoCliente.telefone.trim()) {
      alert(
        "Por favor, preencha o telefone de contato antes de adicionar itens à lista."
      );
      return;
    }
    if (editandoItem) {
      setInfoCliente({
        ...infoCliente,
        itens: infoCliente.itens.map((i) => (i.id === item.id ? item : i)),
      });
      setEditandoItem(null);
    } else {
      setInfoCliente({
        ...infoCliente,
        itens: [...infoCliente.itens, item],
      });
    }
  };

  const handleEditItem = (item: ItemPedido) => {
    setEditandoItem(item);
  };

  const handleDeleteItem = (id: string) => {
    setInfoCliente({
      ...infoCliente,
      itens: infoCliente.itens.filter((item) => item.id !== id),
    });
  };

  const iniciarNovaLista = () => {
    if (
      infoCliente.itens.length > 0 ||
      infoCliente.nomeCliente ||
      infoCliente.nomeTime ||
      infoCliente.telefone
    ) {
      if (
        window.confirm(
          "Tem certeza que deseja iniciar uma nova lista? Todos os dados atuais serão apagados."
        )
      ) {
        setInfoCliente({
          nomeCliente: "",
          nomeTime: "",
          telefone: "",
          tipoCamisa: "Tradicional", // Valor padrão
          tipoGola: "Tradicional", // Valor padrão
          tipoPunho: "Sem Punho", // Valor padrão
          itens: [],
        });
        setEditandoItem(null);
      }
    }
  };

  const validarDadosCliente = () => {
    if (!infoCliente.nomeCliente.trim()) {
      alert("Por favor, preencha o nome do cliente");
      return false;
    }
    if (!infoCliente.telefone.replace(/\D/g, "").trim()) {
      alert("Por favor, preencha o telefone de contato");
      return false;
    }
    if (infoCliente.itens.length === 0) {
      alert("Por favor, adicione pelo menos um item à lista");
      return false;
    }
    return true;
  };

  const formatarListaItens = () => {
    return infoCliente.itens
      .map((item, index) => {
        const numero = item.numero ? `#${item.numero}` : "";
        const tipo = item.ehGoleiro ? "Goleiro" : item.tipoProduto;
        const uniforme =
          item.tipoUniforme === "Regata"
            ? `Regata ${item.tipoRegata}`
            : `Camisa ${item.tipoManga}`;
        const calcao = item.tamanhoCalcao
          ? ` | Calção: ${item.tamanhoCalcao}`
          : "";
        const obs = item.observacoes ? ` | Obs: ${item.observacoes}` : "";

        return (
          `${index + 1}. ${item.nome} ${numero}\n` +
          `   ${tipo} - ${uniforme}\n` +
          `   ${item.modelagem} | Camisa: ${item.tamanhoCamisa}${calcao}${obs}\n`
        );
      })
      .join("\n");
  };

  const enviarParaWhatsApp = () => {
    if (!validarDadosCliente()) return;

    // Informações sobre o tipo de camisa
    const infoTipoCamisa =
      `*Especificações da Camisa:*\n` +
      `🧥 Tipo de Camisa: ${infoCliente.tipoCamisa || "Tradicional"}\n` +
      `👕 Tipo de Gola: ${infoCliente.tipoGola || "Tradicional"}\n` +
      `✂️ Punho: ${infoCliente.tipoPunho || "Sem Punho"}\n`;

    const mensagem = encodeURIComponent(
      `*Novo pedido de ${infoCliente.nomeCliente}*\n\n` +
        `*Informações do Cliente:*\n` +
        `📱 Telefone: ${infoCliente.telefone}\n` +
        (infoCliente.nomeTime ? `⚽ Time: ${infoCliente.nomeTime}\n` : "") +
        `📦 Total de itens: ${infoCliente.itens.length}\n\n` +
        `${infoTipoCamisa}\n` +
        `*Lista de Itens:*\n\n${formatarListaItens()}`
    );

    window.open(`https://wa.me/5547991467992?text=${mensagem}`, "_blank");
  };

  const baixarCSV = () => {
    if (!validarDadosCliente()) return;

    // Função para formatar números com zeros à esquerda como texto
    const formatarComoTexto = (valor: string | null | undefined): string => {
      if (!valor) return "-";

      // Se o valor começa com zero e contém apenas dígitos, adiciona um apóstrofo
      if (valor.startsWith("0") && /^\d+$/.test(valor)) {
        return `="${valor}"`; // Formato que o Excel reconhece como texto
      }

      return valor;
    };

    const dados = infoCliente.itens.map((item) => ({
      "Nome do Cliente": infoCliente.nomeCliente,
      "Nome do Time": infoCliente.nomeTime || "-",
      Telefone: infoCliente.telefone,
      "Tipo de Camisa": infoCliente.tipoCamisa || "Tradicional",
      "Tipo de Gola": infoCliente.tipoGola || "Tradicional",
      Punho: infoCliente.tipoPunho || "Sem Punho",
      Nome: item.nome,
      Número: formatarComoTexto(item.numero), // Formata o número como texto
      Tipo: `${item.tipoProduto}${item.ehGoleiro ? " Goleiro" : ""}`,
      Uniforme:
        item.tipoUniforme === "Regata"
          ? `Regata ${item.tipoRegata}`
          : `Camisa ${item.tipoManga}`,
      Modelagem: item.modelagem,
      "Tamanho Camisa": item.tamanhoCamisa,
      "Tamanho Calção": item.tamanhoCalcao || "-",
      Observações: item.observacoes || "-",
    }));

    // Configuração especial para o Papa Parse
    const csv = Papa.unparse(dados, {
      delimiter: ";",
      header: true,
      // Não escapar aspas duplas para preservar o formato "=valor"
      quotes: false,
    });

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    saveAs(
      blob,
      `pedido_${infoCliente.nomeCliente}_${new Date().toISOString()}.csv`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        phone="(47) 99146-7992"
        address="R. Oscár Piske, 755 - Das Nações, Timbó, SC"
      />

      <main className="container max-w-screen-lg mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Pedido de Uniformes
          </h1>
          <button
            onClick={iniciarNovaLista}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-800 flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Nova Lista
          </button>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Informações do Cliente
            </h2>
            <CustomerForm
              key={infoCliente.nomeCliente || "new"}
              onSubmit={setInfoCliente}
              initialData={infoCliente}
            />
          </section>

          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Adicionar Item</h2>
            <ItemForm
              onSubmit={handleAddItem}
              editingItem={editandoItem}
              onCancelEdit={() => setEditandoItem(null)}
            />
          </section>

          {infoCliente.itens.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Lista de Itens</h2>
              <ItemList
                items={infoCliente.itens}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                disabled={!!editandoItem}
              />

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={baixarCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  Baixar CSV
                </button>
                <button
                  onClick={enviarParaWhatsApp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Send size={18} />
                  Enviar para WhatsApp
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
