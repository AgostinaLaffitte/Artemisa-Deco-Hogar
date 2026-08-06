import { useEffect, useState, useRef } from 'react';
import { OrderService } from '../../services/order.service';
import { formatPrice } from '../../utils/productUtils';
import { User, Truck, CreditCard, Eye, RefreshCw, Clipboard, MapPin, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface Order {
  id: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'RETIRO' | 'ENVIO';
  address?: string;
  city?: string;
  status: string;
  total: number;
  items: any[];
}


const getStatusBadgeClass = (status: string) => {
  const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border";
  switch (status) {
    case 'PENDIENTE': 
      return `${base} bg-artemisa-light text-artemisa-secondary border-artemisa-border`;
    case 'COMPLETADO': 
      return `${base} bg-artemisa-primary text-artemisa-light border-artemisa-primary`;
    case 'ENVIADO': 
      return `${base} bg-artemisa-accent text-artemisa-neutral border-artemisa-accent`;
    case 'CANCELADO': 
      return `${base} bg-white text-artemisa-neutral border-artemisa-neutral opacity-60`;
    default: 
      return `${base} bg-artemisa-light text-artemisa-neutral border-artemisa-border`;
  }
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('TODAS');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
 
  // Función para mostrar notificaciones lindas
  const notify = (message: any, type: 'success' | 'error') => {
    const finalMessage = Array.isArray(message) ? message.join(', ') : message;
    setNotification({ message: finalMessage, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    if (selectedOrder && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.findAll();
      setOrders(data);
    } catch (error: any) {
      notify(error?.message || 'Error al cargar órdenes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);


const handleStatusChange = async (orderId: number, newStatus: string) => {
  // Si cancelan, guardamos el ID y abrimos el modal
  if (newStatus === 'CANCELADO') {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
    return;
  }
  
  // Si no es cancelar, lo hacemos directo
  await performStatusUpdate(orderId, newStatus);
};

const performStatusUpdate = async (orderId: number, newStatus: string) => {
  try {
    await OrderService.updateStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    await fetchOrders();
    notify('Estado actualizado correctamente', 'success');
  } catch (error: any) {
    notify(error?.response?.data?.message || 'Error al cambiar estado', 'error');
  } finally {
    setShowCancelModal(false);
    setOrderToCancel(null);
  }
};

  const copyInvoiceToClipboard = (order: any) => {
    const itemsText = order.items.map((i: any) => `- ${i.product.name} x${i.quantity}`).join('\n');
    const invoice = `PEDIDO #${order.id}\nCliente: ${order.customerName}\nTotal: ${formatPrice(order.total)}\n\nProductos:\n${itemsText}`;
    navigator.clipboard.writeText(invoice);
    notify('Detalle copiado al portapapeles', 'success');
  };

  const getGroupedOrders = (): Record<string, Order[]> => {
    const filtered = filterStatus === 'TODAS' ? orders : orders.filter(o => o.status === filterStatus);
    return filtered.reduce((groups: Record<string, Order[]>, order) => {
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase();
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(order);
      return groups;
    }, {});
  };

  const groupedOrders = getGroupedOrders();

return (
    <div className="min-h-screen bg-artemisa-light/50 p-6 relative text-artemisa-neutral">
      {/* Notificación (intacta en lógica, colores artemisa) */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-4 ${
          notification.type === 'success' 
            ? 'bg-artemisa-light text-artemisa-primary border-artemisa-border' 
            : 'bg-white text-artemisa-neutral border-artemisa-neutral'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} className="text-artemisa-secondary" /> : <AlertCircle size={20} className="text-artemisa-accent" />}
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-artemisa-border pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-black text-artemisa-primary uppercase italic tracking-tighter">Gestión de Órdenes</h1>
            <div className="flex flex-wrap gap-2 mt-4">
              {['TODAS', 'PENDIENTE', 'ENVIADO', 'COMPLETADO', 'CANCELADO'].map(status => (
                <button 
                  key={status} 
                  onClick={() => setFilterStatus(status)} 
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all border ${
                    filterStatus === status 
                      ? 'bg-artemisa-primary text-artemisa-light border-artemisa-primary' 
                      : 'bg-white text-artemisa-neutral border-artemisa-border hover:border-artemisa-secondary'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <button onClick={fetchOrders} className="p-3 bg-white border border-artemisa-border rounded-xl shadow-sm hover:border-artemisa-secondary text-artemisa-secondary">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

     {Object.entries(groupedOrders).map(([month, monthOrders]) => (
  <div key={month} className="space-y-3">
    <h3 className="text-[10px] font-black text-artemisa-secondary uppercase tracking-widest px-2">{month}</h3>
    
    {monthOrders.map((order) => (
      <div key={order.id} className="space-y-2">
        {/* VISTA TABLET/DESKTOP: Fila de tabla */}
        <div className="hidden md:block bg-white border border-artemisa-border rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-artemisa-border">
              <tr className="hover:bg-artemisa-light/30 transition-colors">
                <td className="p-5 font-black text-artemisa-primary">#{order.id}</td>
                <td className="p-5 font-bold text-artemisa-neutral">{order.customerName}</td>
                <td className="p-5 text-artemisa-neutral/80">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-5 font-black text-artemisa-primary">{formatPrice(order.total)}</td>
                <td className="p-5"><span className={getStatusBadgeClass(order.status)}>{order.status}</span></td>
                <td className="p-5 text-center">
                  <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)} className="p-2 bg-artemisa-light rounded-lg hover:bg-artemisa-border text-artemisa-secondary transition-colors">
                    <Eye size={16}/>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* VISTA MOBILE: Tarjeta */}
        <div className="md:hidden bg-white p-5 rounded-2xl border border-artemisa-border shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-artemisa-primary">#{order.id}</span>
              <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
            </div>
            <p className="font-bold text-sm text-artemisa-neutral">{order.customerName}</p>
            <p className="text-[11px] text-artemisa-secondary font-bold">{formatPrice(order.total)}</p>
          </div>
          <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)} className="p-3 bg-artemisa-light rounded-xl hover:bg-artemisa-border border border-artemisa-border transition-colors">
            <Eye size={18} className="text-artemisa-secondary"/>
          </button>
        </div>

        {/* DETALLE: Ahora está DENTRO del map, aparece debajo de la orden seleccionada */}
            {selectedOrder?.id === order.id && (
              <div ref={detailRef} className="w-full bg-white border-2 border-artemisa-primary rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-3">
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-artemisa-primary">Pedido #{selectedOrder.id}</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => copyInvoiceToClipboard(selectedOrder)} 
                    className="flex items-center gap-2 bg-artemisa-primary text-artemisa-light px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-artemisa-neutral transition-colors"
                  >
                    <Clipboard size={12} /> Copiar Boleta
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="text-xs font-bold text-artemisa-secondary hover:text-artemisa-primary uppercase transition-colors">Cerrar</button>
                </div>
  
                </div>
                <div className="text-right mb-4">
                      <span className="text-[10px] font-black text-artemisa-secondary uppercase">Estado</span>
                      <select value={selectedOrder.status} onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)} className="block mt-1 ml-auto bg-artemisa-light border border-artemisa-border font-bold text-sm rounded-xl p-2 cursor-pointer text-artemisa-neutral focus:ring-1 focus:ring-artemisa-secondary focus:border-artemisa-secondary outline-none">
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="ENVIADO">ENVIADO</option>
                        <option value="COMPLETADO">COMPLETADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </select>
                </div>
                  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-artemisa-light/30 p-6 rounded-2xl border border-artemisa-border space-y-3">
                      <h3 className="text-[10px] font-black text-artemisa-secondary uppercase flex items-center gap-2"><User size={14} /> Contacto</h3>
                      <p className="font-black text-lg truncate text-artemisa-neutral">{selectedOrder.customerName}</p>
                      <div className="flex items-center gap-2 text-sm text-artemisa-neutral/80"><Mail size={14} className="text-artemisa-secondary"/> {selectedOrder.customerEmail}</div>
                      <div className="flex items-center gap-2 text-sm text-artemisa-neutral/80"><Phone size={14} className="text-artemisa-secondary"/> {selectedOrder.customerPhone}</div>
                    </div>
                    <div className="bg-artemisa-light/30 p-6 rounded-2xl border border-artemisa-border space-y-3">
                      <h3 className="text-[10px] font-black text-artemisa-secondary uppercase flex items-center gap-2"><Truck size={14} /> Envío</h3>
                      <p className="font-bold text-artemisa-neutral">{selectedOrder.deliveryMethod}</p>
                      <div className="flex items-start gap-2 text-sm text-artemisa-neutral/80"><MapPin size={14} className="mt-1 text-artemisa-secondary"/> {selectedOrder.address ? `${selectedOrder.address}, ${selectedOrder.city}` : 'Retiro en local'}</div>
                    </div>
                </div><div className="mt-8 border-t border-artemisa-border pt-8">
                    <h3 className="text-[10px] font-black text-artemisa-secondary uppercase mb-4 flex items-center gap-2"><CreditCard size={14} /> Detalle de artículos</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-artemisa-border">
                          <div>
                            <p className="font-bold text-sm text-artemisa-neutral">{item.product.name}</p>
                            <p className="text-[11px] text-artemisa-secondary">Var: {item.variant?.name || 'Única'} | Cant: {item.quantity}</p>
                          </div>
                          <span className="font-black text-artemisa-primary">{formatPrice(Number(item.priceAtPurchase) * Number(item.quantity))}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-between items-center bg-artemisa-primary text-artemisa-light p-6 rounded-2xl shadow-xl">
                      <span className="font-black uppercase tracking-widest text-sm opacity-80">Total del pedido</span>
                      <span className="text-2xl font-black">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
              </div>
            )}
          </div>
        ))}
      </div>
    ))}
      </div>
          {showCancelModal && (
      <div className="fixed inset-0 bg-artemisa-neutral/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-artemisa-border">
          <h3 className="font-black text-artemisa-primary uppercase text-lg mb-2">¿Confirmar cancelación?</h3>
          <p className="text-artemisa-neutral/80 text-xs mb-6">Esta acción devolverá los productos al inventario. ¿Estás segura?</p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowCancelModal(false)}
              className="flex-1 px-4 py-2 rounded-xl bg-artemisa-light text-artemisa-neutral font-bold text-xs hover:bg-artemisa-border transition-colors border border-artemisa-border"
            >
              No, volver
            </button>
            <button 
              onClick={() => orderToCancel && performStatusUpdate(orderToCancel, 'CANCELADO')}
              className="flex-1 px-4 py-2 rounded-xl bg-artemisa-accent text-artemisa-neutral font-bold text-xs hover:bg-artemisa-secondary transition-colors"
            >
              Sí, cancelar
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};