import React, { useState } from 'react';
import { FileText, Calendar, MapPin, Clock, Users, ChevronRight, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Formatea una fecha en formato YYYY-MM-DD a texto legible sin conversión UTC
 * Evita el problema de "off-by-one" al no usar new Date() con string ISO
 */
function formatearFechaSinUTC(fechaString: string, options?: { weekday?: 'long' | 'short', day?: 'numeric', month?: 'short' | 'long', year?: 'numeric' }): string {
  // Extraer año, mes, día directamente del string YYYY-MM-DD
  const [year, month, day] = fechaString.split('-').map(Number);
  
  // Crear fecha en zona horaria local (sin conversión UTC)
  const fecha = new Date(year, month - 1, day);
  
  return fecha.toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    ...options
  });
}

interface HistorialIncidentesProps {
  emergenciasFinalizadas?: any[];
}

export function HistorialIncidentes({ emergenciasFinalizadas = [] }: HistorialIncidentesProps) {
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<any>(null);
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'finalizado'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [bomberosExpandido, setBomberosExpandido] = useState<{ [key: string]: boolean }>({});

  // Función para calcular duración
  const calcularDuracion = (horaInicio: string, horaFin: string) => {
    if (!horaInicio || !horaFin) return '-';
    const [h1, m1] = horaInicio.split(':').map(Number);
    const [h2, m2] = horaFin.split(':').map(Number);
    const minutos1 = h1 * 60 + m1;
    const minutos2 = h2 * 60 + m2;
    const diff = minutos2 - minutos1;
    const horas = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${horas}h ${mins}min`;
  };

  // Datos de demostración - En producción vendrían de la base de datos
  const incidentes = [
    {
      id: 'INC-2026-001',
      tipo: 'Incendio Estructural',
      direccion: 'Av. San Martín 1234',
      nivel: 'alto',
      fecha: '2026-01-02',
      hora: '14:30',
      estado: 'finalizado',
      duracion: '2h 15min',
      unidadesIntervinientes: ['B-1', 'B-2', 'UTR-1'],
      bomberosPresentes: 8,
      bomberosListado: ['Juan Pérez (#101)', 'María González (#102)', 'Carlos Rodríguez (#103)', 'Ana Martínez (#104)', 'Luis Fernández (#105)', 'Sofia López (#106)', 'Diego Torres (#107)', 'Laura Sánchez (#108)'],
      jefeDeTurno: 'Jefe Carlos Méndez',
      observaciones: 'Incendio en cocina. Propagación controlada a tiempo. Sin víctimas. Daños materiales moderados.',
      coordenadas: { lat: -34.6037, lng: -58.3816 }
    },
    {
      id: 'INC-2026-002',
      tipo: 'Rescate Vehicular',
      direccion: 'Ruta 9 Km 45',
      nivel: 'alto',
      fecha: '2026-01-01',
      hora: '11:15',
      estado: 'finalizado',
      duracion: '1h 45min',
      unidadesIntervinientes: ['B-1', 'UTR-1'],
      bomberosPresentes: 6,
      bomberosListado: ['Juan Pérez (#101)', 'Carlos Rodríguez (#103)', 'Luis Fernández (#105)', 'Diego Torres (#107)', 'Miguel Ángel Ruiz (#109)', 'Pablo Fernández (#110)'],
      jefeDeTurno: 'Jefe Carlos Méndez',
      observaciones: 'Colisión frontal. 2 víctimas excarceladas y derivadas al Hospital Municipal. Cierre temporal de ruta.',
      coordenadas: { lat: -34.6100, lng: -58.3700 }
    },
    {
      id: 'INC-2026-003',
      tipo: 'Principio de Incendio',
      direccion: 'Calle Mitre 567',
      nivel: 'medio',
      fecha: '2025-12-31',
      hora: '09:45',
      estado: 'finalizado',
      duracion: '45min',
      unidadesIntervinientes: ['B-2'],
      bomberosPresentes: 4,
      bomberosListado: ['María González (#102)', 'Ana Martínez (#104)', 'Sofia López (#106)', 'Laura Sánchez (#108)'],
      jefeDeTurno: 'Oficial Juan Pérez',
      observaciones: 'Cortocircuito en instalación eléctrica. Extinción rápida. Sin propagación.',
      coordenadas: { lat: -34.5980, lng: -58.3900 }
    },
    {
      id: 'INC-2025-345',
      tipo: 'Fuga de Gas',
      direccion: 'Av. Belgrano 890',
      nivel: 'alto',
      fecha: '2025-12-30',
      hora: '16:20',
      estado: 'finalizado',
      duracion: '3h 10min',
      unidadesIntervinientes: ['B-1', 'B-2'],
      bomberosPresentes: 7,
      bomberosListado: ['Juan Pérez (#101)', 'María González (#102)', 'Carlos Rodríguez (#103)', 'Luis Fernández (#105)', 'Diego Torres (#107)', 'Miguel Ángel Ruiz (#109)', 'Pablo Fernández (#110)'],
      jefeDeTurno: 'Jefe Carlos Méndez',
      observaciones: 'Fuga en cañería principal. Evacuación de 3 edificios. Coordinación con empresa distribuidora.',
      coordenadas: { lat: -34.6050, lng: -58.3800 }
    },
    {
      id: 'INC-2025-344',
      tipo: 'Incendio Vehicular',
      direccion: 'Av. Rivadavia 2345',
      nivel: 'medio',
      fecha: '2025-12-29',
      hora: '18:50',
      estado: 'finalizado',
      duracion: '1h 20min',
      unidadesIntervinientes: ['B-1'],
      bomberosPresentes: 4,
      bomberosListado: ['Juan Pérez (#101)', 'Carlos Rodríguez (#103)', 'Luis Fernández (#105)', 'Diego Torres (#107)'],
      jefeDeTurno: 'Oficial María González',
      observaciones: 'Incendio en motor. Pérdida total del vehículo. Sin lesionados.',
      coordenadas: { lat: -34.6070, lng: -58.3780 }
    },
    {
      id: 'INC-2025-343',
      tipo: 'Rescate en Altura',
      direccion: 'Edificio Torre Central, Piso 8',
      nivel: 'medio',
      fecha: '2025-12-28',
      hora: '10:30',
      estado: 'finalizado',
      duracion: '2h 00min',
      unidadesIntervinientes: ['AE-1', 'B-2'],
      bomberosPresentes: 5,
      bomberosListado: ['María González (#102)', 'Ana Martínez (#104)', 'Sofia López (#106)', 'Laura Sánchez (#108)', 'Miguel Ángel Ruiz (#109)'],
      jefeDeTurno: 'Jefe Carlos Méndez',
      observaciones: 'Persona atrapada en balcón. Descenso con autoescala. Sin complicaciones.',
      coordenadas: { lat: -34.6020, lng: -58.3850 }
    },
    {
      id: 'INC-2025-342',
      tipo: 'Inundación',
      direccion: 'Barrio Los Olmos - Calle 12',
      nivel: 'bajo',
      fecha: '2025-12-27',
      hora: '14:15',
      estado: 'finalizado',
      duracion: '4h 30min',
      unidadesIntervinientes: ['B-1', 'B-2', 'CA-1'],
      bomberosPresentes: 10,
      bomberosListado: ['Juan Pérez (#101)', 'María González (#102)', 'Carlos Rodríguez (#103)', 'Ana Martínez (#104)', 'Luis Fernández (#105)', 'Sofia López (#106)', 'Diego Torres (#107)', 'Laura Sánchez (#108)', 'Miguel Ángel Ruiz (#109)', 'Pablo Fernández (#110)'],
      jefeDeTurno: 'Jefe Carlos Méndez',
      observaciones: 'Anegamiento por rotura de cañería maestra. Evacuación de 15 viviendas. Achique de agua.',
      coordenadas: { lat: -34.6040, lng: -58.3900 }
    },
    {
      id: 'INC-2025-341',
      tipo: 'Materiales Peligrosos',
      direccion: 'Parque Industrial - Acceso Sur',
      nivel: 'alto',
      fecha: '2025-12-26',
      hora: '08:00',
      estado: 'finalizado',
      duracion: '5h 45min',
      unidadesIntervinientes: ['B-1', 'B-2', 'UTR-1'],
      bomberosPresentes: 12,
      bomberosListado: ['Juan Pérez (#101)', 'María González (#102)', 'Carlos Rodríguez (#103)', 'Ana Martínez (#104)', 'Luis Fernández (#105)', 'Sofia López (#106)', 'Diego Torres (#107)', 'Laura Sánchez (#108)', 'Miguel Ángel Ruiz (#109)', 'Pablo Fernández (#110)', 'Alejandro Castro (#111)', 'Fernando Vargas (#112)'],
      jefeDeTurno: 'Jefe Carlos Méndez',
      observaciones: 'Derrame de sustancia química. Coordinación con HAZMAT regional. Contención exitosa.',
      coordenadas: { lat: -34.6120, lng: -58.3820 }
    }
  ];

  const incidentesFiltrados = incidentes.filter(inc => {
    if (filtroEstado !== 'todos' && inc.estado !== filtroEstado) return false;
    if (busqueda) {
      return inc.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
             inc.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
             inc.id.toLowerCase().includes(busqueda.toLowerCase());
    }
    return true;
  });

  // Convertir emergencias finalizadas al formato del historial
  const emergenciasConvertidas = emergenciasFinalizadas.map(e => ({
    id: e.id,
    tipo: e.tipo,
    direccion: e.direccion,
    nivel: e.nivel,
    fecha: e.timestamp.split('T')[0],
    hora: new Date(e.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    estado: 'finalizado',
    duracion: e.informe ? calcularDuracion(e.informe.horaLlegada, e.informe.horaSalida) : '-',
    unidadesIntervinientes: e.informe?.unidadesUtilizadas || [],
    bomberosPresentes: e.informe?.bomberosPresentes?.length || 0,
    jefeDeTurno: 'Guardia Actual',
    observaciones: e.informe?.descripcionAcciones || e.referencias || 'Sin observaciones',
    coordenadas: e.coordenadas
  }));

  // Combinar emergencias recientes con historial
  const todosLosIncidentes = [...emergenciasConvertidas, ...incidentesFiltrados];

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

  if (incidenteSeleccionado) {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-auto">
        <div className="min-h-screen p-4">
          <button
            onClick={() => setIncidenteSeleccionado(null)}
            className="text-neutral-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Volver al historial
          </button>

          {/* Header del incidente */}
          <div className="bg-neutral-900 border-2 border-red-600 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-white mb-1">{incidenteSeleccionado.tipo}</h2>
                <p className="text-neutral-400 text-sm">ID: {incidenteSeleccionado.id}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm border ${getNivelColor(incidenteSeleccionado.nivel)}`}>
                {getNivelEmoji(incidenteSeleccionado.nivel)} {incidenteSeleccionado.nivel.toUpperCase()}
              </div>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{incidenteSeleccionado.direccion}</span>
            </div>
          </div>

          {/* Detalles del incidente */}
          <div className="space-y-4">
            {/* Información temporal */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Información del Incidente</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-400 text-sm">Fecha</p>
                  <p className="text-white">
                    {formatearFechaSinUTC(incidenteSeleccionado.fecha, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm">Hora de Alerta</p>
                  <p className="text-white">{incidenteSeleccionado.hora}</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm">Duración Total</p>
                  <p className="text-white">{incidenteSeleccionado.duracion}</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm">Estado</p>
                  <p className="text-green-400 capitalize">{incidenteSeleccionado.estado}</p>
                </div>
              </div>
            </div>

            {/* Recursos desplegados */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Recursos Desplegados</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-neutral-400 text-sm mb-2">Unidades Intervinientes</p>
                  <div className="flex flex-wrap gap-2">
                    {incidenteSeleccionado.unidadesIntervinientes.map((unidad: string) => (
                      <div key={unidad} className="bg-blue-900 border border-blue-700 px-3 py-1 rounded-lg">
                        <span className="text-blue-300">{unidad}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-neutral-400 text-sm mb-2">Bomberos Presentes</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBomberosExpandido(prev => ({
                          ...prev,
                          [incidenteSeleccionado.id]: !prev[incidenteSeleccionado.id]
                        }));
                      }}
                      className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 hover:bg-neutral-800 transition-all w-full"
                    >
                      <Users className="w-5 h-5 text-green-400" />
                      <span className="text-white text-lg">{incidenteSeleccionado.bomberosPresentes}</span>
                      <span className="text-neutral-400 text-sm">Bombero{incidenteSeleccionado.bomberosPresentes !== 1 ? 's' : ''}</span>
                      {bomberosExpandido[incidenteSeleccionado.id] ? (
                        <ChevronUp className="w-4 h-4 text-neutral-400 ml-auto" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-400 ml-auto" />
                      )}
                    </button>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm">Jefe de Turno</p>
                    <p className="text-white mt-1">{incidenteSeleccionado.jefeDeTurno}</p>
                  </div>
                </div>
                
                {/* Listado de Bomberos (acordeón) */}
                {bomberosExpandido[incidenteSeleccionado.id] && incidenteSeleccionado.bomberosListado && (
                  <div className="mt-3 bg-neutral-950 border border-neutral-700 rounded-lg p-3">
                    <p className="text-neutral-400 text-xs mb-2">Personal Asistente:</p>
                    <div className="space-y-1">
                      {incidenteSeleccionado.bomberosListado.map((bombero: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-neutral-300">{bombero}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Observaciones */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Observaciones y Detalles</h3>
              <p className="text-neutral-300">{incidenteSeleccionado.observaciones}</p>
            </div>

            {/* Ubicación */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-white mb-3">Ubicación</h3>
              <div className="flex items-center gap-2 text-neutral-300 mb-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{incidenteSeleccionado.direccion}</span>
              </div>
              <p className="text-neutral-500 text-sm">
                Coordenadas: {incidenteSeleccionado.coordenadas.lat.toFixed(6)}, {incidenteSeleccionado.coordenadas.lng.toFixed(6)}
              </p>
            </div>

            {/* Botones de acción */}
            <div className="space-y-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 transition-all">
                Ver en Mapa
              </button>
              <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl py-3 transition-all border border-neutral-700">
                Exportar Reporte PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-white mb-1">Historial de Incidentes</h2>
        <p className="text-neutral-400 text-sm">Registro completo de emergencias atendidas</p>
      </div>

      {/* Buscador y Filtros */}
      <div className="space-y-3">
        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por tipo, dirección o ID..."
            className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-red-600"
          />
        </div>

        {/* Filtros rápidos */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFiltroEstado('todos')}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              filtroEstado === 'todos'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            Todos ({incidentes.length})
          </button>
          <button
            onClick={() => setFiltroEstado('finalizado')}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              filtroEstado === 'finalizado'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            Finalizados ({incidentes.filter(i => i.estado === 'finalizado').length})
          </button>
        </div>
      </div>

      {/* Resumen estadístico */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <p className="text-neutral-400 text-xs">Este Mes</p>
          <div className="text-white text-2xl mt-1">{3 + emergenciasConvertidas.length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <p className="text-neutral-400 text-xs">Total 2025</p>
          <div className="text-white text-2xl mt-1">{345 + emergenciasConvertidas.length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <p className="text-neutral-400 text-xs">Prom/Mes</p>
          <div className="text-white text-2xl mt-1">29</div>
        </div>
      </div>

      {/* Lista de incidentes */}
      <div className="space-y-3">
        {todosLosIncidentes.map((incidente) => (
          <button
            key={incidente.id}
            onClick={() => setIncidenteSeleccionado(incidente)}
            className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl p-4 text-left transition-all"
          >
            {/* Header del card */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white">{incidente.tipo}</h3>
                  <div className={`px-2 py-0.5 rounded text-xs border ${getNivelColor(incidente.nivel)}`}>
                    {getNivelEmoji(incidente.nivel)}
                  </div>
                </div>
                <p className="text-neutral-500 text-xs">{incidente.id}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-500 flex-shrink-0" />
            </div>

            {/* Dirección */}
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
              <p className="text-neutral-300 text-sm">{incidente.direccion}</p>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatearFechaSinUTC(incidente.fecha)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{incidente.hora}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{incidente.bomberosPresentes}</span>
              </div>
            </div>

            {/* Unidades */}
            <div className="mt-3 flex flex-wrap gap-1">
              {incidente.unidadesIntervinientes.map((unidad) => (
                <span key={unidad} className="bg-neutral-950 px-2 py-1 rounded text-xs text-neutral-400">
                  {unidad}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {todosLosIncidentes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">No se encontraron incidentes</p>
        </div>
      )}
    </div>
  );
}