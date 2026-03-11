import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertTriangle, CheckCircle, Truck, ChevronDown, ChevronUp, X, Edit, FileText, ChevronRight } from 'lucide-react';
import { obtenerFechaSoloArgentina, formatearFechaArgentina, formatearHoraArgentina, esHoy, obtenerISO_Argentina } from '../../utils/fecha-argentina';

interface EmergenciasDelDiaProps {
  emergencias: any[];
  onCompletarInforme: (emergenciaId: string, informe: any) => void;
  onGuardarBorrador: (emergenciaId: string, borrador: any) => void;
}

export function EmergenciasDelDia({ emergencias, onCompletarInforme, onGuardarBorrador }: EmergenciasDelDiaProps) {
  const [emergenciaSeleccionada, setEmergenciaSeleccionada] = useState<any>(null);
  const [showFormularioInforme, setShowFormularioInforme] = useState(false);
  const [informe, setInforme] = useState({
    horaSalida: '',
    horaLlegada: '',
    horaRegreso: '',
    bomberosPresentes: [] as string[],
    unidadesUtilizadas: [] as string[],
    descripcionAcciones: '',
    resultados: '',
    observaciones: '',
    victimas: 'no',
    daniosMateriales: 'moderados'
  });

  const hoy = obtenerFechaSoloArgentina();
  // Mostrar emergencias del día actual O emergencias activas/en proceso sin importar la fecha
  const emergenciasHoy = emergencias.filter(e => {
    const esHoy = e.timestamp.startsWith(hoy);
    const estaActiva = !e.informe; // No tiene informe = está activa
    return esHoy || estaActiva;
  });

  const bomberosDemostracion = [
    'Juan Pérez (#101)',
    'María González (#102)',
    'Carlos Rodríguez (#103)',
    'Ana Martínez (#104)',
    'Luis Fernández (#105)',
    'Sofia López (#106)',
  ];

  const unidadesDisponibles = ['B-1', 'B-2', 'UTR-1', 'AE-1', 'CA-1'];

  // Función para obtener bomberos ocupados en otras emergencias activas
  const getBomberosOcupados = () => {
    const ocupados: { [key: string]: string } = {};
    
    emergencias
      .filter(e => !e.informe && e.id !== emergenciaSeleccionada?.id) // Emergencias activas excepto la actual
      .forEach(e => {
        if (e.informeBorrador?.bomberosPresentes) {
          e.informeBorrador.bomberosPresentes.forEach((bombero: string) => {
            ocupados[bombero] = e.tipo; // Guardamos en qué tipo de emergencia está
          });
        }
      });
    
    return ocupados;
  };

  // Función para obtener unidades ocupadas en otras emergencias activas
  const getUnidadesOcupadas = () => {
    const ocupadas: { [key: string]: string } = {};
    
    emergencias
      .filter(e => !e.informe && e.id !== emergenciaSeleccionada?.id)
      .forEach(e => {
        if (e.informeBorrador?.unidadesUtilizadas) {
          e.informeBorrador.unidadesUtilizadas.forEach((unidad: string) => {
            ocupadas[unidad] = e.tipo;
          });
        }
      });
    
    return ocupadas;
  };

  const handleToggleBombero = (bombero: string, estaOcupado: boolean) => {
    if (estaOcupado) return; // No permitir seleccionar bomberos ocupados
    
    if (informe.bomberosPresentes.includes(bombero)) {
      setInforme({
        ...informe,
        bomberosPresentes: informe.bomberosPresentes.filter(b => b !== bombero)
      });
    } else {
      setInforme({
        ...informe,
        bomberosPresentes: [...informe.bomberosPresentes, bombero]
      });
    }
  };

  const handleToggleUnidad = (unidad: string, estaOcupada: boolean) => {
    if (estaOcupada) return; // No permitir seleccionar unidades ocupadas
    
    if (informe.unidadesUtilizadas.includes(unidad)) {
      setInforme({
        ...informe,
        unidadesUtilizadas: informe.unidadesUtilizadas.filter(u => u !== unidad)
      });
    } else {
      setInforme({
        ...informe,
        unidadesUtilizadas: [...informe.unidadesUtilizadas, unidad]
      });
    }
  };

  // Guardar borrador automáticamente cuando cambian los datos
  useEffect(() => {
    if (emergenciaSeleccionada && showFormularioInforme) {
      onGuardarBorrador(emergenciaSeleccionada.id, informe);
    }
  }, [informe, emergenciaSeleccionada, showFormularioInforme]);

  // Cargar borrador al abrir el formulario
  const handleAbrirFormulario = (emergencia: any) => {
    setEmergenciaSeleccionada(emergencia);
    
    // Si existe un borrador, cargarlo
    if (emergencia.informeBorrador) {
      setInforme(emergencia.informeBorrador);
    } else {
      // Resetear a valores por defecto
      setInforme({
        horaLlegada: '',
        horaSalida: '',
        horaRegreso: '',
        bomberosPresentes: [],
        unidadesUtilizadas: [],
        descripcionAcciones: '',
        resultados: '',
        observaciones: '',
        victimas: 'no',
        daniosMateriales: 'moderados'
      });
    }
    
    setShowFormularioInforme(true);
  };

  const handleSubmitInforme = () => {
    if (!informe.horaLlegada || !informe.horaSalida || !informe.horaRegreso || informe.bomberosPresentes.length === 0) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    onCompletarInforme(emergenciaSeleccionada.id, informe);
    setShowFormularioInforme(false);
    setEmergenciaSeleccionada(null);
    
    // Reset form solo después de finalizar
    setInforme({
      horaLlegada: '',
      horaSalida: '',
      horaRegreso: '',
      bomberosPresentes: [],
      unidadesUtilizadas: [],
      descripcionAcciones: '',
      resultados: '',
      observaciones: '',
      victimas: 'no',
      daniosMateriales: 'moderados'
    });
  };

  const handleGuardarBorrador = () => {
    if (!informe.horaLlegada || !informe.horaSalida || informe.bomberosPresentes.length === 0) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    onGuardarBorrador(emergenciaSeleccionada.id, informe);
    setShowFormularioInforme(false);
    setEmergenciaSeleccionada(null);
    // Reset form
    setInforme({
      horaLlegada: '',
      horaSalida: '',
      horaRegreso: '',
      bomberosPresentes: [],
      unidadesUtilizadas: [],
      descripcionAcciones: '',
      resultados: '',
      observaciones: '',
      victimas: 'no',
      daniosMateriales: 'moderados'
    });
  };

  const handleCancelarFormulario = () => {
    // NO reseteamos el formulario, solo lo cerramos
    // El borrador ya está guardado
    setShowFormularioInforme(false);
    setEmergenciaSeleccionada(null);
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'alto': return 'bg-red-900 text-red-300 border-red-700';
      case 'medio': return 'bg-amber-900 text-amber-300 border-amber-700';
      case 'bajo': return 'bg-green-900 text-green-300 border-green-700';
      default: return 'bg-neutral-900 text-neutral-300 border-neutral-700';
    }
  };

  const getNivelEmoji = (nivel: string) => {
    switch (nivel) {
      case 'alto': return '🔴';
      case 'medio': return '🟡';
      case 'bajo': return '🟢';
      default: return '⚪';
    }
  };

  // Formulario de informe
  if (showFormularioInforme && emergenciaSeleccionada) {
    const bomberosOcupados = getBomberosOcupados();
    const unidadesOcupadas = getUnidadesOcupadas();
    
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-auto">
        <div className="min-h-screen p-4 pb-8">
          <button
            onClick={handleCancelarFormulario}
            className="text-neutral-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Volver
          </button>

          {/* Header */}
          <div className="bg-red-900 border-2 border-red-600 rounded-xl p-4 mb-4">
            <h2 className="text-white mb-2">Informe de Cierre</h2>
            <p className="text-red-200 text-sm">{emergenciaSeleccionada.tipo}</p>
            <p className="text-red-300 text-sm">{emergenciaSeleccionada.direccion}</p>
            
            {/* Indicador de guardado automático */}
            <div className="mt-2 flex items-center gap-2 text-green-400 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Guardado automático activado</span>
            </div>
          </div>

          {/* Formulario */}
          <div className="space-y-4">
            {/* Horarios */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Registro de Tiempos</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-neutral-300 text-sm mb-2">1. Hora de Salida del Cuartel *</label>
                  <input
                    type="time"
                    value={informe.horaSalida}
                    onChange={(e) => setInforme({ ...informe, horaSalida: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 text-sm mb-2">2. Hora de Arribo al Siniestro *</label>
                  <input
                    type="time"
                    value={informe.horaLlegada}
                    onChange={(e) => setInforme({ ...informe, horaLlegada: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 text-sm mb-2">3. Hora de Regreso al Cuartel *</label>
                  <input
                    type="time"
                    value={informe.horaRegreso}
                    onChange={(e) => setInforme({ ...informe, horaRegreso: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Bomberos Presentes */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Bomberos Presentes *</h3>
              <div className="space-y-2">
                {bomberosDemostracion.map((bombero) => {
                  const estaOcupado = bomberosOcupados[bombero];
                  const estaSeleccionado = informe.bomberosPresentes.includes(bombero);
                  
                  return (
                    <button
                      key={bombero}
                      onClick={() => handleToggleBombero(bombero, !!estaOcupado)}
                      disabled={!!estaOcupado}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        estaSeleccionado
                          ? 'bg-green-900 border-green-600 text-white'
                          : estaOcupado
                          ? 'bg-neutral-950 border-red-900 text-neutral-600 cursor-not-allowed opacity-60'
                          : 'bg-neutral-950 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className={estaOcupado ? 'line-through' : ''}>{bombero}</span>
                          {estaOcupado && (
                            <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                              En servicio: {estaOcupado}
                            </div>
                          )}
                        </div>
                        {estaSeleccionado && (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-neutral-500 text-xs mt-2">
                Seleccionados: {informe.bomberosPresentes.length}
              </p>
            </div>

            {/* Unidades Utilizadas */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Unidades Utilizadas</h3>
              <div className="flex flex-wrap gap-2">
                {unidadesDisponibles.map((unidad) => {
                  const estaOcupada = unidadesOcupadas[unidad];
                  const estaSeleccionada = informe.unidadesUtilizadas.includes(unidad);
                  
                  return (
                    <button
                      key={unidad}
                      onClick={() => handleToggleUnidad(unidad, !!estaOcupada)}
                      disabled={!!estaOcupada}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        estaSeleccionada
                          ? 'bg-blue-900 border-blue-600 text-white'
                          : estaOcupada
                          ? 'bg-neutral-950 border-red-900 text-neutral-600 cursor-not-allowed opacity-60 relative'
                          : 'bg-neutral-950 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                      }`}
                      title={estaOcupada ? `En servicio: ${estaOcupada}` : ''}
                    >
                      <div className="flex flex-col items-center">
                        <span className={estaOcupada ? 'line-through' : ''}>{unidad}</span>
                        {estaOcupada && (
                          <div className="text-xs text-red-400 mt-0.5 flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                            En uso
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Descripción de Acciones */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Descripción de Acciones Realizadas</h3>
              <textarea
                value={informe.descripcionAcciones}
                onChange={(e) => setInforme({ ...informe, descripcionAcciones: e.target.value })}
                placeholder="Describe las acciones tomadas durante la intervención..."
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600 min-h-[100px]"
              />
            </div>

            {/* Resultados */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Resultados</h3>
              <textarea
                value={informe.resultados}
                onChange={(e) => setInforme({ ...informe, resultados: e.target.value })}
                placeholder="Describe los resultados de la intervención..."
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600 min-h-[80px]"
              />
            </div>

            {/* Víctimas */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">¿Hubo víctimas?</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setInforme({ ...informe, victimas: 'no' })}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    informe.victimas === 'no'
                      ? 'bg-green-900 border-green-600 text-white'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-300'
                  }`}
                >
                  No
                </button>
                <button
                  onClick={() => setInforme({ ...informe, victimas: 'si' })}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    informe.victimas === 'si'
                      ? 'bg-red-900 border-red-600 text-white'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-300'
                  }`}
                >
                  Sí
                </button>
              </div>
            </div>

            {/* Daños Materiales */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Daños Materiales</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setInforme({ ...informe, daniosMateriales: 'leves' })}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    informe.daniosMateriales === 'leves'
                      ? 'bg-green-900 border-green-600 text-white'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-300'
                  }`}
                >
                  Leves
                </button>
                <button
                  onClick={() => setInforme({ ...informe, daniosMateriales: 'moderados' })}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    informe.daniosMateriales === 'moderados'
                      ? 'bg-amber-900 border-amber-600 text-white'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-300'
                  }`}
                >
                  Moderados
                </button>
                <button
                  onClick={() => setInforme({ ...informe, daniosMateriales: 'graves' })}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    informe.daniosMateriales === 'graves'
                      ? 'bg-red-900 border-red-600 text-white'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-300'
                  }`}
                >
                  Graves
                </button>
              </div>
            </div>

            {/* Observaciones */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Observaciones Adicionales</h3>
              <textarea
                value={informe.observaciones}
                onChange={(e) => setInforme({ ...informe, observaciones: e.target.value })}
                placeholder="Cualquier observación adicional relevante..."
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600 min-h-[80px]"
              />
            </div>

            {/* Botones */}
            <div className="space-y-2">
              <button
                onClick={handleSubmitInforme}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 transition-all"
              >
                Completar Informe y Cerrar Emergencia
              </button>
              <button
                onClick={handleCancelarFormulario}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl py-3 transition-all border border-neutral-700"
              >
                Guardar y Continuar Después
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal - Lista de emergencias del día
  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-5 h-5 text-red-500" />
          <h2 className="text-white">Emergencias del Día</h2>
        </div>
        <p className="text-neutral-400 text-sm">
          {formatearFechaArgentina(obtenerISO_Argentina(), { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <p className="text-neutral-400 text-xs">Total</p>
          <div className="text-white text-2xl mt-1">{emergenciasHoy.length}</div>
        </div>
        <div className="bg-green-900 border border-green-700 rounded-lg p-3">
          <p className="text-green-300 text-xs">Finalizadas</p>
          <div className="text-white text-2xl mt-1">
            {emergenciasHoy.filter(e => e.informe).length}
          </div>
        </div>
        <div className="bg-amber-900 border border-amber-700 rounded-lg p-3">
          <p className="text-amber-300 text-xs">Pendientes</p>
          <div className="text-white text-2xl mt-1">
            {emergenciasHoy.filter(e => !e.informe).length}
          </div>
        </div>
      </div>

      {/* Lista de emergencias */}
      {emergenciasHoy.length > 0 ? (
        <div className="space-y-3">
          {emergenciasHoy.map((emergencia) => (
            <div
              key={emergencia.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className={`px-4 py-3 border-b border-neutral-800 ${
                emergencia.informe ? 'bg-green-950' : 'bg-neutral-950'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white">{emergencia.tipo}</h3>
                    <div className={`px-2 py-0.5 rounded text-xs border ${getNivelColor(emergencia.nivel)}`}>
                      {getNivelEmoji(emergencia.nivel)}
                    </div>
                  </div>
                  {emergencia.informe ? (
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Finalizada</span>
                    </div>
                  ) : emergencia.informeBorrador?.unidadesUtilizadas?.length > 0 ? (
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                      <Truck className="w-4 h-4" />
                      <span className="text-xs">Unidad en Viaje</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      </div>
                      <span className="text-xs font-semibold">En curso</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(emergencia.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-300 text-sm">{emergencia.direccion}</p>
                </div>

                {emergencia.referencias && (
                  <p className="text-neutral-400 text-sm mb-3">{emergencia.referencias}</p>
                )}

                {/* Información de Recursos (solo en emergencias activas) */}
                {!emergencia.informe && emergencia.informeBorrador && (
                  <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-3 mb-3 space-y-2">
                    {emergencia.informeBorrador.unidadesUtilizadas?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-blue-400" />
                        <span className="text-neutral-400">Unidades despachadas:</span>
                        <span className="text-blue-400 font-semibold">
                          {emergencia.informeBorrador.unidadesUtilizadas.join(', ')}
                        </span>
                      </div>
                    )}
                    {emergencia.informeBorrador.bomberosPresentes?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-neutral-400">Personal en respuesta:</span>
                        <span className="text-green-400 font-semibold">
                          {emergencia.informeBorrador.bomberosPresentes.length} bombero{emergencia.informeBorrador.bomberosPresentes.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Indicador de borrador guardado */}
                {!emergencia.informe && emergencia.informeBorrador && (
                  <div className="bg-amber-950 border border-amber-700 rounded-lg px-3 py-2 mb-3">
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <span>Informe en progreso - Datos guardados</span>
                    </div>
                  </div>
                )}

                {/* Botón de acción */}
                {!emergencia.informe ? (
                  <button
                    onClick={() => handleAbrirFormulario(emergencia)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    <span>
                      {emergencia.informeBorrador ? 'Continuar Informe de Cierre' : 'Completar Informe de Cierre'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEmergenciaSeleccionada(emergencia)}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all border border-neutral-700"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Ver Informe Completo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">No hay emergencias registradas hoy</p>
          <p className="text-neutral-600 text-sm mt-1">
            Presiona el botón flotante "NUEVA EMERGENCIA" para reportar un incidente
          </p>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-950 border border-blue-800 rounded-xl p-4">
        <p className="text-blue-300 text-sm">
          💡 Las emergencias permanecen en esta sección hasta completar el informe de cierre. 
          Luego pasan automáticamente al historial general.
        </p>
      </div>
    </div>
  );
}