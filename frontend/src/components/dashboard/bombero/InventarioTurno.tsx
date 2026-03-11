import React from 'react';
import { Package, Shield, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

interface InventarioTurnoProps {
  user: any;
}

export function InventarioTurno({ user }: InventarioTurnoProps) {
  const eppAsignado = [
    { 
      id: 1, 
      nombre: 'Traje Estructural', 
      codigo: 'TE-102', 
      estado: 'operativo',
      vencimiento: '2026-06-15',
      ultimaRevision: '2025-12-01'
    },
    { 
      id: 2, 
      nombre: 'Casco F1', 
      codigo: 'CF-102', 
      estado: 'operativo',
      vencimiento: '2027-03-20',
      ultimaRevision: '2025-11-15'
    },
    { 
      id: 3, 
      nombre: 'Botas de Seguridad', 
      codigo: 'BS-102', 
      estado: 'operativo',
      vencimiento: '2026-08-10',
      ultimaRevision: '2025-12-10'
    },
    { 
      id: 4, 
      nombre: 'Guantes Anti-Corte', 
      codigo: 'GA-102', 
      estado: 'desgaste',
      vencimiento: '2026-02-28',
      ultimaRevision: '2025-12-20'
    },
  ];

  const calcularDiasVencimiento = (fecha: string) => {
    const hoy = new Date();
    const venc = new Date(fecha);
    const diff = Math.ceil((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getEstadoColor = (dias: number) => {
    if (dias < 30) return 'red';
    if (dias < 90) return 'amber';
    return 'green';
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      <div>
        <h2 className="text-white mb-1">Mi Equipo de Protección</h2>
        <p className="text-neutral-400 text-sm">EPP asignado y estado</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-950 border border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm">Operativos</span>
          </div>
          <div className="text-white text-3xl">3</div>
        </div>

        <div className="bg-amber-950 border border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-amber-300 text-sm">Con Desgaste</span>
          </div>
          <div className="text-white text-3xl">1</div>
        </div>
      </div>

      {/* Lista de EPP */}
      <div className="space-y-3">
        {eppAsignado.map((equipo) => {
          const diasVenc = calcularDiasVencimiento(equipo.vencimiento);
          const colorEstado = getEstadoColor(diasVenc);
          
          return (
            <div
              key={equipo.id}
              className={`bg-neutral-900 border-2 rounded-xl overflow-hidden ${
                equipo.estado === 'operativo' 
                  ? 'border-green-800' 
                  : 'border-amber-800'
              }`}
            >
              {/* Header */}
              <div className={`px-4 py-3 ${
                equipo.estado === 'operativo' 
                  ? 'bg-green-950' 
                  : 'bg-amber-950'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className={`w-5 h-5 ${
                      equipo.estado === 'operativo' ? 'text-green-400' : 'text-amber-400'
                    }`} />
                    <div>
                      <h3 className="text-white">{equipo.nombre}</h3>
                      <p className="text-neutral-400 text-sm">Código: {equipo.codigo}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    equipo.estado === 'operativo'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-amber-900 text-amber-300'
                  }`}>
                    {equipo.estado === 'operativo' ? 'Operativo' : 'Desgaste'}
                  </div>
                </div>
              </div>

              {/* Detalles */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-neutral-400">Vencimiento</p>
                    <p className={`text-${colorEstado}-400`}>
                      {new Date(equipo.vencimiento).toLocaleDateString('es-AR')}
                    </p>
                    <p className="text-neutral-500 text-xs mt-1">
                      {diasVenc > 0 ? `${diasVenc} días restantes` : 'VENCIDO'}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-400">Última Revisión</p>
                    <p className="text-white">
                      {new Date(equipo.ultimaRevision).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>

                {equipo.estado === 'desgaste' && (
                  <div className="bg-amber-950 border border-amber-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-amber-300 text-sm">
                        Equipo con signos de desgaste. Solicitar reemplazo antes del vencimiento.
                      </p>
                    </div>
                  </div>
                )}

                {diasVenc < 30 && diasVenc > 0 && (
                  <div className="bg-red-950 border border-red-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-300 text-sm">
                        ¡Atención! Próximo a vencer. Contacta al encargado de equipamiento.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón de solicitud */}
      <button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-4 flex items-center justify-center gap-2 transition-all">
        <Package className="w-5 h-5" />
        <span>Solicitar Revisión de EPP</span>
      </button>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <p className="text-neutral-300 text-sm">
          <strong className="text-white">Recordatorio:</strong> Todo el EPP debe estar en condiciones 
          óptimas antes de cada salida. Reporta inmediatamente cualquier daño o desgaste.
        </p>
      </div>
    </div>
  );
}