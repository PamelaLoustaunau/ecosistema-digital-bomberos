import React, { useState } from 'react';
import { BookOpen, Search, X, ChevronRight, AlertTriangle, Heart, Flame, Car, Droplet, Zap, Shield, Wind, Clock } from 'lucide-react';

interface BibliotecaProtocolosProps {
  onClose?: () => void;
}

export function BibliotecaProtocolos({ onClose }: BibliotecaProtocolosProps) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [protocoloSeleccionado, setProtocoloSeleccionado] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');

  const categorias = [
    { id: 'emergencias_medicas', nombre: 'Emergencias Médicas', icon: Heart, color: 'red' },
    { id: 'incendios', nombre: 'Incendios', icon: Flame, color: 'orange' },
    { id: 'rescates', nombre: 'Rescates', icon: Shield, color: 'blue' },
    { id: 'materiales_peligrosos', nombre: 'Materiales Peligrosos', icon: AlertTriangle, color: 'amber' },
    { id: 'vehicular', nombre: 'Incidentes Vehiculares', icon: Car, color: 'green' },
    { id: 'especiales', nombre: 'Situaciones Especiales', icon: Zap, color: 'purple' },
  ];

  const protocolos = [
    // EMERGENCIAS MÉDICAS
    {
      id: 'rcp',
      categoria: 'emergencias_medicas',
      titulo: 'RCP - Reanimación Cardiopulmonar',
      prioridad: 'critica',
      pasos: [
        '1. Evaluar escena - Asegurar seguridad propia y de la víctima',
        '2. Verificar conciencia - Golpear hombros y hablar en voz alta',
        '3. Llamar a emergencias - Activar sistema de respuesta',
        '4. Posicionar víctima - Superficie dura y plana, boca arriba',
        '5. Abrir vía aérea - Maniobra frente-mentón',
        '6. Verificar respiración - 5-10 segundos (ver, oír, sentir)',
        '7. Compresiones - 30 compresiones al centro del pecho (5-6 cm profundidad)',
        '8. Ventilaciones - 2 respiraciones de rescate (1 segundo cada una)',
        '9. Continuar ciclos - 30:2 hasta llegada de DEA o personal médico',
        '10. DEA si disponible - Seguir instrucciones del dispositivo'
      ],
      notas: '⚠️ Ritmo: 100-120 compresiones por minuto (canción "Stayin Alive"). Minimizar interrupciones.',
      duracion: '2-3 min'
    },
    {
      id: 'hemorragia',
      categoria: 'emergencias_medicas',
      titulo: 'Control de Hemorragias Severas',
      prioridad: 'critica',
      pasos: [
        '1. Protección personal - Colocar guantes inmediatamente',
        '2. Presión directa - Aplicar con gasa o tela sobre la herida',
        '3. Elevar extremidad - Si es posible, por encima del corazón',
        '4. Vendaje compresivo - Mantener presión constante',
        '5. Punto de presión - Si no cesa, presionar arteria proximal',
        '6. Torniquete - Solo si falla todo lo anterior (anotar hora)',
        '7. Monitorear signos vitales - Cada 3-5 minutos',
        '8. Mantener temperatura - Cubrir con manta térmica'
      ],
      notas: '⚠️ Nunca remover vendaje inicial. Agregar capas si es necesario.',
      duracion: '5-10 min'
    },
    {
      id: 'shock',
      categoria: 'emergencias_medicas',
      titulo: 'Tratamiento de Shock',
      prioridad: 'alta',
      pasos: [
        '1. Reconocer signos - Piel pálida/fría, pulso rápido/débil, confusión',
        '2. Posición supina - Elevar piernas 30cm (si no hay trauma)',
        '3. Mantener temperatura - Abrigar con mantas',
        '4. Oxígeno - Administrar alto flujo si disponible',
        '5. No dar líquidos orales - Riesgo de vómito/aspiración',
        '6. Monitoreo continuo - Signos vitales cada 5 minutos',
        '7. Transporte urgente - Coordinar traslado inmediato'
      ],
      notas: 'Tipos: Hipovolémico, cardiogénico, distributivo, obstructivo.',
      duracion: '10-15 min'
    },

    // INCENDIOS
    {
      id: 'incendio_estructural',
      categoria: 'incendios',
      titulo: 'Incendio Estructural',
      prioridad: 'critica',
      pasos: [
        '1. Reconocimiento - Evaluar tipo de estructura, ocupantes, propagación',
        '2. Establecer comando - Designar líder de incidente',
        '3. Rescate primario - Búsqueda de víctimas en áreas accesibles',
        '4. Establecer perímetro - Delimitar zona de exclusión',
        '5. Líneas de agua - 2 líneas mínimo (ataque + protección)',
        '6. Ventilación - Coordinar con equipo de ataque',
        '7. Ataque ofensivo/defensivo - Según evaluación de riesgo',
        '8. Búsqueda secundaria - Una vez controlado',
        '9. Overhaul - Extinguir focos ocultos',
        '10. Preservar evidencia - Para investigación posterior'
      ],
      notas: '⚠️ Regla 2 IN 2 OUT: Siempre trabajar en parejas. Equipos de respaldo.',
      duracion: '30-90 min'
    },
    {
      id: 'incendio_vehicular',
      categoria: 'incendios',
      titulo: 'Incendio de Vehículo',
      prioridad: 'alta',
      pasos: [
        '1. Aproximación segura - Dirección del viento, distancia mínima 30m',
        '2. Identificar riesgos - Tanque de combustible, GNC, híbridos',
        '3. Cortar electricidad - Desconectar batería si es posible',
        '4. Línea de ataque - Espuma o agua nebulizada',
        '5. Enfriar tanque - Aplicar agua al tanque de combustible',
        '6. Apertura de capó - Desde un costado, no de frente',
        '7. Extinción total - Verificar motor y compartimentos',
        '8. Overhaul - Revisar tapizados y maletero'
      ],
      notas: '⚠️ Vehículos eléctricos: Requieren grandes cantidades de agua. Riesgo eléctrico.',
      duracion: '15-30 min'
    },
    {
      id: 'incendio_forestal',
      categoria: 'incendios',
      titulo: 'Incendio Forestal / Pastizal',
      prioridad: 'alta',
      pasos: [
        '1. Evaluación meteorológica - Viento, temperatura, humedad',
        '2. Identificar rutas de escape - Mínimo 2 vías de evacuación',
        '3. Zonas de seguridad - Áreas libres de combustible',
        '4. Ataque indirecto - Líneas cortafuego, contrafuegos',
        '5. Protección de estructuras - Priorizar viviendas',
        '6. Uso de agua/retardante - Según disponibilidad',
        '7. Comunicación constante - Reportar cambios de comportamiento',
        '8. Liquidación - Extinguir focos residuales en perímetro'
      ],
      notas: '⚠️ Reglas LACES: Lookouts, Awareness, Communications, Escape routes, Safety zones.',
      duracion: 'Variable (horas/días)'
    },

    // RESCATES
    {
      id: 'rescate_vehicular',
      categoria: 'rescates',
      titulo: 'Rescate Vehicular (Excarcelación)',
      prioridad: 'critica',
      pasos: [
        '1. Evaluación de escena - Número de víctimas, posición del vehículo',
        '2. Estabilización - Calzos, cuñas, cadenas',
        '3. Manejo de energías - Batería, airbags, combustible',
        '4. Acceso inicial - Puerta más cercana a víctima crítica',
        '5. Estabilización médica - Control cervical, evaluación primaria',
        '6. Creación de acceso - Remoción de puertas/techo según necesidad',
        '7. Desplazamiento de tablero - Liberar espacio para extracción',
        '8. Extracción - Movimiento en bloque con collar cervical',
        '9. Entrega a personal médico - Transferencia coordinada'
      ],
      notas: 'Herramientas: Separador, cizalla, cilindro telescópico. Siempre cubrir víctima.',
      duracion: '20-45 min'
    },
    {
      id: 'rescate_altura',
      categoria: 'rescates',
      titulo: 'Rescate en Altura',
      prioridad: 'alta',
      pasos: [
        '1. Evaluación de acceso - Escalera, plataforma, cuerda',
        '2. Equipamiento personal - Arnés, casco, guantes de rappel',
        '3. Establecer anclajes - Mínimo 2 puntos de anclaje',
        '4. Sistema de respaldo - Línea de seguridad independiente',
        '5. Comunicación - Establecer señales claras',
        '6. Descenso/Ascenso - Técnica adecuada según situación',
        '7. Aseguramiento de víctima - Arnés o camilla según condición',
        '8. Descenso coordinado - Velocidad controlada',
        '9. Evaluación médica - Al llegar a nivel de suelo'
      ],
      notas: '⚠️ Factor de caída máximo: 1. Revisar equipos antes de cada uso.',
      duracion: '30-60 min'
    },
    {
      id: 'rescate_acuatico',
      categoria: 'rescates',
      titulo: 'Rescate Acuático',
      prioridad: 'alta',
      pasos: [
        '1. Evaluar corriente - Velocidad, profundidad, obstáculos',
        '2. Alcanzar (Reach) - Extender rama o palo desde orilla',
        '3. Lanzar (Throw) - Cuerda o elemento flotante',
        '4. Remar (Row) - Aproximación en bote/kayak',
        '5. Ir (Go) - ÚLTIMO RECURSO: Ingreso con equipo completo',
        '6. EPP acuático - Chaleco salvavidas, casco, traje',
        '7. Técnica de aproximación - Nunca de frente a víctima en pánico',
        '8. Extracción - Arrastre desde atrás',
        '9. RCP si necesario - Iniciar inmediatamente al salir del agua'
      ],
      notas: '⚠️ Regla: "Alcanzar o lanzar, no ir". Hipotermia es riesgo secundario.',
      duracion: '10-30 min'
    },

    // MATERIALES PELIGROSOS
    {
      id: 'matpel_identificacion',
      categoria: 'materiales_peligrosos',
      titulo: 'Identificación de Materiales Peligrosos',
      prioridad: 'critica',
      pasos: [
        '1. Aproximación segura - Detener a 100m viento arriba',
        '2. Uso de binoculares - Identificar placas/etiquetas a distancia',
        '3. Número UN - Identificar código de 4 dígitos',
        '4. Clasificación DOT - Color y símbolo de rombo',
        '5. Consultar Guía ERG - Emergency Response Guidebook',
        '6. Establecer zonas - Caliente, tibia, fría',
        '7. No intervenir sin equipo - Esperar equipo HAZMAT',
        '8. Evacuar área - Radio según guía ERG',
        '9. Control de acceso - Nadie entra sin EPP adecuado'
      ],
      notas: 'Clases: 1-Explosivos, 2-Gases, 3-Líquidos inflamables, 4-Sólidos, 5-Oxidantes, 6-Tóxicos, 7-Radiactivos, 8-Corrosivos, 9-Varios.',
      duracion: '15-20 min'
    },
    {
      id: 'fuga_gas',
      categoria: 'materiales_peligrosos',
      titulo: 'Fuga de Gas',
      prioridad: 'alta',
      pasos: [
        '1. No crear chispa - Apagar motores a 50m, no usar radios',
        '2. Ventilar área - Abrir puertas/ventanas si es seguro',
        '3. Cortar suministro - Válvula general si es accesible',
        '4. Evacuación - Perímetro mínimo 100m',
        '5. Detección - Usar explosímetro, nunca llamas',
        '6. Dispersión - Agua nebulizada para gases solubles',
        '7. Contactar empresa - Distribuidora debe enviar técnico',
        '8. Monitoreo continuo - LEL (Límite Explosivo Inferior)'
      ],
      notas: '⚠️ GLP es más pesado que el aire (se acumula bajo). GNC más liviano (sube).',
      duracion: '20-40 min'
    },

    // VEHICULAR
    {
      id: 'derrame_combustible',
      categoria: 'vehicular',
      titulo: 'Derrame de Combustible',
      prioridad: 'alta',
      pasos: [
        '1. Eliminar fuentes de ignición - 15m de radio mínimo',
        '2. Contener derrame - Barreras absorbentes o tierra',
        '3. Evitar alcantarillas - Prevenir contaminación de cursos de agua',
        '4. Cubrir con espuma - Espuma AFFF para suprimir vapores',
        '5. Absorción - Material absorbente específico para hidrocarburos',
        '6. Transferencia segura - Bombeo a contenedor apropiado',
        '7. Limpieza - Remover material contaminado',
        '8. Disposición - Gestión como residuo peligroso'
      ],
      notas: 'Cantidad: <10L: paños absorbentes. >10L: material granulado. >100L: empresa especializada.',
      duracion: '30-90 min'
    },

    // SITUACIONES ESPECIALES
    {
      id: 'incendio_electrico',
      categoria: 'especiales',
      titulo: 'Incendio en Instalaciones Eléctricas',
      prioridad: 'critica',
      pasos: [
        '1. Cortar energía - Interruptor general ANTES de actuar',
        '2. Verificar ausencia tensión - Con equipo adecuado',
        '3. Agente extintor - CO2, PQS o agua nebulizada (si sin tensión)',
        '4. Distancia de seguridad - Mínimo 3m si hay tensión',
        '5. No usar agua chorro - Riesgo de electrocución',
        '6. Coordinar con empresa eléctrica - Para tensiones >380V',
        '7. EPP dieléctrico - Guantes, casco, botas certificadas',
        '8. Revisión post-incendio - Electricista matriculado'
      ],
      notas: '⚠️ Baja tensión <1000V. Media tensión 1-33kV. Alta tensión >33kV.',
      duracion: '20-45 min'
    },
    {
      id: 'rescate_espacios_confinados',
      categoria: 'especiales',
      titulo: 'Rescate en Espacios Confinados',
      prioridad: 'critica',
      pasos: [
        '1. Identificar espacio - Pozo, tanque, silo, alcantarilla',
        '2. Monitoreo atmosférico - O2, gases tóxicos, explosivos',
        '3. Ventilación forzada - Antes de ingreso',
        '4. Sistema de recuperación - Trípode, winch, arnés',
        '5. Vigía exterior - Nunca ingresar solo',
        '6. Comunicación continua - Radio o señales',
        '7. Equipo de respaldo - Segundo equipo listo para ingreso',
        '8. Línea de vida - Conectada en todo momento',
        '9. Extracción vertical - Sistema de poleas'
      ],
      notas: '⚠️ Atmósfera respirable: O2 19.5-23.5%, LEL <10%, H2S <10ppm, CO <35ppm.',
      duracion: '30-120 min'
    },
    {
      id: 'incidente_masivo',
      categoria: 'especiales',
      titulo: 'Incidente con Múltiples Víctimas',
      prioridad: 'critica',
      pasos: [
        '1. Activar protocolo IMV - Alertar a comando',
        '2. Establecer puesto comando - Ubicación estratégica',
        '3. Triage START - Clasificar víctimas (Negro, Rojo, Amarillo, Verde)',
        '4. Área de tratamiento - Separar por prioridad',
        '5. Coordinación médica - Derivación a hospitales',
        '6. Registro de víctimas - Tarjetas de triage',
        '7. Área de espera - Para familiares',
        '8. Comunicaciones - Info unificada a prensa'
      ],
      notas: 'START: Simple Triage And Rapid Treatment. Evaluar: Respiración, Perfusión, Mental.',
      duracion: 'Variable (2-6 horas)'
    }
  ];

  const protocolosFiltrados = protocolos.filter(p => {
    if (categoriaSeleccionada && p.categoria !== categoriaSeleccionada) return false;
    if (busqueda) {
      return p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
             p.pasos.some(paso => paso.toLowerCase().includes(busqueda.toLowerCase()));
    }
    return true;
  });

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-900 text-red-300 border-red-700';
      case 'alta': return 'bg-amber-900 text-amber-300 border-amber-700';
      default: return 'bg-blue-900 text-blue-300 border-blue-700';
    }
  };

  if (protocoloSeleccionado) {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-auto">
        <div className="min-h-screen">
          {/* Header del protocolo */}
          <div className="bg-neutral-900 border-b-2 border-red-600 sticky top-0 z-10">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setProtocoloSeleccionado(null)}
                  className="text-neutral-400 hover:text-white flex items-center gap-2"
                >
                  ← Volver
                </button>
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-white mb-2">{protocoloSeleccionado.titulo}</h2>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm border ${getPrioridadColor(protocoloSeleccionado.prioridad)}`}>
                  {protocoloSeleccionado.prioridad === 'critica' ? 'PRIORIDAD CRÍTICA' : 
                   protocoloSeleccionado.prioridad === 'alta' ? 'PRIORIDAD ALTA' : 'PRIORIDAD MEDIA'}
                </div>
                <div className="text-neutral-400 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {protocoloSeleccionado.duracion}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido del protocolo */}
          <div className="p-4 space-y-4">
            {/* Pasos numerados */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800">
                <h3 className="text-white">Procedimiento</h3>
              </div>
              <div className="divide-y divide-neutral-800">
                {protocoloSeleccionado.pasos.map((paso: string, idx: number) => (
                  <div key={idx} className="px-4 py-4 flex gap-4">
                    <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-neutral-300 flex-1">{paso.replace(/^\d+\.\s/, '')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas importantes */}
            {protocoloSeleccionado.notas && (
              <div className="bg-amber-950 border-2 border-amber-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-amber-200 mb-2">Notas Importantes</h4>
                    <p className="text-amber-300 text-sm">{protocoloSeleccionado.notas}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de acción rápida */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <p className="text-neutral-400 text-sm mb-3">
                Este protocolo está disponible sin conexión. Puedes consultarlo en cualquier momento.
              </p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 transition-all">
                Marcar como Consultado
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-10">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white">Biblioteca de Protocolos</h2>
                  <p className="text-neutral-400 text-sm">Disponible sin conexión</p>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar protocolo..."
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-4">
          {/* Categorías */}
          {!categoriaSeleccionada && (
            <div>
              <h3 className="text-white mb-3">Categorías</h3>
              <div className="grid grid-cols-2 gap-3">
                {categorias.map((categoria) => {
                  const Icon = categoria.icon;
                  const count = protocolos.filter(p => p.categoria === categoria.id).length;
                  return (
                    <button
                      key={categoria.id}
                      onClick={() => setCategoriaSeleccionada(categoria.id)}
                      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl p-4 text-left transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-6 h-6 text-${categoria.color}-400`} />
                        <span className="text-neutral-500 text-sm">{count}</span>
                      </div>
                      <h4 className="text-white text-sm">{categoria.nombre}</h4>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lista de protocolos */}
          <div>
            {categoriaSeleccionada && (
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white">
                  {categorias.find(c => c.id === categoriaSeleccionada)?.nombre}
                </h3>
                <button
                  onClick={() => setCategoriaSeleccionada(null)}
                  className="text-blue-400 text-sm"
                >
                  Ver todas
                </button>
              </div>
            )}
            
            <div className="space-y-3">
              {protocolosFiltrados.map((protocolo) => (
                <button
                  key={protocolo.id}
                  onClick={() => setProtocoloSeleccionado(protocolo)}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl p-4 text-left transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white">{protocolo.titulo}</h4>
                    <ChevronRight className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs border ${getPrioridadColor(protocolo.prioridad)}`}>
                      {protocolo.prioridad === 'critica' ? 'CRÍTICA' : 
                       protocolo.prioridad === 'alta' ? 'ALTA' : 'MEDIA'}
                    </div>
                    <span className="text-neutral-500 text-xs">{protocolo.pasos.length} pasos</span>
                    <span className="text-neutral-500 text-xs">• {protocolo.duracion}</span>
                  </div>
                </button>
              ))}
            </div>

            {protocolosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-500">No se encontraron protocolos</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-950 border border-blue-800 rounded-xl p-4">
            <p className="text-blue-300 text-sm">
              📱 Todos los protocolos están disponibles sin conexión a internet. 
              Se recomienda revisar y familiarizarse con cada procedimiento durante el entrenamiento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}