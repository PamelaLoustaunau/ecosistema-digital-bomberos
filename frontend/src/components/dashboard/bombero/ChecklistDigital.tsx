import React, { useState } from 'react';
import { ClipboardCheck, Camera, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ChecklistDigitalProps {
  user: any;
}

type EstadoItem = 'operativo' | 'falla_leve' | 'fuera_servicio' | null;

export function ChecklistDigital({ user }: ChecklistDigitalProps) {
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, EstadoItem>>({});
  const [observaciones, setObservaciones] = useState('');

  const unidades = [
    { id: 'b1', codigo: 'B-1', nombre: 'Autobomba 1' },
    { id: 'b2', codigo: 'B-2', nombre: 'Autobomba 2' },
    { id: 'utr1', codigo: 'UTR-1', nombre: 'Unidad de Rescate' },
  ];

  const itemsChecklist = [
    { id: 'motor', nombre: 'Estado del Motor', categoria: 'Mecánico' },
    { id: 'neumaticos', nombre: 'Neumáticos', categoria: 'Mecánico' },
    { id: 'luces', nombre: 'Luces y Sirena', categoria: 'Eléctrico' },
    { id: 'bomba', nombre: 'Bomba de Agua', categoria: 'Hidráulico' },
    { id: 'mangueras', nombre: 'Mangueras', categoria: 'Equipamiento' },
    { id: 'extintores', nombre: 'Extintores', categoria: 'Equipamiento' },
    { id: 'epp', nombre: 'EPP Completo', categoria: 'Equipamiento' },
    { id: 'herramientas', nombre: 'Herramientas de Corte', categoria: 'Equipamiento' },
    { id: 'combustible', nombre: 'Nivel de Combustible', categoria: 'Mecánico' },
  ];

  const handleEstado = (itemId: string, estado: EstadoItem) => {
    setChecklist({ ...checklist, [itemId]: estado });
  };

  const getIconEstado = (estado: EstadoItem) => {
    if (estado === 'operativo') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (estado === 'falla_leve') return <AlertCircle className="w-5 h-5 text-amber-500" />;
    if (estado === 'fuera_servicio') return <XCircle className="w-5 h-5 text-red-500" />;
    return null;
  };

  const completados = Object.keys(checklist).length;
  const total = itemsChecklist.length;
  const progreso = (completados / total) * 100;

  if (!unidadSeleccionada) {
    return (
      <div className="p-4 space-y-4 pb-8">
        <div>
          <h2 className="text-white mb-1">Checklist de Inicio de Guardia</h2>
          <p className="text-neutral-400 text-sm">Selecciona la unidad a verificar</p>
        </div>

        <div className="space-y-3">
          {unidades.map((unidad) => (
            <button
              key={unidad.id}
              onClick={() => setUnidadSeleccionada(unidad.id)}
              className="w-full bg-neutral-900 border border-neutral-800 hover:border-red-600 rounded-xl p-4 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="bg-red-600 p-3 rounded-lg">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white">{unidad.codigo}</h3>
                  <p className="text-neutral-400 text-sm">{unidad.nombre}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-blue-950 border border-blue-800 rounded-xl p-4">
          <p className="text-blue-300 text-sm">
            El checklist es obligatorio al iniciar guardia. Verifica el estado de todos los 
            componentes y reporta cualquier anomalía.
          </p>
        </div>
      </div>
    );
  }

  const unidadActual = unidades.find(u => u.id === unidadSeleccionada);

  return (
    <div className="p-4 space-y-4 pb-8">
      <button
        onClick={() => setUnidadSeleccionada(null)}
        className="text-neutral-400 hover:text-white flex items-center gap-2"
      >
        ← Cambiar unidad
      </button>

      <div className="bg-red-900 border border-red-700 rounded-xl p-4">
        <h2 className="text-white mb-1">{unidadActual?.codigo}</h2>
        <p className="text-red-200 text-sm">{unidadActual?.nombre}</p>
      </div>

      {/* Barra de progreso */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white">Progreso</span>
          <span className="text-white">{completados}/{total}</span>
        </div>
        <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Items del checklist */}
      <div className="space-y-3">
        {itemsChecklist.map((item) => {
          const estado = checklist[item.id];
          return (
            <div
              key={item.id}
              className={`bg-neutral-900 border rounded-xl p-4 transition-all ${
                estado ? 'border-neutral-700' : 'border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getIconEstado(estado)}
                  <div>
                    <h4 className="text-white">{item.nombre}</h4>
                    <p className="text-neutral-400 text-xs">{item.categoria}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleEstado(item.id, 'operativo')}
                  className={`py-2 rounded-lg text-sm transition-all ${
                    estado === 'operativo'
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  Operativo
                </button>
                <button
                  onClick={() => handleEstado(item.id, 'falla_leve')}
                  className={`py-2 rounded-lg text-sm transition-all ${
                    estado === 'falla_leve'
                      ? 'bg-amber-600 text-white'
                      : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  Falla Leve
                </button>
                <button
                  onClick={() => handleEstado(item.id, 'fuera_servicio')}
                  className={`py-2 rounded-lg text-sm transition-all ${
                    estado === 'fuera_servicio'
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  Fuera
                </button>
              </div>

              {estado && estado !== 'operativo' && (
                <div className="mt-3">
                  <button className="w-full bg-neutral-950 border border-neutral-700 hover:border-neutral-600 text-neutral-300 rounded-lg py-2 flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm">Adjuntar Foto del Daño</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Observaciones */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <label className="block text-white mb-2">Observaciones Generales</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Notas adicionales sobre el estado de la unidad..."
          className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600 min-h-[100px]"
        />
      </div>

      {/* Botón de envío */}
      <button
        disabled={completados < total}
        className={`w-full rounded-xl py-4 flex items-center justify-center gap-2 transition-all ${
          completados === total
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        <span>Finalizar Checklist</span>
      </button>
    </div>
  );
}