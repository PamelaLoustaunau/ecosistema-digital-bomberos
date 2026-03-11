import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, AlertCircle, Wrench, Droplet, Gauge } from 'lucide-react';

export function EstadoUnidades() {
  const [unidades, setUnidades] = useState([
    {
      id: '12',
      codigo: 'B-12',
      tipo: 'Autobomba',
      estado: 'operativa',
      ultimoCheckeo: '2 horas',
      responsable: 'Juan Pérez',
      combustible: 85,
      agua: 100,
      km: 45230
    },
    {
      id: '19',
      codigo: 'B-19',
      tipo: 'Autobomba',
      estado: 'operativa',
      ultimoCheckeo: '1 hora',
      responsable: 'Carlos Rodríguez',
      combustible: 92,
      agua: 100,
      km: 38450
    },
    {
      id: '20',
      codigo: 'B-20',
      tipo: 'Autobomba',
      estado: 'operativa',
      ultimoCheckeo: '3 horas',
      responsable: 'María González',
      combustible: 70,
      agua: 100,
      km: 52100
    },
    {
      id: '22',
      codigo: 'B-22',
      tipo: 'Autobomba',
      estado: 'operativa',
      ultimoCheckeo: '2 días',
      responsable: '-',
      combustible: 45,
      agua: 100,
      km: 61200,
      problemaReportado: null
    },
    {
      id: '23',
      codigo: 'UTR-23',
      tipo: 'Unidad de Rescate',
      estado: 'mantenimiento',
      ultimoCheckeo: '5 horas',
      responsable: 'Luis Fernández',
      combustible: 60,
      agua: 0,
      km: 28900
    },
    {
      id: '24',
      codigo: 'UTR-24',
      tipo: 'Unidad de Rescate',
      estado: 'mantenimiento',
      ultimoCheckeo: '1 día',
      responsable: '-',
      combustible: 0,
      agua: 0,
      km: 0
    },
    {
      id: '25',
      codigo: 'AE-25',
      tipo: 'Autoescala',
      estado: 'mantenimiento',
      ultimoCheckeo: '1 día',
      responsable: '-',
      combustible: 0,
      agua: 0,
      km: 0
    },
    {
      id: '26',
      codigo: 'B-26',
      tipo: 'Autobomba',
      estado: 'operativa',
      ultimoCheckeo: '30 min',
      responsable: 'Pedro Martínez',
      combustible: 95,
      agua: 100,
      km: 34200
    },
    {
      id: '27',
      codigo: 'B-27',
      tipo: 'Autobomba',
      estado: 'operativa',
      ultimoCheckeo: '1 hora',
      responsable: 'Sofía López',
      combustible: 88,
      agua: 100,
      km: 42100
    },
    {
      id: '2302',
      codigo: 'CA-2302',
      tipo: 'Camión Cisterna',
      estado: 'operativa',
      ultimoCheckeo: '45 min',
      responsable: 'Diego Fernández',
      combustible: 100,
      agua: 100,
      km: 19500
    }
  ]);

  useEffect(() => {
    // Cargar datos del último inventario
    const ultimoInventario = localStorage.getItem('ultimo_inventario');
    if (ultimoInventario) {
      const inventario = JSON.parse(ultimoInventario);
      
      // Actualizar unidades con datos del inventario
      if (inventario.unidades) {
        setUnidades(prevUnidades => 
          prevUnidades.map(unidad => {
            const unidadInventario = inventario.unidades.find(
              (u: any) => u.codigo === unidad.codigo
            );
            
            if (unidadInventario) {
              return {
                ...unidad,
                combustible: unidadInventario.combustible,
                agua: unidadInventario.agua || unidad.agua,
                km: unidadInventario.kilometros || unidad.km,
                estado: unidadInventario.estadoOperativo === 'fs' ? 'mantenimiento' : 'operativa',
                ultimoCheckeo: 'Recién',
                problemaReportado: unidadInventario.estadoOperativo === 'fs' 
                  ? 'Unidad reportada como FUERA DE SERVICIO en el último inventario'
                  : null
              };
            }
            
            return unidad;
          })
        );
      }
    }
  }, []);

  const unidadesOperativas = unidades.filter(u => u.estado === 'operativa').length;
  const unidadesMantenimiento = unidades.filter(u => u.estado === 'mantenimiento').length;

  return (
    <div className="p-4 space-y-4 pb-24">
      <div>
        <h2 className="text-white mb-1">Estado de Unidades</h2>
        <p className="text-neutral-400 text-sm">Móviles y equipamiento mayor</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-950 border border-green-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm">Operativas</span>
          </div>
          <div className="text-white text-2xl">{unidadesOperativas}</div>
        </div>

        <div className="bg-amber-950 border border-amber-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm">Mantenimiento</span>
          </div>
          <div className="text-white text-2xl">{unidadesMantenimiento}</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Truck className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-300 text-sm">Total</span>
          </div>
          <div className="text-white text-2xl">{unidades.length}</div>
        </div>
      </div>

      {/* Lista de unidades */}
      <div className="space-y-3">
        {unidades.map((unidad) => (
          <div
            key={unidad.id}
            className={`bg-neutral-900 rounded-xl overflow-hidden border-2 ${
              unidad.estado === 'operativa'
                ? 'border-green-800'
                : 'border-red-800'
            }`}
          >
            {/* Header */}
            <div className={`px-4 py-3 ${
              unidad.estado === 'operativa'
                ? 'bg-green-950'
                : 'bg-red-950'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className={`w-5 h-5 ${
                    unidad.estado === 'operativa' ? 'text-green-400' : 'text-red-400'
                  }`} />
                  <div>
                    <h3 className="text-white">{unidad.codigo}</h3>
                    <p className="text-neutral-400 text-sm">{unidad.tipo}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm uppercase ${
                  unidad.estado === 'operativa'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-red-900 text-red-300'
                }`}>
                  {unidad.estado === 'operativa' ? 'OPERATIVA' : 'FUERA DE SERVICIO'}
                </div>
              </div>
            </div>

            {/* Detalles */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-neutral-400">Último Checkeo</p>
                  <p className="text-white">Hace {unidad.ultimoCheckeo}</p>
                </div>
                <div>
                  <p className="text-neutral-400">Responsable</p>
                  <p className="text-white">{unidad.responsable}</p>
                </div>
                <div>
                  <p className="text-neutral-400">Kilometraje</p>
                  <p className="text-white">{unidad.km.toLocaleString()} km</p>
                </div>
              </div>

              {/* Combustible */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-amber-400" />
                    <p className="text-neutral-400 text-sm">Combustible</p>
                  </div>
                  <span className="text-white text-sm">{unidad.combustible}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-neutral-950 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        unidad.combustible > 70 ? 'bg-green-500' :
                        unidad.combustible > 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${unidad.combustible}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Agua (solo para autobombas y cisternas) */}
              {(unidad.codigo.startsWith('B-') || unidad.codigo.startsWith('CA-')) && unidad.agua > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-400" />
                      <p className="text-neutral-400 text-sm">Agua</p>
                    </div>
                    <span className="text-white text-sm">{unidad.agua}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-neutral-950 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${unidad.agua}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {unidad.problemaReportado && (
                <div className="bg-red-950 border border-red-800 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{unidad.problemaReportado}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
