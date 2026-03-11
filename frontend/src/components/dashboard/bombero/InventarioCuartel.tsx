import React, { useState } from 'react';
import { ClipboardCheck, Camera, CheckCircle, AlertCircle, XCircle, Upload, Save, Truck, Droplet, Gauge, Radio, Flashlight, User, Wind } from 'lucide-react';
import { obtenerFechaSoloArgentina } from '../../../utils/fecha-argentina';

interface InventarioCuartelProps {
  user: any;
  onNavigateToInicio?: () => void;
}

type EstadoCuartel = 'optimo' | 'falla_leve' | 'fuera_servicio' | null;
type EstadoLimpieza = 'verde' | 'amarillo' | 'rojo';
type EstadoOperativo = 'apresto' | 'fs';

interface ItemCuartel {
  id: string;
  nombre: string;
  estado: EstadoCuartel;
  comentarios?: string;
  foto?: string;
}

interface Unidad {
  id: string;
  codigo: string;
  nombre: string;
  combustible: number;
  agua: number;
  limpieza: EstadoLimpieza;
  estadoOperativo: EstadoOperativo;
  kilometros?: number;
}

export function InventarioCuartel({ user, onNavigateToInicio }: InventarioCuartelProps) {
  const fechaHoy = obtenerFechaSoloArgentina(); // YYYY-MM-DD en zona horaria Argentina
  const horaActual = new Date().toLocaleTimeString('es-AR', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
    hour12: false
  });

  // Estado del encabezado
  const [numeroGuardia, setNumeroGuardia] = useState('');
  const [fecha, setFecha] = useState(fechaHoy);
  const [hora, setHora] = useState(horaActual);
  const [quienEntrega, setQuienEntrega] = useState('');
  const [quienRecibe, setQuienRecibe] = useState(user?.nombre || '');

  // Estado del cuartel
  const [itemsCuartel, setItemsCuartel] = useState<ItemCuartel[]>([
    { id: 'guardia', nombre: 'Guardia', estado: null },
    { id: 'casino', nombre: 'Casino', estado: null },
    { id: 'cocina', nombre: 'Cocina', estado: null },
    { id: 'playon', nombre: 'Playón', estado: null },
    { id: 'recepcion', nombre: 'Recepción', estado: null },
    { id: 'aula', nombre: 'Aula', estado: null },
    { id: 'sala_hcd', nombre: 'Sala HCD', estado: null },
    { id: 'jefatura', nombre: 'Jefatura', estado: null },
    { id: 'dormitorios', nombre: 'Dormitorios', estado: null },
    { id: 'vestuarios', nombre: 'Vestuarios', estado: null },
    { id: 'panol', nombre: 'Pañol', estado: null },
  ]);

  // Estado del equipamiento
  const [handys, setHandys] = useState(19);
  const [linternas, setLinternas] = useState(10);
  const [hombreMuerto, setHombreMuerto] = useState(2);
  const [garrafasLlenas, setGarrafasLlenas] = useState(3);
  const [garrafasVacias, setGarrafasVacias] = useState(0);

  // Estado de las unidades
  const [unidades, setUnidades] = useState<Unidad[]>([
    { id: '12', codigo: 'B-12', nombre: 'Autobomba 12', combustible: 50, agua: 100, limpieza: 'verde', estadoOperativo: 'apresto', kilometros: 12450 },
    { id: '19', codigo: 'B-19', nombre: 'Autobomba 19', combustible: 100, agua: 100, limpieza: 'verde', estadoOperativo: 'apresto', kilometros: 8320 },
    { id: '20', codigo: 'B-20', nombre: 'Autobomba 20', combustible: 100, agua: 100, limpieza: 'verde', estadoOperativo: 'apresto', kilometros: 15780 },
    { id: '22', codigo: 'B-22', nombre: 'Autobomba 22', combustible: 75, agua: 100, limpieza: 'verde', estadoOperativo: 'apresto', kilometros: 9640 },
    { id: '23', codigo: 'UTR-23', nombre: 'Unidad de Rescate', combustible: 0, agua: 0, limpieza: 'rojo', estadoOperativo: 'fs', kilometros: 0 },
    { id: '24', codigo: 'UTR-24', nombre: 'Unidad de Rescate', combustible: 0, agua: 0, limpieza: 'rojo', estadoOperativo: 'fs', kilometros: 0 },
    { id: '25', codigo: 'AE-25', nombre: 'Autoescala', combustible: 0, agua: 0, limpieza: 'rojo', estadoOperativo: 'fs', kilometros: 0 },
    { id: '26', codigo: 'B-26', nombre: 'Autobomba 26', combustible: 75, agua: 100, limpieza: 'verde', estadoOperativo: 'apresto', kilometros: 11230 },
    { id: '27', codigo: 'B-27', nombre: 'Autobomba 27', combustible: 100, agua: 100, limpieza: 'verde', estadoOperativo: 'apresto', kilometros: 7890 },
    { id: '2302', codigo: 'CA-2302', nombre: 'Camión Cisterna', combustible: 100, agua: 100, limpieza: 'verde', estadoOperativo: 'apresto', kilometros: 5420 },
  ]);

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleEstadoCuartel = (itemId: string, estado: EstadoCuartel) => {
    setItemsCuartel(itemsCuartel.map(item => 
      item.id === itemId ? { ...item, estado } : item
    ));
  };

  const handleComentarios = (itemId: string, comentarios: string) => {
    setItemsCuartel(itemsCuartel.map(item => 
      item.id === itemId ? { ...item, comentarios } : item
    ));
  };

  const handleCombustible = (unidadId: string, valor: number) => {
    setUnidades(unidades.map(u => 
      u.id === unidadId ? { ...u, combustible: valor } : u
    ));
  };

  const handleAgua = (unidadId: string, valor: number) => {
    setUnidades(unidades.map(u => 
      u.id === unidadId ? { ...u, agua: valor } : u
    ));
  };

  const handleLimpieza = (unidadId: string, estado: EstadoLimpieza) => {
    setUnidades(unidades.map(u => 
      u.id === unidadId ? { ...u, limpieza: estado } : u
    ));
  };

  const handleEstadoOperativo = (unidadId: string, estado: EstadoOperativo) => {
    setUnidades(unidades.map(u => 
      u.id === unidadId ? { ...u, estadoOperativo: estado } : u
    ));
  };

  // Validaciones para habilitar el botón de finalizar
  const camposObligatoriosCompletos = 
    numeroGuardia.trim() !== '' &&
    quienEntrega.trim() !== '' &&
    quienRecibe.trim() !== '' &&
    itemsCuartel.every(item => item.estado !== null) &&
    unidades.every(u => u.estadoOperativo !== null);

  const handleFinalizar = () => {
    if (!camposObligatoriosCompletos) return;
    
    setEnviando(true);
    
    // Simular envío de datos
    setTimeout(() => {
      // Capturar dinámicamente el usuario activo desde localStorage
      const currentUserId = localStorage.getItem('bomberos_current_user_id') || user?.id || 'unknown';
      const currentUserRol = localStorage.getItem('bomberos_current_user_rol') || user?.rol || 'unknown';
      
      const datosInventario = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        registradoPor: {
          userId: currentUserId,
          userRol: currentUserRol,
          nombre: quienRecibe
        },
        encabezado: {
          numeroGuardia,
          fecha,
          hora,
          quienEntrega,
          quienRecibe
        },
        estadoCuartel: itemsCuartel,
        equipamiento: {
          handys,
          linternas,
          hombreMuerto,
          garrafasLlenas,
          garrafasVacias
        },
        unidades: unidades.map(u => ({
          codigo: u.codigo,
          combustible: u.combustible,
          agua: u.agua,
          limpieza: u.limpieza,
          estadoOperativo: u.estadoOperativo,
          kilometros: u.kilometros
        }))
      };

      console.log('📦 Datos de Inventario Guardados:', datosInventario);
      
      // Guardar como último inventario
      localStorage.setItem('ultimo_inventario', JSON.stringify(datosInventario));
      
      // Agregar al historial
      const historialActual = localStorage.getItem('historial_inventarios');
      const historial = historialActual ? JSON.parse(historialActual) : [];
      historial.unshift(datosInventario); // Agregar al principio
      localStorage.setItem('historial_inventarios', JSON.stringify(historial));
      
      setEnviando(false);
      setEnviado(true);

      // Resetear mensaje de éxito y navegar después de 1.5 segundos
      setTimeout(() => {
        setEnviado(false);
        // Navegar a la página de inicio
        if (onNavigateToInicio) {
          onNavigateToInicio();
        }
      }, 1500);
    }, 1500);
  };

  const getColorCombustible = (nivel: number) => {
    if (nivel > 50) return 'bg-green-500';
    if (nivel > 20) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getColorAgua = (nivel: number) => {
    if (nivel > 50) return 'bg-blue-500';
    if (nivel > 20) return 'bg-cyan-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 space-y-4 pb-[140px]">
      {/* Header */}
      <div>
        <h2 className="text-white mb-1">Inventario de Guardia</h2>
        <p className="text-neutral-400 text-sm">Estado en el que se toma la guardia</p>
      </div>

      {/* Notificación de éxito */}
      {enviado && (
        <div className="bg-green-900 border-2 border-green-600 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <div>
            <p className="text-green-400 font-semibold">✓ Inventario enviado con éxito</p>
            <p className="text-green-300 text-sm">Los datos han sido guardados y actualizados en el sistema</p>
          </div>
        </div>
      )}

      {/* 1. ENCABEZADO DE IDENTIFICACIÓN */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <h3 className="text-white flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-red-500" />
          Identificación de Guardia
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-neutral-400 text-sm mb-1">
              N° de Guardia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={numeroGuardia}
              onChange={(e) => setNumeroGuardia(e.target.value)}
              placeholder="Ej: 5"
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
            />
          </div>
          
          <div>
            <label className="block text-neutral-400 text-sm mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-sm mb-1">Hora de Entrega</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-sm mb-1">
              Quien Entrega <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={quienEntrega}
              onChange={(e) => setQuienEntrega(e.target.value)}
              placeholder="Nombre completo"
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-neutral-400 text-sm mb-1">
              Quien Recibe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={quienRecibe}
              onChange={(e) => setQuienRecibe(e.target.value)}
              placeholder="Nombre completo"
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>
      </div>

      {/* 2. ESTADO DEL CUARTEL */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <h3 className="text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Estado del Cuartel
        </h3>

        <div className="space-y-2">
          {itemsCuartel.map((item) => (
            <div
              key={item.id}
              className={`bg-neutral-950 border rounded-lg p-3 transition-all ${
                item.estado ? 'border-neutral-700' : 'border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">{item.nombre}</h4>
                {item.estado === 'optimo' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {item.estado === 'falla_leve' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                {item.estado === 'fuera_servicio' && <XCircle className="w-4 h-4 text-red-500" />}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleEstadoCuartel(item.id, 'optimo')}
                  className={`py-2 rounded-lg text-sm transition-all ${
                    item.estado === 'optimo'
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  Óptimo
                </button>
                <button
                  onClick={() => handleEstadoCuartel(item.id, 'falla_leve')}
                  className={`py-2 rounded-lg text-sm transition-all ${
                    item.estado === 'falla_leve'
                      ? 'bg-amber-600 text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  Falla Leve
                </button>
                <button
                  onClick={() => handleEstadoCuartel(item.id, 'fuera_servicio')}
                  className={`py-2 rounded-lg text-sm transition-all ${
                    item.estado === 'fuera_servicio'
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  F/S
                </button>
              </div>

              {/* Mostrar campo de comentarios y botón de foto si hay falla */}
              {item.estado && item.estado !== 'optimo' && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={item.comentarios || ''}
                    onChange={(e) => handleComentarios(item.id, e.target.value)}
                    placeholder="Describe el problema o falla detectada..."
                    className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-amber-600 text-sm min-h-[60px]"
                  />
                  <button className="w-full bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 rounded-lg py-2 flex items-center justify-center gap-2 text-sm">
                    <Camera className="w-4 h-4" />
                    <span>Adjuntar Foto</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. EQUIPAMIENTO */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <h3 className="text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-purple-500" />
          Inventario de Equipamiento
        </h3>

        <div className="space-y-3">
          {/* Handys */}
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400" />
                <span className="text-neutral-300 text-sm">Cantidad de Handys</span>
              </div>
              <input
                type="number"
                value={handys}
                onChange={(e) => setHandys(Number(e.target.value))}
                className="w-20 bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-1 text-center focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          {/* Linternas */}
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flashlight className="w-4 h-4 text-yellow-400" />
                <span className="text-neutral-300 text-sm">Cantidad de Linternas</span>
              </div>
              <input
                type="number"
                value={linternas}
                onChange={(e) => setLinternas(Number(e.target.value))}
                className="w-20 bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-1 text-center focus:outline-none focus:border-yellow-600"
              />
            </div>
          </div>

          {/* Hombre Muerto */}
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-orange-400" />
                <span className="text-neutral-300 text-sm">Hombre Muerto</span>
              </div>
              <input
                type="number"
                value={hombreMuerto}
                onChange={(e) => setHombreMuerto(Number(e.target.value))}
                className="w-20 bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-1 text-center focus:outline-none focus:border-orange-600"
              />
            </div>
          </div>

          {/* Garrafas de Gas */}
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-neutral-300 text-sm">Garrafas de Gas</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-400 text-xs mb-1">Llenas</label>
                <input
                  type="number"
                  value={garrafasLlenas}
                  onChange={(e) => setGarrafasLlenas(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-1 text-center focus:outline-none focus:border-cyan-600"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1">Vacías</label>
                <input
                  type="number"
                  value={garrafasVacias}
                  onChange={(e) => setGarrafasVacias(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-1 text-center focus:outline-none focus:border-neutral-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. UNIDADES */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <h3 className="text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-green-500" />
          Estado de Unidades
        </h3>

        <div className="space-y-3">
          {unidades.map((unidad) => (
            <div
              key={unidad.id}
              className="bg-neutral-950 border border-neutral-700 rounded-lg p-4 space-y-3"
            >
              {/* Header de la unidad */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white">{unidad.codigo}</h4>
                  <p className="text-neutral-400 text-xs">{unidad.nombre}</p>
                </div>
                {unidad.kilometros !== undefined && unidad.kilometros > 0 && (
                  <span className="text-neutral-500 text-xs">{unidad.kilometros.toLocaleString()} km</span>
                )}
              </div>

              {/* Combustible */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-amber-400" />
                    <span className="text-neutral-300 text-sm">Combustible</span>
                  </div>
                  <span className="text-white text-sm">{unidad.combustible}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={unidad.combustible}
                  onChange={(e) => handleCombustible(unidad.id, Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${
                      unidad.combustible > 50 ? '#22c55e' : unidad.combustible > 20 ? '#f59e0b' : '#ef4444'
                    } 0%, ${
                      unidad.combustible > 50 ? '#22c55e' : unidad.combustible > 20 ? '#f59e0b' : '#ef4444'
                    } ${unidad.combustible}%, #262626 ${unidad.combustible}%, #262626 100%)`
                  }}
                />
              </div>

              {/* Agua (solo para autobombas y cisternas) */}
              {(unidad.codigo.startsWith('B-') || unidad.codigo.startsWith('CA-')) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-400" />
                      <span className="text-neutral-300 text-sm">Agua</span>
                    </div>
                    <span className="text-white text-sm">{unidad.agua}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={unidad.agua}
                    onChange={(e) => handleAgua(unidad.id, Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${
                        unidad.agua > 50 ? '#3b82f6' : unidad.agua > 20 ? '#06b6d4' : '#ef4444'
                      } 0%, ${
                        unidad.agua > 50 ? '#3b82f6' : unidad.agua > 20 ? '#06b6d4' : '#ef4444'
                      } ${unidad.agua}%, #262626 ${unidad.agua}%, #262626 100%)`
                    }}
                  />
                </div>
              )}

              {/* Limpieza */}
              <div>
                <span className="text-neutral-300 text-sm block mb-2">Limpieza</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleLimpieza(unidad.id, 'verde')}
                    className={`py-2 rounded-lg text-sm transition-all ${
                      unidad.limpieza === 'verde'
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    Verde
                  </button>
                  <button
                    onClick={() => handleLimpieza(unidad.id, 'amarillo')}
                    className={`py-2 rounded-lg text-sm transition-all ${
                      unidad.limpieza === 'amarillo'
                        ? 'bg-amber-600 text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    Amarillo
                  </button>
                  <button
                    onClick={() => handleLimpieza(unidad.id, 'rojo')}
                    className={`py-2 rounded-lg text-sm transition-all ${
                      unidad.limpieza === 'rojo'
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    Rojo
                  </button>
                </div>
              </div>

              {/* Estado Operativo */}
              <div>
                <span className="text-neutral-300 text-sm block mb-2">Estado Operativo</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleEstadoOperativo(unidad.id, 'apresto')}
                    className={`py-2 rounded-lg text-sm transition-all ${
                      unidad.estadoOperativo === 'apresto'
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    APRESTO
                  </button>
                  <button
                    onClick={() => handleEstadoOperativo(unidad.id, 'fs')}
                    className={`py-2 rounded-lg text-sm transition-all ${
                      unidad.estadoOperativo === 'fs'
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    F/S
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de Finalizar */}
      <button
        onClick={handleFinalizar}
        disabled={!camposObligatoriosCompletos || enviando}
        className={`w-full rounded-xl py-4 flex items-center justify-center gap-2 transition-all ${
          camposObligatoriosCompletos && !enviando
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
        }`}
      >
        {enviando ? (
          <>
            <div className="w-5 h-5 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin"></div>
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>Finalizar Inventario</span>
          </>
        )}
      </button>

      {!camposObligatoriosCompletos && (
        <div className="bg-amber-950 border border-amber-800 rounded-xl p-3">
          <p className="text-amber-300 text-sm">
            ⚠️ Completa todos los campos obligatorios y verifica el estado de todas las áreas y unidades
          </p>
        </div>
      )}
    </div>
  );
}