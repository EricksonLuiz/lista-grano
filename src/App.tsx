import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CustomerForm } from './components/CustomerForm';
import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';
import { InfoCliente, ItemPedido } from './types';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { Send, Phone, MapPin, PlusCircle } from 'lucide-react';

// Chave para armazenamento local
const STORAGE_KEY = 'pedido_uniformes_data';

function App() {
  const [infoCliente, setInfoCliente] = useState<InfoCliente>(() => {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    return dadosSalvos ? JSON.parse(dadosSalvos) : {
      nomeCliente: '',
      nomeTime: '',
      telefone: '',
      itens: []
    };
  });
  const [editandoItem, setEditandoItem] = useState<ItemPedido | null>(null);

  // Salva os dados no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(infoCliente));
  }, [infoCliente]);

  const handleAddItem = (item: ItemPedido) => {
    if (editandoItem) {
      setInfoCliente({
        ...infoCliente,
        itens: infoCliente.itens.map((i) => (i.id === item.id ? item : i))
      });
      setEditandoItem(null);
    } else {
      setInfoCliente({
        ...infoCliente,
        itens: [...infoCliente.itens, item]
      });
    }
  };

  const handleEditItem = (item: ItemPedido) => {
    setEditandoItem(item);
  };

  const handleDeleteItem = (id: string) => {
    setInfoCliente({
      ...infoCliente,
      itens: infoCliente.itens.filter((item) => item.id !== id)
    });
  };

  const iniciarNovaLista = () => {
    if (infoCliente.itens.length > 0 || infoCliente.nomeCliente || infoCliente.nomeTime || infoCliente.telefone) {
      if (window.confirm('Tem certeza que deseja iniciar uma nova lista? Todos os dados atuais serão apagados.')) {
        setInfoCliente({
          nomeCliente: '',
          nomeTime: '',
          telefone: '',
          itens: []
        });
        setEditandoItem(null);
      }
    }
  };

  const validarDadosCliente = () => {
    if (!infoCliente.nomeCliente.trim()) {
      alert('Por favor, preencha o nome do cliente');
      return false;
    }
    if (!infoCliente.telefone.replace(/\D/g, '').trim()) {
      alert('Por favor, preencha o telefone de contato');
      return false;
    }
    if (infoCliente.itens.length === 0) {
      alert('Por favor, adicione pelo menos um item à lista');
      return false;
    }
    return true;
  };

  const formatarListaItens = () => {
    return infoCliente.itens.map((item, index) => {
      const numero = item.numero ? `#${item.numero}` : '';
      const tipo = item.ehGoleiro ? 'Goleiro' : item.tipoProduto;
      const uniforme = item.tipoUniforme === 'Regata' 
        ? `Regata ${item.tipoRegata}` 
        : `Camisa ${item.tipoManga}`;
      const calcao = item.tamanhoCalcao ? ` | Calção: ${item.tamanhoCalcao}` : '';
      const obs = item.observacoes ? ` | Obs: ${item.observacoes}` : '';

      return `${index + 1}. ${item.nome} ${numero}\n` +
             `   ${tipo} - ${uniforme}\n` +
             `   ${item.modelagem} | Camisa: ${item.tamanhoCamisa}${calcao}${obs}\n`;
    }).join('\n');
  };

  const enviarParaWhatsApp = () => {
    if (!validarDadosCliente()) return;

    const mensagem = encodeURIComponent(
      `*Novo pedido de ${infoCliente.nomeCliente}*\n\n` +
      `*Informações do Cliente:*\n` +
      `📱 Telefone: ${infoCliente.telefone}\n` +
      (infoCliente.nomeTime ? `⚽ Time: ${infoCliente.nomeTime}\n` : '') +
      `📦 Total de itens: ${infoCliente.itens.length}\n\n` +
      `*Lista de Itens:*\n\n${formatarListaItens()}`
    );

    window.open(`https://wa.me/5547991467992?text=${mensagem}`, '_blank');
  };

  const baixarCSV = () => {
    if (!validarDadosCliente()) return;
    
    const dados = infoCliente.itens.map((item) => ({
      'Nome do Cliente': infoCliente.nomeCliente,
      'Nome do Time': infoCliente.nomeTime || '-',
      'Telefone': infoCliente.telefone,
      'Nome': item.nome,
      'Número': item.numero || '-',
      'Tipo': `${item.tipoProduto}${item.ehGoleiro ? ' Goleiro' : ''}`,
      'Uniforme': item.tipoUniforme === 'Regata' 
        ? `Regata ${item.tipoRegata}` 
        : `Camisa ${item.tipoManga}`,
      'Modelagem': item.modelagem,
      'Tamanho Camisa': item.tamanhoCamisa,
      'Tamanho Calção': item.tamanhoCalcao || '-',
      'Observações': item.observacoes || '-'
    }));

    const csv = Papa.unparse(dados, {
      delimiter: ';',
      header: true
    });
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `pedido_${infoCliente.nomeCliente}_${new Date().toISOString()}.csv`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        phone="(47) 99150-6901"
        address="R. Oscár Piske, 755 - Das Nações, Timbó, SC"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Pedido de Uniformes</h1>
          <button
            onClick={iniciarNovaLista}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Nova Lista
          </button>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
            <CustomerForm 
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

      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
        <div className="flex flex-col items-center gap-2">
          <a 
            href="https://wa.me/5547991467992"
            target='_blank'
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <Phone size={20} />
            (47) 99146-7992
          </a>
          <div className="text-gray-600 flex items-center gap-2">
            <MapPin size={20} />
            R. Oscár Piske, 755 - Das Nações, Timbó, SC
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;