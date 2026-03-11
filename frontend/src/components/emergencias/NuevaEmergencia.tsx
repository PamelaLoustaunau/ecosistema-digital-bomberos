import React, { useState } from 'react';
import { X, AlertTriangle, MapPin, Phone, FileText, Send } from 'lucide-react';
import { obtenerISO_Argentina } from '../../utils/fecha-argentina';

interface NuevaEmergenciaProps {
  onClose: () => void;
  onSubmit: (emergencia: any) => void;
}

export function NuevaEmergencia({ onClose, onSubmit }: NuevaEmergenciaProps) {
  const [formData, setFormData] = useState({
    tipo: '',
    direccion: '',
    referencias: '',
    nivel: 'medio' as 'alto' | 'medio' | 'bajo',
    coordenadas: { lat: -34.6037, lng: -58.3816 } // Buenos Aires por defecto
  });

  const tiposSiniestro = [
    { id: 'incendio_estructural', nombre: 'Incendio Estructural', icon: '🔥' },
    { id: 'principio_incendio', nombre: 'Principio de Incendio', icon: '🔥' },
    { id: 'rescate_vehicular', nombre: 'Rescate Vehicular', icon: '🚗' },
    { id: 'incendio_vehicular', nombre: 'Incendio Vehicular', icon: '🚙' },
    { id: 'materiales_peligrosos', nombre: 'Materiales Peligrosos', icon: '☢️' },
    { id: 'rescate_altura', nombre: 'Rescate en Altura', icon: '🏢' },
    { id: 'inundacion', nombre: 'Inundación', icon: '🌊' },
    { id: 'arbol_caido', nombre: 'Árbol Caído', icon: '🌳' },
    { id: 'fuga_gas', nombre: 'Fuga de Gas', icon: '💨' },
    { id: 'otros', nombre: 'Otros', icon: '⚠️' },
  ];

  const handleSubmit = () => {
    if (!formData.tipo || !formData.direccion) {
      alert('Por favor completa tipo de siniestro y dirección');
      return;
    }

    const emergencia = {
      ...formData,
      timestamp: obtenerISO_Argentina(),
      reportadoPor: 'Guardia' // En producción sería el usuario actual
    };

    onSubmit(emergencia);
  };

  const simularUbicacionActual = () => {
    // Simula obtener ubicación GPS
    const lat = -34.6037 + (Math.random() - 0.5) * 0.1;
    const lng = -58.3816 + (Math.random() - 0.5) * 0.1;
    setFormData({ ...formData, coordenadas: { lat, lng } });
    alert('Ubicación obtenida por GPS');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 overflow-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-red-600 rounded-t-xl p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
              <h2 className="text-white">Nueva Emergencia</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-red-700 p-2 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Formulario */}
          <div className="bg-neutral-900 border-x-2 border-b-2 border-red-600 rounded-b-xl p-6 space-y-6">
            {/* Tipo de Siniestro */}
            <div>
              <label className="block text-white mb-3">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Tipo de Siniestro *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tiposSiniestro.map((tipo) => (
                  <button
                    key={tipo.id}
                    onClick={() => setFormData({ ...formData, tipo: tipo.nombre })}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.tipo === tipo.nombre
                        ? 'bg-red-600 border-red-500 text-white'
                        : 'bg-neutral-950 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{tipo.icon}</span>
                      <span className="text-sm">{tipo.nombre}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-white mb-3">
                <MapPin className="w-4 h-4 inline mr-2" />
                Dirección del Incidente *
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Ej: Av. San Martín 1234"
                className="w-full bg-neutral-950 border-2 border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 mb-3"
              />
              <button
                onClick={simularUbicacionActual}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all border border-neutral-600"
              >
                <Phone className="w-5 h-5" />
                <span>Usar Mi Ubicación GPS</span>
              </button>
            </div>

            {/* Referencias */}
            <div>
              <label className="block text-white mb-3">Referencias / Detalles</label>
              <textarea
                value={formData.referencias}
                onChange={(e) => setFormData({ ...formData, referencias: e.target.value })}
                placeholder="Ej: Entre calles Moreno y Belgrano, edificio de 3 pisos color verde"
                className="w-full bg-neutral-950 border-2 border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 min-h-[100px]"
              />
            </div>

            {/* Nivel de Riesgo */}
            <div>
              <label className="block text-white mb-3">Nivel de Riesgo *</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setFormData({ ...formData, nivel: 'bajo' })}
                  className={`py-4 rounded-xl border-2 transition-all ${
                    formData.nivel === 'bajo'
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                  }`}
                >
                  <div className="text-2xl mb-1">🟢</div>
                  <div className="text-sm">BAJO</div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, nivel: 'medio' })}
                  className={`py-4 rounded-xl border-2 transition-all ${
                    formData.nivel === 'medio'
                      ? 'bg-amber-600 border-amber-500 text-white'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                  }`}
                >
                  <div className="text-2xl mb-1">🟡</div>
                  <div className="text-sm">MEDIO</div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, nivel: 'alto' })}
                  className={`py-4 rounded-xl border-2 transition-all ${
                    formData.nivel === 'alto'
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                  }`}
                >
                  <div className="text-2xl mb-1">🔴</div>
                  <div className="text-sm">ALTO</div>
                </button>
              </div>
            </div>

            {/* Vista previa de coordenadas */}
            <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4">
              <p className="text-neutral-400 text-sm mb-1">Coordenadas GPS</p>
              <p className="text-white text-sm">
                Lat: {formData.coordenadas.lat.toFixed(6)}, Lng: {formData.coordenadas.lng.toFixed(6)}
              </p>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-5 flex items-center justify-center gap-3 transition-all shadow-lg shadow-red-900/50"
              >
                <Send className="w-6 h-6" />
                <span className="text-xl">ENVIAR ALERTA</span>
              </button>

              <button
                onClick={onClose}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl py-3 transition-all border border-neutral-600"
              >
                Cancelar
              </button>
            </div>

            {/* Nota informativa */}
            <div className="bg-amber-950 border border-amber-800 rounded-xl p-4">
              <p className="text-amber-300 text-sm">
                ⚠️ Al enviar esta alerta, se notificará a todo el personal. El operador de guardia designará las unidades según el protocolo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}