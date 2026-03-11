import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Award, CheckCircle, Calendar } from 'lucide-react';
import { obtenerFechaSoloArgentina } from '../../../utils/fecha-argentina';

interface InicioGuardiaProps {
  user: any;
  horasSemanales: number;
  guardias: any[];
  onNavigateToChecklist?: () => void;
  onNavigateToGuardias?: () => void;
}

export function InicioGuardia({ user, horasSemanales, guardias, onNavigateToChecklist, onNavigateToGuardias }: InicioGuardiaProps) {
  const horasRequeridas = 6;
  const progreso = (horasSemanales / horasRequeridas) * 100;
  const [inventarioCompletadoHoy, setInventarioCompletadoHoy] = useState(false);

  useEffect(() => {
    // Verificar si existe inventario de hoy usando fecha de Argentina
    const historialInventarios = localStorage.getItem('historial_inventarios');
    if (historialInventarios) {
      const historial = JSON.parse(historialInventarios);
      const fechaHoy = obtenerFechaSoloArgentina(); // YYYY-MM-DD en zona horaria Argentina
      
      // Verificar si existe algún inventario de hoy
      const inventarioDeHoy = historial.find((inv: any) => {
        const fechaInventario = inv.encabezado?.fecha || '';
        return fechaInventario === fechaHoy;
      });
      
      if (inventarioDeHoy) {
        setInventarioCompletadoHoy(true);
      }
    }
  }, []);

  // Calcular próxima guardia: filtrar >= hoy, ordenar ascendente, tomar primera
  const fechaHoy = obtenerFechaSoloArgentina();
  const guardiasProximas = guardias
    .filter(g => g.estado === 'programada' && g.fecha >= fechaHoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  
  const proximaGuardia = guardiasProximas[0] || null;

  const estadisticas = {
    serviciosRealizados: 12,
    horasTotales: 156,
    certificaciones: 3
  };

  const formatearFechaSinUTC = (fechaString: string): string => {
    // Extraer año, mes, día directamente del string YYYY-MM-DD
    const [year, month, day] = fechaString.split('-').map(Number);
    
    // Crear fecha en zona horaria local (sin conversión UTC)
    const fecha = new Date(year, month - 1, day);
    
    return fecha.toLocaleDateString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Bienvenida */}
      <div className="bg-gradient-to-br from-red-900 to-red-950 border border-red-800 rounded-xl p-6">
        <h2 className="text-white mb-2">¡Bienvenido, {user.nombre.split(' ')[0]}!</h2>
        <p className="text-red-200">Estado: Listo para servicio</p>
      </div>

      {/* Widget de progreso de horas */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-white">Horas Semanales</h3>
          </div>
          <span className="text-white text-xl">{horasSemanales}/{horasRequeridas}h</span>
        </div>
        
        <div className="h-3 bg-neutral-950 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all ${
              progreso >= 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progreso, 100)}%` }}
          />
        </div>
        
        {progreso >= 100 ? (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>¡Cumpliste el mínimo semanal!</span>
          </div>
        ) : (
          <p className="text-neutral-400 text-sm">
            Faltan {horasRequeridas - horasSemanales} horas para completar el mínimo
          </p>
        )}
      </div>

      {/* Próxima guardia */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-neutral-400" />
          <h3 className="text-white">Próxima Guardia</h3>
        </div>
        {proximaGuardia ? (
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4">
            <p className="text-white mb-1">{formatearFechaSinUTC(proximaGuardia.fecha)}</p>
            <p className="text-neutral-400 text-sm">{proximaGuardia.inicio} - {proximaGuardia.fin}</p>
            <div className="mt-2 inline-block bg-blue-900 px-3 py-1 rounded-full">
              <span className="text-blue-300 text-sm">{proximaGuardia.tipo}</span>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4">
            <p className="text-neutral-400 text-sm">No hay guardias programadas</p>
            <p className="text-neutral-500 text-xs mt-1">Presiona \"Cargar Nueva Guardia\" para agregar una</p>
          </div>
        )}
      </div>

      {/* Métricas de mérito */}
      <div>
        <h3 className="text-white mb-3">Tus Estadísticas</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-green-900 to-green-950 border border-green-700 rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-white text-2xl mb-1">{estadisticas.serviciosRealizados}</div>
            <p className="text-green-300 text-xs">Servicios</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-700 rounded-xl p-4">
            <Clock className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-white text-2xl mb-1">{estadisticas.horasTotales}</div>
            <p className="text-blue-300 text-xs">Horas Totales</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900 to-amber-950 border border-amber-700 rounded-xl p-4">
            <Award className="w-5 h-5 text-amber-400 mb-2" />
            <div className="text-white text-2xl mb-1">{estadisticas.certificaciones}</div>
            <p className="text-amber-300 text-xs">Certificaciones</p>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div>
        <h3 className="text-white mb-3">Acciones Rápidas</h3>
        <div className="space-y-2">
          <button 
            onClick={inventarioCompletadoHoy ? undefined : onNavigateToChecklist}
            disabled={inventarioCompletadoHoy}
            className={`w-full rounded-xl py-4 flex items-center justify-center gap-2 transition-all ${
              inventarioCompletadoHoy
                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>
              {inventarioCompletadoHoy 
                ? 'Inventario de Hoy Finalizado' 
                : 'Completar Inventario de Guardia'}
            </span>
          </button>
          <button 
            onClick={onNavigateToGuardias}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl py-4 flex items-center justify-center gap-2 transition-all border border-neutral-700"
          >
            <Calendar className="w-5 h-5" />
            <span>Cargar Nueva Guardia</span>
          </button>
        </div>
      </div>
    </div>
  );
}