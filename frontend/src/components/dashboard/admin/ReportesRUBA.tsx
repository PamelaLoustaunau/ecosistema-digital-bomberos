import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, Truck } from 'lucide-react';

export function ReportesRUBA() {
  const [datosUnidades, setDatosUnidades] = useState<any[]>([]);

  useEffect(() => {
    // Cargar datos del último inventario
    const ultimoInventario = localStorage.getItem('ultimo_inventario');
    if (ultimoInventario) {
      const inventario = JSON.parse(ultimoInventario);
      
      if (inventario.unidades) {
        setDatosUnidades(inventario.unidades);
      }
    }
  }, []);

  const estadisticasMes = {
    totalIncidentes: 23,
    incendios: 12,
    rescates: 6,
    materialesPeligrosos: 2,
    falsasAlarmas: 3,
    tiempoPromedioRespuesta: '4:30'
  };

  const incidentesPorTipo = [
    { tipo: 'Incendio Estructural', cantidad: 8, porcentaje: 35 },
    { tipo: 'Principio de Incendio', cantidad: 4, porcentaje: 17 },
    { tipo: 'Rescate Vehicular', cantidad: 6, porcentaje: 26 },
    { tipo: 'Materiales Peligrosos', cantidad: 2, porcentaje: 9 },
    { tipo: 'Falsas Alarmas', cantidad: 3, porcentaje: 13 },
  ];

  // Calcular unidades disponibles desde el inventario
  const unidadesDisponibles = datosUnidades.filter(u => u.estadoOperativo === 'apresto').length;
  const unidadesFueraServicio = datosUnidades.filter(u => u.estadoOperativo === 'fs').length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white mb-1">Reportes RUBA</h2>
          <p className="text-neutral-400 text-sm">Registro Único de Bomberos Argentinos</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Download className="w-4 h-4" />
          <span className="text-sm">Exportar</span>
        </button>
      </div>

      {/* Selector de período */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-neutral-400" />
          <span className="text-white">Período: Enero 2026</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
            Mes Actual
          </button>
          <button className="px-4 py-2 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded-lg text-sm">
            Último Trimestre
          </button>
          <button className="px-4 py-2 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded-lg text-sm">
            Año 2026
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-red-900 to-red-950 border border-red-700 rounded-xl p-4">
          <p className="text-red-300 text-sm mb-1">Total Incidentes</p>
          <div className="text-white text-3xl mb-2">{estadisticasMes.totalIncidentes}</div>
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>+8% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-700 rounded-xl p-4">
          <p className="text-blue-300 text-sm mb-1">Tiempo Promedio</p>
          <div className="text-white text-3xl mb-2">{estadisticasMes.tiempoPromedioRespuesta}</div>
          <div className="text-blue-400 text-xs">Respuesta al lugar</div>
        </div>
      </div>

      {/* Gráfico de barras simulado */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-neutral-400" />
            <h3 className="text-white">Distribución por Tipo de Incidente</h3>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {incidentesPorTipo.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-300 text-sm">{item.tipo}</span>
                <span className="text-white">{item.cantidad}</span>
              </div>
              <div className="h-3 bg-neutral-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-500"
                  style={{ width: `${item.porcentaje}%` }}
                />
              </div>
              <div className="text-neutral-500 text-xs mt-1">{item.porcentaje}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen por categoría */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <p className="text-neutral-400 text-sm">Incendios</p>
          <div className="text-white text-2xl mt-1">{estadisticasMes.incendios}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <p className="text-neutral-400 text-sm">Rescates</p>
          <div className="text-white text-2xl mt-1">{estadisticasMes.rescates}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <p className="text-neutral-400 text-sm">Mat. Peligrosos</p>
          <div className="text-white text-2xl mt-1">{estadisticasMes.materialesPeligrosos}</div>
        </div>
      </div>

      {/* Estado de unidades */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="w-5 h-5 text-neutral-400" />
          <h3 className="text-white">Disponibilidad de Unidades (Datos del Último Inventario)</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-green-950 border border-green-700 rounded-lg p-3">
            <p className="text-green-300 text-sm">Unidades Disponibles</p>
            <div className="text-white text-3xl">{unidadesDisponibles}</div>
          </div>
          <div className="bg-red-950 border border-red-700 rounded-lg p-3">
            <p className="text-red-300 text-sm">Fuera de Servicio</p>
            <div className="text-white text-3xl">{unidadesFueraServicio}</div>
          </div>
        </div>

        {/* Tabla de unidades */}
        {datosUnidades.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-neutral-400 text-sm mb-2">Kilometrajes Registrados</h4>
            {datosUnidades.map((unidad, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-700 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold">{unidad.codigo}</span>
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      unidad.estadoOperativo === 'apresto'
                        ? 'bg-green-900 text-green-300'
                        : 'bg-red-900 text-red-300'
                    }`}
                  >
                    {unidad.estadoOperativo === 'apresto' ? 'DISPONIBLE' : 'F/S'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-white">{unidad.kilometros?.toLocaleString() || 0} km</p>
                  <p className="text-neutral-400 text-xs">Combustible: {unidad.combustible}%</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {datosUnidades.length === 0 && (
          <div className="bg-amber-950 border border-amber-800 rounded-lg p-3">
            <p className="text-amber-300 text-sm">
              ⚠️ No hay datos de inventario recientes. Los bomberos deben completar el inventario de guardia.
            </p>
          </div>
        )}
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-950 border border-blue-800 rounded-xl p-4">
        <p className="text-blue-300 text-sm">
          Los reportes se sincronizan automáticamente con el sistema RUBA Nacional.
          Los datos son auditados mensualmente por la Federación.
        </p>
      </div>
    </div>
  );
}