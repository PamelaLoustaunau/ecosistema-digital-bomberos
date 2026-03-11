import React, { useState, useEffect } from 'react';
import { UserCheck, Users, Truck, Clock, TrendingUp } from 'lucide-react';

export function TableroRespuestas() {
  const [respuestas, setRespuestas] = useState({
    confirmados: 8,
    choferes: 3,
    enCamino: 5,
    total: 12
  });

  // Simular actualización en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setRespuestas(prev => ({
        ...prev,
        confirmados: Math.min(prev.total, prev.confirmados + Math.floor(Math.random() * 2)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const bomberos = [
    { id: 1, nombre: 'Juan Pérez', legajo: '101', respuesta: 'confirmado', esChofer: true, tiempo: '00:45' },
    { id: 2, nombre: 'María González', legajo: '102', respuesta: 'confirmado', esChofer: false, tiempo: '00:52' },
    { id: 3, nombre: 'Carlos Rodríguez', legajo: '103', respuesta: 'confirmado', esChofer: true, tiempo: '01:10' },
    { id: 4, nombre: 'Ana Martínez', legajo: '104', respuesta: 'confirmado', esChofer: false, tiempo: '01:23' },
    { id: 5, nombre: 'Luis Fernández', legajo: '105', respuesta: 'confirmado', esChofer: true, tiempo: '01:45' },
    { id: 6, nombre: 'Sofia López', legajo: '106', respuesta: 'confirmado', esChofer: false, tiempo: '02:01' },
    { id: 7, nombre: 'Diego Sánchez', legajo: '107', respuesta: 'confirmado', esChofer: false, tiempo: '02:15' },
    { id: 8, nombre: 'Laura Torres', legajo: '108', respuesta: 'confirmado', esChofer: false, tiempo: '02:30' },
    { id: 9, nombre: 'Pablo Ruiz', legajo: '109', respuesta: 'no_confirmo', esChofer: false, tiempo: '-' },
    { id: 10, nombre: 'Carla Díaz', legajo: '110', respuesta: 'no_confirmo', esChofer: false, tiempo: '-' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Encabezado de emergencia activa */}
      <div className="bg-red-600 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white">Emergencia Activa</h2>
            <p className="text-red-100 text-sm">Incendio Estructural - Av. San Martín 1234</p>
          </div>
          <div className="text-right">
            <div className="text-white text-2xl">03:45</div>
            <p className="text-red-100 text-xs">Tiempo transcurrido</p>
          </div>
        </div>
      </div>

      {/* Métricas en tiempo real */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-900 border border-green-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm">Confirmados</span>
          </div>
          <div className="text-white text-3xl">{respuestas.confirmados}</div>
          <div className="text-green-400 text-xs mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            En tiempo real
          </div>
        </div>

        <div className="bg-blue-900 border border-blue-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-sm">Choferes</span>
          </div>
          <div className="text-white text-3xl">{respuestas.choferes}</div>
          <div className="text-blue-400 text-xs mt-1">Disponibles</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-neutral-400" />
            <span className="text-neutral-300 text-sm">Total Activos</span>
          </div>
          <div className="text-white text-3xl">{respuestas.total}</div>
          <div className="text-neutral-400 text-xs mt-1">Personal de guardia</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-neutral-400" />
            <span className="text-neutral-300 text-sm">Tiempo Prom.</span>
          </div>
          <div className="text-white text-3xl">1:35</div>
          <div className="text-neutral-400 text-xs mt-1">Respuesta</div>
        </div>
      </div>

      {/* Lista de respuestas */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800">
          <h3 className="text-white">Estado de Respuestas</h3>
        </div>
        <div className="divide-y divide-neutral-800 max-h-96 overflow-y-auto">
          {bomberos.map((bombero) => (
            <div key={bombero.id} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  bombero.respuesta === 'confirmado' ? 'bg-green-500' : 'bg-neutral-600'
                }`} />
                <div>
                  <p className="text-white">{bombero.nombre}</p>
                  <p className="text-neutral-400 text-sm">Legajo #{bombero.legajo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {bombero.esChofer && (
                  <div className="bg-blue-900 px-2 py-1 rounded text-blue-300 text-xs">
                    Chofer
                  </div>
                )}
                <div className="text-neutral-300 text-sm min-w-[50px] text-right">
                  {bombero.tiempo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
