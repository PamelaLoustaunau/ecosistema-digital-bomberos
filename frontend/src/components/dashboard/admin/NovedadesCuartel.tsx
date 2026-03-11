import React, { useState, useEffect } from 'react';
import { AlertCircle, XCircle, CheckCircle, X, Truck, Gauge, Droplet, Sparkles, Radio } from 'lucide-react';

export function NovedadesCuartel() {
  const [novedades, setNovedades] = useState<any[]>([]);
  const [inventarioCompleto, setInventarioCompleto] = useState<any | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    // Cargar novedades del último inventario
    const ultimoInventario = localStorage.getItem('ultimo_inventario');
    if (ultimoInventario) {
      const inventario = JSON.parse(ultimoInventario);
      
      // Guardar el inventario completo para el modal
      setInventarioCompleto(inventario);
      
      // Filtrar solo los ítems con problemas
      const itemsConProblemas = inventario.estadoCuartel?.filter(
        (item: any) => item.estado === 'falla_leve' || item.estado === 'fuera_servicio'
      ) || [];
      
      setNovedades(itemsConProblemas);
    }
  }, []);

  const getLimpiezaColor = (limpieza: string) => {
    if (limpieza === 'verde') return 'bg-green-500';
    if (limpieza === 'amarillo') return 'bg-amber-500';
    if (limpieza === 'rojo') return 'bg-red-500';
    return 'bg-neutral-500';
  };

  if (novedades.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-white mb-1">Novedades del Cuartel</h2>
          <p className="text-neutral-400 text-sm">Problemas reportados en el último inventario</p>
        </div>

        <div className="bg-green-950 border border-green-800 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-green-300">✓ No hay novedades pendientes</p>
          <p className="text-green-400 text-sm mt-2">Todas las áreas del cuartel están en estado óptimo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <div>
        <h2 className="text-white mb-1">Novedades del Cuartel</h2>
        <p className="text-neutral-400 text-sm">
          {novedades.length} {novedades.length === 1 ? 'problema reportado' : 'problemas reportados'} en el último inventario
        </p>
      </div>

      <div className="space-y-3">
        {novedades.map((novedad, index) => (
          <div
            key={novedad.id || index}
            className={`rounded-xl p-4 border-2 ${
              novedad.estado === 'fuera_servicio'
                ? 'bg-red-950 border-red-800'
                : 'bg-amber-950 border-amber-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {novedad.estado === 'fuera_servicio' ? (
                  <XCircle className="w-6 h-6 text-red-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{novedad.nombre}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      novedad.estado === 'fuera_servicio'
                        ? 'bg-red-900 text-red-300'
                        : 'bg-amber-900 text-amber-300'
                    }`}
                  >
                    {novedad.estado === 'fuera_servicio' ? 'FUERA DE SERVICIO' : 'FALLA LEVE'}
                  </span>
                </div>

                {novedad.comentarios && (
                  <div
                    className={`rounded-lg p-3 ${
                      novedad.estado === 'fuera_servicio'
                        ? 'bg-red-900'
                        : 'bg-amber-900'
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        novedad.estado === 'fuera_servicio'
                          ? 'text-red-200'
                          : 'text-amber-200'
                      }`}
                    >
                      {novedad.comentarios}
                    </p>
                  </div>
                )}

                {!novedad.comentarios && (
                  <p className="text-neutral-400 text-sm italic">Sin comentarios adicionales</p>
                )}
              </div>
            </div>

            {/* Botón de acción */}
            <div className="mt-3 flex gap-2">
              <button className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-2 text-sm transition-all">
                Asignar Mantenimiento
              </button>
              <button className="px-4 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm transition-all">
                Resolver
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info adicional */}
      <div className="bg-blue-950 border border-blue-800 rounded-xl p-4">
        <p className="text-blue-300 text-sm mb-3">
          💡 Estas novedades provienen del último inventario realizado. Asegúrate de resolverlas antes de la próxima guardia.
        </p>
        
        {inventarioCompleto && (
          <button
            onClick={() => setModalAbierto(true)}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
          >
            <Truck className="w-5 h-5" />
            <span>Auditar Inventario Completo</span>
          </button>
        )}
      </div>

      {/* Modal de Auditoría Completa */}
      {modalAbierto && inventarioCompleto && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto">
          <div className="min-h-screen p-4">
            {/* Header del modal */}
            <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between mb-4 rounded-t-xl z-10">
              <div>
                <h2 className="text-white text-lg font-semibold">
                  Auditoría - Guardia N° {inventarioCompleto.encabezado?.numeroGuardia}
                </h2>
                <p className="text-neutral-400 text-sm">
                  {new Date(inventarioCompleto.timestamp).toLocaleString('es-AR')}
                </p>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
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
                    <p className="text-white">{inventarioCompleto.encabezado?.fecha || '-'}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Hora</p>
                    <p className="text-white">{inventarioCompleto.encabezado?.hora || '-'}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Entregó</p>
                    <p className="text-white">{inventarioCompleto.encabezado?.quienEntrega || '-'}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Recibió</p>
                    <p className="text-white">{inventarioCompleto.encabezado?.quienRecibe || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Estado del Cuartel */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <h3 className="text-white mb-3 font-semibold">Estado del Cuartel (11 Áreas)</h3>
                <div className="space-y-2">
                  {inventarioCompleto.estadoCuartel?.map((item: any) => (
                    <div key={item.id} className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {item.estado === 'optimo' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {item.estado === 'falla_leve' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                          {item.estado === 'fuera_servicio' && <XCircle className="w-4 h-4 text-red-500" />}
                          <span className="text-white">{item.nombre}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.estado === 'optimo'
                              ? 'bg-green-900 text-green-300'
                              : item.estado === 'falla_leve'
                              ? 'bg-amber-900 text-amber-300'
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {item.estado === 'optimo'
                            ? 'Óptimo'
                            : item.estado === 'falla_leve'
                            ? 'Falla Leve'
                            : 'F/S'}
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
                    <p className="text-white text-xl">{inventarioCompleto.equipamiento?.handys || 0}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Linternas</p>
                    <p className="text-white text-xl">{inventarioCompleto.equipamiento?.linternas || 0}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Hombre Muerto</p>
                    <p className="text-white text-xl">{inventarioCompleto.equipamiento?.hombreMuerto || 0}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-1">Garrafas</p>
                    <p className="text-white text-xl">
                      {inventarioCompleto.equipamiento?.garrafasLlenas || 0} llenas / {inventarioCompleto.equipamiento?.garrafasVacias || 0} vacías
                    </p>
                  </div>
                </div>
              </div>

              {/* Unidades (10 móviles) */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <h3 className="text-white mb-3 font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-400" />
                  Estado de Unidades (10 Móviles)
                </h3>
                <div className="space-y-3">
                  {inventarioCompleto.unidades?.map((unidad: any) => (
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
    </div>
  );
}