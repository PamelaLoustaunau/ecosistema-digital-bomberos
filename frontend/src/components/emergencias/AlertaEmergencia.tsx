import React, { useState, useEffect } from 'react';
import { AlertCircle, Phone, MapPin, Clock } from 'lucide-react';

interface AlertaEmergenciaProps {
  alerta: {
    tipo: string;
    direccion: string;
    nivel: 'alto' | 'medio' | 'bajo';
    timestamp: string;
  };
  onResponse: (response: 'voy' | 'no_puedo') => void;
}

export function AlertaEmergencia({ alerta, onResponse }: AlertaEmergenciaProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo con blur estático */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
      
      {/* Contenido de la alerta */}
      <div className="w-full max-w-lg relative z-10">
        {/* Barra de alerta crítica */}
        <div className="bg-red-600 text-white py-3 px-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 animate-pulse" />
            <span className="uppercase tracking-wide">Emergencia Activa</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>

        {/* Detalles de la emergencia */}
        <div className="bg-neutral-900 border-x-2 border-red-600 p-6 space-y-4">
          <div>
            <h2 className="text-white mb-2">{alerta.tipo}</h2>
            <div className="flex items-start gap-2 text-neutral-300">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-red-500" />
              <span className="text-lg">{alerta.direccion}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
              <p className="text-neutral-400 text-sm">Nivel</p>
              <p className="text-white uppercase">
                {alerta.nivel === 'alto' ? '🔴 Alto' : alerta.nivel === 'medio' ? '🟡 Medio' : '🟢 Bajo'}
              </p>
            </div>
            <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
              <p className="text-neutral-400 text-sm">Hora</p>
              <p className="text-white">
                {new Date(alerta.timestamp).toLocaleTimeString('es-AR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Botones de respuesta - EXTRA GRANDES para uso con guantes */}
        <div className="bg-neutral-900 border-x-2 border-b-2 border-red-600 rounded-b-2xl p-6 space-y-3">
          <button
            onClick={() => onResponse('voy')}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-5 flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-900/50"
          >
            <Phone className="w-6 h-6" />
            <span className="text-xl">VOY - Confirmo Asistencia</span>
          </button>

          <button
            onClick={() => onResponse('no_puedo')}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl py-5 flex items-center justify-center gap-3 transition-all border border-neutral-600"
          >
            <span className="text-xl">NO PUEDO</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-neutral-500 text-sm">
            Sistema de Despacho de Emergencias
          </p>
        </div>
      </div>
    </div>
  );
}