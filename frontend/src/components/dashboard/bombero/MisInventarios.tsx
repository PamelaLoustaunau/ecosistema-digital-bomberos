import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ChevronDown, ChevronUp, CheckCircle, AlertCircle, XCircle, Truck, Radio, X, Droplet, Gauge, Sparkles } from 'lucide-react';

interface MisInventariosProps {
  user: any;
}

export function MisInventarios({ user }: MisInventariosProps) {
  const [inventarios, setInventarios] = useState<any[]>([]);
  const [inventarioSeleccionado, setInventarioSeleccionado] = useState<any | null>(null);

  useEffect(() => {
    // Cargar todos los inventarios del localStorage
    const inventariosGuardados = localStorage.getItem('historial_inventarios');
    if (inventariosGuardados) {
      setInventarios(JSON.parse(inventariosGuardados));
    } else {
      // Si no existe historial, usar el último inventario como fallback
      const ultimoInventario = localStorage.getItem('ultimo_inventario');
      if (ultimoInventario) {
        const inventario = JSON.parse(ultimoInventario);
        const historial = [{
          id: Date.now().toString(),
          ...inventario,
          timestamp: new Date().toISOString()
        }];
        setInventarios(historial);
        localStorage.setItem('historial_inventarios', JSON.stringify(historial));
      }
    }
  }, []);

  const getEstadoIcon = (estado: string) => {
    if (estado === 'optimo') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (estado === 'falla_leve') return <AlertCircle className="w-4 h-4 text-amber-500" />;
    if (estado === 'fuera_servicio') return <XCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getEstadoTexto = (estado: string) => {
    if (estado === 'optimo') return 'Óptimo';
    if (estado === 'falla_leve') return 'Falla Leve';
    if (estado === 'fuera_servicio') return 'F/S';
    return '-';
  };

  const getEstadoBadgeColor = (estado: string) => {
    if (estado === 'optimo') return 'bg-green-900 text-green-300';
    if (estado === 'falla_leve') return 'bg-amber-900 text-amber-300';
    if (estado === 'fuera_servicio') return 'bg-red-900 text-red-300';
    return 'bg-neutral-800 text-neutral-400';
  };

  const getLimpiezaColor = (limpieza: string) => {
    if (limpieza === 'verde') return 'bg-green-500';
    if (limpieza === 'amarillo') return 'bg-amber-500';
    if (limpieza === 'rojo') return 'bg-red-500';
    return 'bg-neutral-500';
  };

  if (inventarios.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
        <ClipboardCheck className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
        <p className="text-neutral-400">No hay inventarios registrados</p>
        <p className="text-neutral-500 text-sm mt-2">Completa tu primer inventario de guardia para verlo aquí</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {inventarios.map((inventario) => {
          const fecha = new Date(inventario.timestamp || inventario.encabezado?.fecha);
          const fechaFormateada = fecha.toLocaleDateString('es-AR', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          });

          const itemsConProblemas = inventario.estadoCuartel?.filter(
            (item: any) => item.estado === 'falla_leve' || item.estado === 'fuera_servicio'
          ).length || 0;

          return (
            <div
              key={inventario.id || inventario.timestamp}
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all"
            >
              {/* Header - Resumen */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">Guardia N° {inventario.encabezado?.numeroGuardia || '-'}</h4>
                    <p className="text-neutral-400 text-sm">{fechaFormateada}</p>
                  </div>
                  
                  {itemsConProblemas > 0 && (
                    <div className="bg-amber-900 px-3 py-1 rounded-full">
                      <span className="text-amber-300 text-xs">{itemsConProblemas} problemas</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setInventarioSeleccionado(inventario)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm transition-all"
                >
                  Ver Ficha Completa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Ficha Completa */}
      {inventarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto">
          <div className="min-h-screen p-4">
            {/* Header del modal */}
            <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between mb-4 rounded-t-xl">
              <div>
                <h2 className="text-white text-lg font-semibold">
                  Inventario - Guardia N° {inventarioSeleccionado.encabezado?.numeroGuardia}
                </h2>
                <p className="text-neutral-400 text-sm">
                  {new Date(inventarioSeleccionado.timestamp).toLocaleString('es-AR')}
                </p>
              </div>
              <button
                onClick={() => setInventarioSeleccionado(null)}
                className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="space-y-4 pb-8">
              {/* Encabezado */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <h3 className="text-white mb-3 font-semibold">Información de Guardia</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Fecha</p>
                    <p className="text-white">{inventarioSeleccionado.encabezado?.fecha || '-'}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Hora</p>
                    <p className="text-white">{inventarioSeleccionado.encabezado?.hora || '-'}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Entregó</p>
                    <p className="text-white">{inventarioSeleccionado.encabezado?.quienEntrega || '-'}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Recibió</p>
                    <p className="text-white">{inventarioSeleccionado.encabezado?.quienRecibe || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Estado del Cuartel */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <h3 className="text-white mb-3 font-semibold">Estado del Cuartel</h3>
                <div className="space-y-2">
                  {inventarioSeleccionado.estadoCuartel?.map((item: any) => (
                    <div key={item.id} className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getEstadoIcon(item.estado)}
                          <span className="text-white">{item.nombre}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getEstadoBadgeColor(item.estado)}`}>
                          {getEstadoTexto(item.estado)}
                        </span>
                      </div>
                      {item.comentarios && (
                        <p className="text-neutral-400 text-sm ml-6">{item.comentarios}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipamiento */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <h3 className="text-white mb-3 font-semibold flex items-center gap-2">
                  <Radio className="w-5 h-5 text-purple-400" />
                  Equipamiento
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Handys</p>
                    <p className="text-white text-xl">{inventarioSeleccionado.equipamiento?.handys || 0}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Linternas</p>
                    <p className="text-white text-xl">{inventarioSeleccionado.equipamiento?.linternas || 0}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Hombre Muerto</p>
                    <p className="text-white text-xl">{inventarioSeleccionado.equipamiento?.hombreMuerto || 0}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Garrafas</p>
                    <p className="text-white text-xl">
                      {inventarioSeleccionado.equipamiento?.garrafasLlenas || 0} llenas / {inventarioSeleccionado.equipamiento?.garrafasVacias || 0} vacías
                    </p>
                  </div>
                </div>
              </div>

              {/* Unidades */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <h3 className="text-white mb-3 font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-400" />
                  Estado de Unidades
                </h3>
                <div className="space-y-3">
                  {inventarioSeleccionado.unidades?.map((unidad: any) => (
                    <div key={unidad.codigo} className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-semibold">{unidad.codigo}</span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            unidad.estadoOperativo === 'apresto'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {unidad.estadoOperativo === 'apresto' ? 'APRESTO' : 'F/S'}
                        </span>
                      </div>

                      {/* Combustible */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-amber-400" />
                            <span className="text-neutral-400 text-sm">Combustible</span>
                          </div>
                          <span className="text-white text-sm">{unidad.combustible}%</span>
                        </div>
                        <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500"
                            style={{ width: `${unidad.combustible}%` }}
                          />
                        </div>
                      </div>

                      {/* Agua */}
                      {unidad.agua !== undefined && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Droplet className="w-4 h-4 text-blue-400" />
                              <span className="text-neutral-400 text-sm">Agua</span>
                            </div>
                            <span className="text-white text-sm">{unidad.agua}%</span>
                          </div>
                          <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${unidad.agua}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Limpieza */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-neutral-400 text-sm">Limpieza</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${getLimpiezaColor(unidad.limpieza)}`} />
                            <span className="text-white text-sm capitalize">{unidad.limpieza}</span>
                          </div>
                        </div>
                      </div>

                      {/* Kilometraje */}
                      {unidad.kilometros !== undefined && unidad.kilometros > 0 && (
                        <div className="bg-neutral-900 rounded-lg p-2">
                          <span className="text-neutral-400 text-xs">Kilometraje: </span>
                          <span className="text-white text-sm">{unidad.kilometros.toLocaleString()} km</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
