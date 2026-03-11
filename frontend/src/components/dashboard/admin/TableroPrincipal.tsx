import React from 'react';
import { Users, Truck, AlertCircle, CheckCircle, Clock, TrendingUp, Flame, User } from 'lucide-react';
import { formatearHoraArgentina } from '../../../utils/fecha-argentina';

interface TableroPrincipalProps {
  emergenciasDelDia?: any[];
  onToggleModoOperativo?: () => void;
}

export function TableroPrincipal({ emergenciasDelDia = [], onToggleModoOperativo }: TableroPrincipalProps) {
  const stats = {
    personalActivo: 12,
    enGuardia: 8,
    unidadesOperativas: 4,
    unidadesMantenimiento: 1,
    incidentesMes: 23,
    horasServicio: 456
  };

  const ultimasEmergencias = [
    { id: 1, tipo: 'Incendio Estructural', direccion: 'Av. San Martín 1234', hora: '14:30', estado: 'finalizado' },
    { id: 2, tipo: 'Rescate Vehicular', direccion: 'Ruta 9 Km 45', hora: '11:15', estado: 'finalizado' },
    { id: 3, tipo: 'Principio de Incendio', direccion: 'Calle Mitre 567', hora: '09:45', estado: 'finalizado' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Resumen ejecutivo */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-white mb-1">Dashboard Operativo</h2>
          <p className="text-neutral-400 text-sm">Resumen en tiempo real del cuartel</p>
        </div>
      </div>

      {/* Toggle Modo Operativo */}
      {onToggleModoOperativo && (
        <button
          onClick={onToggleModoOperativo}
          className="w-full bg-blue-900 hover:bg-blue-800 border border-blue-700 text-blue-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all"
        >
          <User className="w-5 h-5" />
          <span className="font-semibold">Cambiar a Modo Operativo (Vista Bombero)</span>
        </button>
      )}

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-green-900 to-green-950 border border-green-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm">Personal Activo</span>
          </div>
          <div className="text-white text-3xl">{stats.personalActivo}</div>
          <div className="text-green-400 text-xs mt-1">
            {stats.enGuardia} en guardia ahora
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-sm">Unidades</span>
          </div>
          <div className="text-white text-3xl">{stats.unidadesOperativas}</div>
          <div className="text-blue-400 text-xs mt-1">
            {stats.unidadesMantenimiento} en mantenimiento
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-900 to-red-950 border border-red-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 text-sm">Incidentes</span>
          </div>
          <div className="text-white text-3xl">{stats.incidentesMes}</div>
          <div className="text-red-400 text-xs mt-1">Este mes</div>
        </div>

        <div className="bg-gradient-to-br from-amber-900 to-amber-950 border border-amber-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-amber-300 text-sm">Horas de Servicio</span>
          </div>
          <div className="text-white text-3xl">{stats.horasServicio}</div>
          <div className="text-amber-400 text-xs mt-1">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            +12% vs mes anterior
          </div>
        </div>
      </div>

      {/* Últimas emergencias */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-white">Emergencias del Día</h3>
          {emergenciasDelDia.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-sm">{emergenciasDelDia.length} {emergenciasDelDia.length === 1 ? 'activa' : 'activas'}</span>
            </div>
          )}
        </div>
        <div className="divide-y divide-neutral-800">
          {emergenciasDelDia.length > 0 ? (
            emergenciasDelDia.map((emergencia) => (
              <div key={emergencia.id} className="px-4 py-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <Flame className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-white">{emergencia.tipo}</p>
                      <p className="text-neutral-400 text-sm">{emergencia.direccion}</p>
                    </div>
                  </div>
                  <span className="text-neutral-500 text-sm">{formatearHoraArgentina(emergencia.timestamp)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {emergencia.informe ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-400 text-sm">Finalizado</span>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      </div>
                      <span className="text-red-400 text-sm font-semibold">En curso</span>
                    </>
                  )}
                </div>
                
                {/* Información de Recursos (solo en emergencias activas) */}
                {!emergencia.informe && emergencia.informeBorrador && (
                  <div className="mt-3 bg-neutral-900 border border-neutral-700 rounded-lg p-3 space-y-2">
                    {emergencia.informeBorrador.unidadesUtilizadas?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-blue-400" />
                        <span className="text-neutral-400">Unidades:</span>
                        <span className="text-blue-400 font-semibold">
                          {emergencia.informeBorrador.unidadesUtilizadas.join(', ')}
                        </span>
                      </div>
                    )}
                    {emergencia.informeBorrador.bomberosPresentes?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-neutral-400">Personal en respuesta:</span>
                        <span className="text-green-400 font-semibold">
                          {emergencia.informeBorrador.bomberosPresentes.length} bombero{emergencia.informeBorrador.bomberosPresentes.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            ultimasEmergencias.map((emergencia) => (
              <div key={emergencia.id} className="px-4 py-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white">{emergencia.tipo}</p>
                    <p className="text-neutral-400 text-sm">{emergencia.direccion}</p>
                  </div>
                  <span className="text-neutral-500 text-sm">{emergencia.hora}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-400 text-sm">Finalizado</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alertas del sistema */}
      <div className="bg-amber-950 border border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <h4 className="text-amber-200">Atención Requerida</h4>
            <p className="text-amber-300 text-sm mt-1">
              Autobomba B-1 requiere servicio de mantenimiento preventivo
            </p>
            <button className="mt-2 text-amber-400 text-sm hover:text-amber-300">
              Ver detalles →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}