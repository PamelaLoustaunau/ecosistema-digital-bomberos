import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Droplet, Cross, Navigation, Clock, X, Layers, AlertTriangle, ArrowLeft, Wind, Gauge, Activity } from 'lucide-react';

interface MapaOperativoProps {
  emergenciaActiva?: any;
  emergenciasDelDia?: any[]; // Array de TODAS las emergencias
  onClose?: () => void;
}

export function MapaOperativo({ emergenciaActiva, emergenciasDelDia = [], onClose }: MapaOperativoProps) {
  const [capasVisibles, setCapasVisibles] = useState({
    hidrantes: true,
    centrosSalud: true,
    unidades: true,
    telemetria: true // Activado por defecto
  });

  // Filtrar TODAS las emergencias activas (sin informe)
  const emergenciasActivas = emergenciasDelDia.filter(e => !e.informe);
  
  // Determinar si hay al menos una emergencia activa
  const hayEmergenciaActiva = emergenciasActivas.length > 0;

  // Posiciones simuladas de unidades (se actualizarían en tiempo real)
  const [unidades, setUnidades] = useState([
    { id: 'b1', codigo: 'B-1', lat: -34.6037, lng: -58.3816, estado: 'disponible', eta: '4:30', velocidad: 0, nivelAgua: 100 },
    { id: 'b2', codigo: 'B-2', lat: -34.6100, lng: -58.3700, estado: 'disponible', eta: '7:15', velocidad: 0, nivelAgua: 100 },
    { id: 'utr1', codigo: 'UTR-1', lat: -34.5980, lng: -58.3900, estado: 'disponible', eta: '5:45', velocidad: 0, nivelAgua: 0 },
  ]);

  // Actualizar estado de unidades cuando hay emergencia activa
  useEffect(() => {
    if (hayEmergenciaActiva && emergenciaActiva && emergenciaActiva.informeBorrador?.unidadesUtilizadas) {
      // Marcar unidades asignadas como "en_ruta"
      setUnidades(prev => prev.map(unidad => {
        const estaAsignada = emergenciaActiva.informeBorrador.unidadesUtilizadas.includes(unidad.codigo);
        if (estaAsignada) {
          return {
            ...unidad,
            estado: 'en_ruta',
            velocidad: 68
          };
        }
        return {
          ...unidad,
          estado: 'disponible',
          velocidad: 0
        };
      }));
    } else {
      // Resetear todas las unidades a disponible
      setUnidades(prev => prev.map(unidad => ({
        ...unidad,
        estado: 'disponible',
        velocidad: 0
      })));
    }
  }, [hayEmergenciaActiva, emergenciaActiva]);

  // Puntos de interés
  const hidrantes = [
    { id: 1, lat: -34.6050, lng: -58.3800, presion: 'alta' },
    { id: 2, lat: -34.6020, lng: -58.3850, presion: 'media' },
    { id: 3, lat: -34.6070, lng: -58.3780, presion: 'alta' },
    { id: 4, lat: -34.6040, lng: -58.3900, presion: 'baja' },
  ];

  const centrosSalud = [
    { id: 1, nombre: 'Hospital Municipal', lat: -34.6000, lng: -58.3750 },
    { id: 2, nombre: 'Clínica San José', lat: -34.6120, lng: -58.3820 },
  ];

  // Simular movimiento de unidades en ruta
  useEffect(() => {
    const interval = setInterval(() => {
      setUnidades(prev => prev.map(unidad => {
        if (unidad.estado === 'en_ruta' && emergenciaActiva) {
          // Mover la unidad hacia el incidente
          const deltaLat = (emergenciaActiva.coordenadas.lat - unidad.lat) * 0.05;
          const deltaLng = (emergenciaActiva.coordenadas.lng - unidad.lng) * 0.05;
          return {
            ...unidad,
            lat: unidad.lat + deltaLat,
            lng: unidad.lng + deltaLng
          };
        }
        return unidad;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [emergenciaActiva]);

  const toggleCapa = (capa: keyof typeof capasVisibles) => {
    setCapasVisibles({ ...capasVisibles, [capa]: !capasVisibles[capa] });
  };

  // Calcular límites del mapa para centrar todos los elementos
  const centerLat = emergenciaActiva?.coordenadas.lat || -34.6037;
  const centerLng = emergenciaActiva?.coordenadas.lng || -58.3816;

  // Obtener unidades en ruta para mostrar telemetría
  const unidadesEnRuta = unidades.filter(u => u.estado === 'en_ruta');
  const primeraUnidad = unidadesEnRuta[0];

  return (
    <div className="fixed inset-0 z-40 bg-black flex">
      {/* Mapa principal */}
      <div className="flex-1 relative overflow-hidden">
        {/* Simulación de mapa oscuro */}
        <div className="relative w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
          {/* Grid de calles simulado */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Botón de volver */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-40 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-white rounded-xl px-4 py-3 flex items-center gap-2 shadow-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
          )}

          {/* Nombres de calles simulados */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 text-neutral-600 text-xs rotate-45">Av. San Martín</div>
            <div className="absolute top-1/3 right-1/4 text-neutral-600 text-xs">Calle Belgrano</div>
            <div className="absolute bottom-1/3 left-1/3 text-neutral-600 text-xs rotate-12">Av. Rivadavia</div>
          </div>

          {/* Marcadores de TODAS las emergencias activas (sin duplicados) */}
          {emergenciasActivas.map((emergencia, idx) => (
            <div 
              key={emergencia.id}
              className="absolute z-30 animate-pulse"
              style={{ 
                left: `${45 + idx * 10}%`, 
                top: `${45 + idx * 10}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative">
                {/* Círculo de pulso */}
                <div className="absolute inset-0 -m-8">
                  <div className="w-16 h-16 bg-red-500 rounded-full opacity-20 animate-ping"></div>
                </div>
                {/* Marcador principal */}
                <div className="bg-red-600 p-4 rounded-full shadow-lg shadow-red-900/50 relative z-10">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                {/* Info del incidente */}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-neutral-900 border-2 border-red-600 rounded-lg px-4 py-2 shadow-xl">
                    <p className="text-white font-semibold text-sm">{emergencia.tipo}</p>
                    <p className="text-red-400 text-xs">{emergencia.direccion}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Marcadores de Unidades */}
          {capasVisibles.unidades && unidades.map((unidad, idx) => (
            <div
              key={unidad.id}
              className="absolute z-20 transition-all duration-2000"
              style={{
                left: `${30 + idx * 15}%`,
                top: `${40 + idx * 10}%`,
              }}
            >
              <div className="relative group">
                <div className={`p-3 rounded-lg shadow-lg ${
                  unidad.estado === 'en_ruta' && emergenciaActiva && !emergenciaActiva.informe
                    ? 'bg-green-600 animate-pulse' 
                    : unidad.estado === 'disponible'
                    ? 'bg-blue-600'
                    : 'bg-neutral-700'
                }`}>
                  <Truck className="w-6 h-6 text-white" />
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                    <p className="text-white font-semibold">{unidad.codigo}</p>
                    <p className="text-neutral-400 text-xs capitalize">{unidad.estado.replace('_', ' ')}</p>
                    {unidad.estado === 'en_ruta' && emergenciaActiva && !emergenciaActiva.informe && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-green-400" />
                        <span className="text-green-400 text-xs">ETA: {unidad.eta}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Marcadores de Hidrantes */}
          {capasVisibles.hidrantes && hidrantes.map((hidrante, idx) => (
            <div
              key={hidrante.id}
              className="absolute z-10"
              style={{
                left: `${25 + idx * 18}%`,
                top: `${30 + idx * 15}%`,
              }}
            >
              <div className="relative group">
                <div className={`p-2 rounded-full shadow-lg ${
                  hidrante.presion === 'alta' ? 'bg-blue-600' :
                  hidrante.presion === 'media' ? 'bg-blue-700' : 'bg-blue-900'
                }`}>
                  <Droplet className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-neutral-900 border border-blue-600 rounded px-2 py-1 whitespace-nowrap text-xs">
                    <span className="text-blue-400">Hidrante #{hidrante.id}</span>
                    <span className="text-neutral-400 ml-2 capitalize">({hidrante.presion})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Marcadores de Centros de Salud */}
          {capasVisibles.centrosSalud && centrosSalud.map((centro, idx) => (
            <div
              key={centro.id}
              className="absolute z-10"
              style={{
                left: `${20 + idx * 50}%`,
                top: `${25 + idx * 40}%`,
              }}
            >
              <div className="relative group">
                <div className="bg-green-600 p-2 rounded-full shadow-lg">
                  <Cross className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-neutral-900 border border-green-600 rounded px-2 py-1 whitespace-nowrap text-xs">
                    <span className="text-green-400">{centro.nombre}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Panel de control de capas */}
          <div className="absolute top-20 left-4 z-30 space-y-2">
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-5 h-5 text-neutral-400" />
                <h3 className="text-white">Capas</h3>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={capasVisibles.unidades}
                    onChange={() => toggleCapa('unidades')}
                    className="w-4 h-4 rounded bg-neutral-950 border-neutral-600"
                  />
                  <Truck className="w-4 h-4 text-green-400" />
                  <span className="text-neutral-300 text-sm">Unidades</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={capasVisibles.hidrantes}
                    onChange={() => toggleCapa('hidrantes')}
                    className="w-4 h-4 rounded bg-neutral-950 border-neutral-600"
                  />
                  <Droplet className="w-4 h-4 text-blue-400" />
                  <span className="text-neutral-300 text-sm">Hidrantes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={capasVisibles.centrosSalud}
                    onChange={() => toggleCapa('centrosSalud')}
                    className="w-4 h-4 rounded bg-neutral-950 border-neutral-600"
                  />
                  <Cross className="w-4 h-4 text-green-400" />
                  <span className="text-neutral-300 text-sm">Centros de Salud</span>
                </label>
                {/* Checkbox de Telemetría - solo visible si hay emergencia activa */}
                {hayEmergenciaActiva && unidadesEnRuta.length > 0 && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capasVisibles.telemetria}
                      onChange={() => toggleCapa('telemetria')}
                      className="w-4 h-4 rounded bg-neutral-950 border-neutral-600"
                    />
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span className="text-neutral-300 text-sm">Telemetría y Riesgos</span>
                  </label>
                )}
              </div>
            </div>

            {/* Leyenda */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 shadow-xl">
              <h4 className="text-white text-sm mb-2">Leyenda</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-neutral-300">Incidente Activo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-neutral-300">Unidad en Ruta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-neutral-300">Disponible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay de ETA */}
          {emergenciaActiva && !emergenciaActiva.informe && primeraUnidad && (
            <div className="absolute top-4 right-4 z-30">
              <div className="bg-green-900 border-2 border-green-600 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-green-300 text-xs">Primera Unidad: {primeraUnidad.codigo}</p>
                    <p className="text-white text-2xl">{primeraUnidad.eta}</p>
                  </div>
                </div>
                <div className="text-green-400 text-xs">
                  <Navigation className="w-3 h-3 inline mr-1" />
                  {primeraUnidad.codigo} en ruta
                </div>
              </div>
            </div>
          )}

          {/* Mensaje cuando no hay incidente activo */}
          {(!emergenciaActiva || emergenciaActiva.informe) && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="bg-neutral-900 border-2 border-neutral-700 rounded-xl p-6 text-center max-w-md">
                <MapPin className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-white mb-2">Sin Incidentes Activos</h3>
                <p className="text-neutral-400 text-sm">
                  El mapa muestra la ubicación de recursos disponibles. Los incidentes activos se mostrarán aquí en tiempo real.
                </p>
              </div>
            </div>
          )}

          {/* Info de coordenadas */}
          <div className="absolute bottom-4 left-4 z-30 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-400">
            Centro: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Panel lateral de telemetría - Controlado por checkbox cuando hay emergencia activa */}
      {hayEmergenciaActiva && unidadesEnRuta.length > 0 && capasVisibles.telemetria && (
        <div className="w-96 bg-neutral-900 border-l border-neutral-800 flex flex-col overflow-hidden">
          {/* Header del panel */}
          <div className="bg-neutral-950 border-b border-neutral-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <h3 className="text-white">Telemetría en Tiempo Real</h3>
              </div>
            </div>
            <p className="text-neutral-400 text-xs">
              {primeraUnidad && `Primera Unidad: ${primeraUnidad.codigo}`}
            </p>
          </div>

          {/* Contenedor scrolleable */}
          <div className="flex-1 overflow-y-auto pb-[140px]">
            <div className="p-4 space-y-4">
              {/* Condiciones Ambientales */}
              <div className="bg-amber-900 border-2 border-amber-600 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wind className="w-5 h-5 text-amber-400" />
                  <h4 className="text-white">Condiciones Ambientales</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300">Viento:</span>
                    <span className="text-white">18 km/h NO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-amber-950 rounded-full h-2">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-amber-300 text-xs">Moderado</span>
                  </div>
                </div>
              </div>

              {/* Telemetría de Unidades Despachadas */}
              <div className="bg-neutral-950 border border-neutral-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="w-5 h-5 text-green-400" />
                  <h4 className="text-white">Unidades Despachadas</h4>
                </div>
                <div className="space-y-3">
                  {unidadesEnRuta.map((unidad) => (
                    <div key={unidad.id} className="bg-neutral-900 rounded-lg p-3 border border-neutral-800">
                      <p className="text-white mb-2">{unidad.codigo}</p>
                      <div className="space-y-2 text-xs">
                        {/* Velocidad */}
                        <div className="flex items-center gap-2">
                          <Gauge className="w-3 h-3 text-blue-400" />
                          <span className="text-neutral-400">Velocidad:</span>
                          <span className="ml-auto text-blue-400">
                            {unidad.velocidad} km/h
                          </span>
                        </div>
                        {/* ETA */}
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-green-400" />
                          <span className="text-neutral-400">ETA:</span>
                          <span className="ml-auto text-green-400">{unidad.eta}</span>
                        </div>
                        {/* Nivel de Agua (solo autobombas) */}
                        {(unidad.codigo.startsWith('B-')) && (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Droplet className="w-3 h-3 text-cyan-400" />
                              <span className="text-neutral-400">Agua:</span>
                              <span className={`ml-auto ${
                                unidad.nivelAgua > 50 ? 'text-green-400' :
                                unidad.nivelAgua > 20 ? 'text-amber-400' : 'text-red-400'
                              }`}>
                                {unidad.nivelAgua}%
                              </span>
                            </div>
                            <div className="flex-1 bg-neutral-950 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  unidad.nivelAgua > 50 ? 'bg-green-400' :
                                  unidad.nivelAgua > 20 ? 'bg-amber-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${unidad.nivelAgua}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información del Incidente */}
              {emergenciaActiva && (
                <div className="bg-red-950 border-2 border-red-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h4 className="text-white">Detalles del Incidente</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-red-300 text-xs">Tipo:</p>
                      <p className="text-white">{emergenciaActiva.tipo}</p>
                    </div>
                    <div>
                      <p className="text-red-300 text-xs">Dirección:</p>
                      <p className="text-white">{emergenciaActiva.direccion}</p>
                    </div>
                    {emergenciaActiva.nivel && (
                      <div>
                        <p className="text-red-300 text-xs">Nivel:</p>
                        <p className={`capitalize ${
                          emergenciaActiva.nivel === 'alto' ? 'text-red-400' :
                          emergenciaActiva.nivel === 'medio' ? 'text-amber-400' : 'text-green-400'
                        }`}>
                          {emergenciaActiva.nivel}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}