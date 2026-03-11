import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, CheckCircle, Edit2, X } from 'lucide-react';

/**
 * Formatea una fecha en formato YYYY-MM-DD a texto legible sin conversión UTC
 * Evita el problema de "off-by-one" al no usar new Date()
 */
function formatearFechaSinUTC(fechaString: string, options: { weekday?: 'long' | 'short', day?: 'numeric', month?: 'short' | 'long' }): string {
  // Extraer año, mes, día directamente del string YYYY-MM-DD
  const [year, month, day] = fechaString.split('-').map(Number);
  
  // Crear fecha en zona horaria local (sin conversión UTC)
  const fecha = new Date(year, month - 1, day);
  
  return fecha.toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    ...options
  });
}

interface CalendarioGuardiasProps {
  user: any;
  guardias: any[];
  onAgregarGuardia: (guardia: any) => void;
  onEditarGuardia: (guardiaId: number, guardia: any) => void;
  onNavigateToHistorial: () => void;
}

export function CalendarioGuardias({ user, guardias, onAgregarGuardia, onEditarGuardia, onNavigateToHistorial }: CalendarioGuardiasProps) {
  const [showNuevaGuardia, setShowNuevaGuardia] = useState(false);
  const [guardiaEnEdicion, setGuardiaEnEdicion] = useState<number | null>(null);
  const [showNotificacion, setShowNotificacion] = useState(false);
  const [mensajeNotificacion, setMensajeNotificacion] = useState('');
  
  const [nuevaGuardia, setNuevaGuardia] = useState({
    tipo: 'cuartel',
    fecha: '',
    inicio: '',
    fin: ''
  });

  const tiposGuardia = [
    { id: 'cuartel', nombre: 'Cuartel', descripcion: 'Presencia física en el cuartel', color: 'red' },
    { id: 'disponibilidad', nombre: 'Disponibilidad', descripcion: 'Disponible para salidas', color: 'blue' },
    { id: 'zona', nombre: 'Zona', descripcion: 'Guardia desde ubicación específica', color: 'green' },
  ];

  const calcularHoras = (inicio: string, fin: string): number => {
    if (!inicio || !fin) return 0;
    
    const [horaInicio, minInicio] = inicio.split(':').map(Number);
    const [horaFin, minFin] = fin.split(':').map(Number);
    
    let totalMinutos = (horaFin * 60 + minFin) - (horaInicio * 60 + minInicio);
    
    // Si el fin es menor que el inicio, la guardia cruza medianoche
    if (totalMinutos < 0) {
      totalMinutos += 24 * 60;
    }
    
    return totalMinutos / 60;
  };

  const mostrarNotificacion = (mensaje: string) => {
    setMensajeNotificacion(mensaje);
    setShowNotificacion(true);
    setTimeout(() => {
      setShowNotificacion(false);
    }, 3000);
  };

  const handleGuardar = () => {
    if (!nuevaGuardia.fecha || !nuevaGuardia.inicio || !nuevaGuardia.fin) {
      alert('Por favor completa todos los campos');
      return;
    }

    const horas = calcularHoras(nuevaGuardia.inicio, nuevaGuardia.fin);

    if (guardiaEnEdicion !== null) {
      // Modo edición
      onEditarGuardia(guardiaEnEdicion, nuevaGuardia);
      mostrarNotificacion(`Guardia editada correctamente. ${horas.toFixed(1)} horas actualizadas.`);
      setGuardiaEnEdicion(null);
    } else {
      // Modo agregar
      onAgregarGuardia(nuevaGuardia);
      mostrarNotificacion(`Guardia guardada con éxito. ${horas.toFixed(1)} horas agregadas.`);
    }

    // Resetear formulario pero NO cerrar
    setNuevaGuardia({
      tipo: 'cuartel',
      fecha: '',
      inicio: '',
      fin: ''
    });
  };

  const handleEditar = (guardia: any) => {
    setGuardiaEnEdicion(guardia.id);
    setNuevaGuardia({
      tipo: guardia.tipo.toLowerCase(),
      fecha: guardia.fecha,
      inicio: guardia.inicio,
      fin: guardia.fin
    });
    setShowNuevaGuardia(true);
    
    // Scroll hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelar = () => {
    setShowNuevaGuardia(false);
    setGuardiaEnEdicion(null);
    setNuevaGuardia({
      tipo: 'cuartel',
      fecha: '',
      inicio: '',
      fin: ''
    });
  };

  const getTipoNombre = (tipo: string): string => {
    const tipoObj = tiposGuardia.find(t => t.id === tipo.toLowerCase());
    return tipoObj ? tipoObj.nombre : tipo;
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Notificación de éxito */}
      {showNotificacion && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in">
          <CheckCircle className="w-5 h-5" />
          <span>{mensajeNotificacion}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white mb-1">Mis Guardias</h2>
          <p className="text-neutral-400 text-sm">Calendario de turnos</p>
        </div>
        <button
          onClick={() => setShowNuevaGuardia(!showNuevaGuardia)}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Formulario de nueva guardia */}
      {showNuevaGuardia && (
        <div className="bg-neutral-900 border-2 border-red-600 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white">
              {guardiaEnEdicion !== null ? 'Editar Guardia' : 'Nueva Guardia'}
            </h3>
            {guardiaEnEdicion !== null && (
              <span className="text-amber-400 text-sm flex items-center gap-1">
                <Edit2 className="w-4 h-4" />
                Editando
              </span>
            )}
          </div>
          
          <div>
            <label className="block text-neutral-300 text-sm mb-2">Tipo de Guardia</label>
            <div className="space-y-2">
              {tiposGuardia.map((tipo) => (
                <button
                  key={tipo.id}
                  onClick={() => setNuevaGuardia({ ...nuevaGuardia, tipo: tipo.id })}
                  className={`w-full border-2 rounded-lg p-3 text-left transition-all ${
                    nuevaGuardia.tipo === tipo.id
                      ? 'bg-red-900 border-red-600'
                      : 'bg-neutral-950 border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      tipo.id === 'cuartel' ? 'bg-red-500' :
                      tipo.id === 'disponibilidad' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="text-white">{tipo.nombre}</p>
                      <p className="text-neutral-400 text-xs">{tipo.descripcion}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-neutral-300 text-sm mb-2">Fecha</label>
              <input
                type="date"
                value={nuevaGuardia.fecha}
                onChange={(e) => setNuevaGuardia({ ...nuevaGuardia, fecha: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 text-sm mb-2">Hora Inicio</label>
                <input
                  type="time"
                  value={nuevaGuardia.inicio}
                  onChange={(e) => setNuevaGuardia({ ...nuevaGuardia, inicio: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-neutral-300 text-sm mb-2">Hora Fin</label>
                <input
                  type="time"
                  value={nuevaGuardia.fin}
                  onChange={(e) => setNuevaGuardia({ ...nuevaGuardia, fin: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          </div>

          {/* Mostrar horas calculadas */}
          {nuevaGuardia.inicio && nuevaGuardia.fin && (
            <div className="bg-blue-950 border border-blue-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm">
                  Duración: {calcularHoras(nuevaGuardia.inicio, nuevaGuardia.fin).toFixed(1)} horas
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button 
              onClick={handleGuardar}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {guardiaEnEdicion !== null ? 'Guardar Cambios' : 'Guardar'}
            </button>
            <button
              onClick={handleCancelar}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de guardias */}
      <div className="space-y-3">
        <h3 className="text-white">Guardias Programadas</h3>
        {guardias.filter(g => g.estado === 'programada').length > 0 ? (
          guardias.filter(g => g.estado === 'programada').map((guardia) => (
            <div key={guardia.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-neutral-950 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-white">
                      {formatearFechaSinUTC(guardia.fecha, { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                    <p className="text-neutral-400 text-sm">
                      {guardia.inicio} - {guardia.fin}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    getTipoNombre(guardia.tipo) === 'Cuartel' ? 'bg-red-900 text-red-300' :
                    getTipoNombre(guardia.tipo) === 'Disponibilidad' ? 'bg-blue-900 text-blue-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {getTipoNombre(guardia.tipo)}
                  </div>
                  <button
                    onClick={() => handleEditar(guardia)}
                    className="bg-amber-900 hover:bg-amber-800 text-amber-300 p-2 rounded-lg transition-all"
                    title="Editar guardia"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-neutral-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{calcularHoras(guardia.inicio, guardia.fin).toFixed(1)} horas</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-neutral-900 border border-neutral-800 rounded-xl">
            <p className="text-neutral-500">No hay guardias programadas</p>
            <p className="text-neutral-600 text-sm mt-1">Presiona el botón + para agregar una</p>
          </div>
        )}
      </div>

      {/* Guardias completadas */}
      <div className="space-y-3">
        <h3 className="text-white">Historial</h3>
        {guardias.filter(g => g.estado === 'completada').length > 0 ? (
          guardias.filter(g => g.estado === 'completada').map((guardia) => (
            <div key={guardia.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 opacity-60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">
                    {formatearFechaSinUTC(guardia.fecha, { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </p>
                  <p className="text-neutral-400 text-sm">{getTipoNombre(guardia.tipo)}</p>
                </div>
                <div className="text-green-400 text-sm">✓ Completada</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-neutral-900 border border-neutral-800 rounded-xl opacity-60">
            <p className="text-neutral-500 text-sm">Sin historial</p>
          </div>
        )}
      </div>
    </div>
  );
}