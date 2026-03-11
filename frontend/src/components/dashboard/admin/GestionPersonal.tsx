import React, { useState } from 'react';
import { 
  UserCheck, 
  Shield, 
  Droplet, 
  AlertTriangle, 
  Phone, 
  Plus, 
  Edit2, 
  UserX,
  CheckCircle,
  X,
  MapPin,
  Clock,
  Award
} from 'lucide-react';

// Escalafón oficial de Bomberos Voluntarios Argentina
const escalafon = [
  { categoria: 'Oficial Superior', rangos: ['Comandante General'] },
  { categoria: 'Oficial Jefe', rangos: ['Comandante Mayor', 'Comandante', 'Sub-Comandante'] },
  { categoria: 'Oficial Subalterno', rangos: ['Oficial Principal', 'Oficial Inspector', 'Oficial Ayudante'] },
  { categoria: 'Suboficial', rangos: ['Suboficial Mayor', 'Suboficial Principal', 'Sargento Primero', 'Sargento'] },
  { categoria: 'Tropa', rangos: ['Cabo Primero', 'Cabo', 'Bombero'] }
];

const todosLosRangos = escalafon.flatMap(cat => cat.rangos);

const especialidadesDisponibles = ['Chofer', 'Rescate', 'Incendio'];

export function GestionPersonal() {
  const [selectedBombero, setSelectedBombero] = useState<any>(null);
  const [showFormulario, setShowFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [showNotificacion, setShowNotificacion] = useState(false);
  const [mensajeNotificacion, setMensajeNotificacion] = useState('');

  const [formulario, setFormulario] = useState({
    nombre: '',
    dni: '',
    legajo: '',
    rango: 'Bombero',
    especialidades: [] as string[],
    personalZona: false,
    grupoSanguineo: '',
    alergias: '',
    contactoEmergencia: ''
  });

  const [personal, setPersonal] = useState([
    { 
      id: 1, 
      legajo: '001', 
      dni: '30123456',
      nombre: 'Carlos Méndez', 
      rango: 'Comandante',
      especialidades: ['Chofer', 'Incendio'],
      personalZona: false,
      estado: 'activo',
      grupoSanguineo: 'O+',
      alergias: 'Ninguna',
      contactoEmergencia: '+54 9 11 1234-5678',
      horasSemanales: 8,
      certificaciones: ['RCP', 'Comando de Incidentes'],
      fechaIngreso: '2010-03-15'
    },
    { 
      id: 2, 
      legajo: '101', 
      dni: '35456789',
      nombre: 'Juan Pérez', 
      rango: 'Cabo Primero',
      especialidades: ['Chofer', 'Rescate'],
      personalZona: false,
      estado: 'activo',
      grupoSanguineo: 'A+',
      alergias: 'Ninguna',
      contactoEmergencia: '+54 9 11 2345-6789',
      horasSemanales: 6,
      certificaciones: ['RCP', 'Rescate Vehicular'],
      fechaIngreso: '2018-06-20'
    },
    { 
      id: 3, 
      legajo: '102', 
      dni: '33987654',
      nombre: 'María González', 
      rango: 'Bombero',
      especialidades: ['Rescate'],
      personalZona: true,
      estado: 'activo',
      grupoSanguineo: 'B+',
      alergias: 'Penicilina',
      contactoEmergencia: '+54 9 11 3456-7890',
      horasSemanales: 4,
      certificaciones: ['RCP', 'Primeros Auxilios'],
      fechaIngreso: '2020-01-10'
    },
    { 
      id: 4, 
      legajo: '050', 
      dni: '28765432',
      nombre: 'Roberto Silva', 
      rango: 'Oficial Principal',
      especialidades: ['Incendio', 'Rescate'],
      personalZona: false,
      estado: 'activo',
      grupoSanguineo: 'O-',
      alergias: 'Ninguna',
      contactoEmergencia: '+54 9 11 4567-8901',
      horasSemanales: 10,
      certificaciones: ['RCP', 'Materiales Peligrosos', 'Instructor'],
      fechaIngreso: '2012-09-05'
    },
  ]);

  const mostrarNotificacion = (mensaje: string) => {
    setMensajeNotificacion(mensaje);
    setShowNotificacion(true);
    setTimeout(() => {
      setShowNotificacion(false);
    }, 3000);
  };

  const handleToggleEspecialidad = (especialidad: string) => {
    const nuevasEspecialidades = formulario.especialidades.includes(especialidad)
      ? formulario.especialidades.filter(e => e !== especialidad)
      : [...formulario.especialidades, especialidad];
    
    setFormulario({ ...formulario, especialidades: nuevasEspecialidades });
  };

  const handleGuardarBombero = () => {
    if (!formulario.nombre || !formulario.dni || !formulario.legajo) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (editando) {
      // Actualizar bombero existente
      setPersonal(personal.map(p => 
        p.id === selectedBombero.id 
          ? { 
              ...selectedBombero, 
              ...formulario,
              horasSemanales: selectedBombero.horasSemanales // Mantener horas actuales
            }
          : p
      ));
      mostrarNotificacion('Bombero actualizado correctamente');
      setEditando(false);
      setSelectedBombero(null);
    } else {
      // Agregar nuevo bombero
      const nuevoBombero = {
        id: personal.length + 1,
        ...formulario,
        estado: 'activo',
        grupoSanguineo: formulario.grupoSanguineo || 'No especificado',
        alergias: formulario.alergias || 'Ninguna',
        contactoEmergencia: formulario.contactoEmergencia || 'No especificado',
        horasSemanales: 0,
        certificaciones: [],
        fechaIngreso: new Date().toISOString().split('T')[0]
      };
      setPersonal([...personal, nuevoBombero]);
      mostrarNotificacion(`Bombero ${formulario.nombre} dado de alta correctamente`);
    }

    // Resetear formulario
    setFormulario({
      nombre: '',
      dni: '',
      legajo: '',
      rango: 'Bombero',
      especialidades: [],
      personalZona: false,
      grupoSanguineo: '',
      alergias: '',
      contactoEmergencia: ''
    });
    setShowFormulario(false);
  };

  const handleEditarBombero = (bombero: any) => {
    setSelectedBombero(bombero);
    setFormulario({
      nombre: bombero.nombre,
      dni: bombero.dni,
      legajo: bombero.legajo,
      rango: bombero.rango,
      especialidades: bombero.especialidades,
      personalZona: bombero.personalZona,
      grupoSanguineo: bombero.grupoSanguineo,
      alergias: bombero.alergias,
      contactoEmergencia: bombero.contactoEmergencia
    });
    setEditando(true);
    setShowFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDarDeBaja = (bombero: any) => {
    if (confirm(`¿Estás seguro de dar de baja a ${bombero.nombre}?`)) {
      setPersonal(personal.map(p => 
        p.id === bombero.id 
          ? { ...p, estado: 'inactivo' }
          : p
      ));
      mostrarNotificacion(`${bombero.nombre} dado de baja del sistema`);
    }
  };

  const cumpleHorasMinimas = (horas: number) => horas >= 6;

  // Vista de detalle de un bombero
  if (selectedBombero && !editando) {
    return (
      <div className="p-4 space-y-4 pb-24">
        <button
          onClick={() => setSelectedBombero(null)}
          className="text-neutral-400 hover:text-white flex items-center gap-2"
        >
          ← Volver
        </button>

        {/* Ficha médica de emergencia */}
        <div className="bg-red-950 border-2 border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-red-200">Ficha Médica de Emergencia</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-red-900 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Droplet className="w-4 h-4 text-red-300" />
                <span className="text-red-300 text-sm">Grupo Sanguíneo</span>
              </div>
              <p className="text-white text-xl">{selectedBombero.grupoSanguineo}</p>
            </div>

            <div className="bg-red-900 rounded-lg p-3">
              <span className="text-red-300 text-sm">Alergias</span>
              <p className="text-white">{selectedBombero.alergias}</p>
            </div>

            <div className="bg-red-900 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-red-300" />
                <span className="text-red-300 text-sm">Contacto de Emergencia</span>
              </div>
              <a href={`tel:${selectedBombero.contactoEmergencia}`} className="text-white text-lg hover:text-red-200">
                {selectedBombero.contactoEmergencia}
              </a>
            </div>
          </div>
        </div>

        {/* Información general */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
          <h3 className="text-white mb-3">Información General</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-neutral-400 text-sm">Legajo</p>
              <p className="text-white">#{selectedBombero.legajo}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">DNI</p>
              <p className="text-white">{selectedBombero.dni}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Rango</p>
              <p className="text-white">{selectedBombero.rango}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Estado</p>
              <p className={selectedBombero.estado === 'activo' ? 'text-green-400' : 'text-red-400'}>
                {selectedBombero.estado === 'activo' ? 'Activo' : 'Inactivo'}
              </p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Horas Semanales</p>
              <div className="flex items-center gap-2">
                <p className="text-white">{selectedBombero.horasSemanales} hs</p>
                <div className={`w-2 h-2 rounded-full ${cumpleHorasMinimas(selectedBombero.horasSemanales) ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Personal de Zona</p>
              <p className="text-white">{selectedBombero.personalZona ? 'Sí (Sierras)' : 'No'}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800">
            <p className="text-neutral-400 text-sm mb-2">Especialidades</p>
            <div className="flex flex-wrap gap-2">
              {selectedBombero.especialidades.map((esp: string) => (
                <span key={esp} className="bg-blue-900 border border-blue-700 text-blue-300 px-3 py-1 rounded-lg text-sm">
                  {esp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Certificaciones */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <h3 className="text-white mb-3">Certificaciones</h3>
          <div className="space-y-2">
            {selectedBombero.certificaciones.map((cert: string, idx: number) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-400" />
                  <span className="text-white">{cert}</span>
                </div>
                <span className="text-green-400 text-sm">Vigente</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleEditarBombero(selectedBombero)}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => handleDarDeBaja(selectedBombero)}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
          >
            <UserX className="w-4 h-4" />
            Dar de Baja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Notificación */}
      {showNotificacion && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>{mensajeNotificacion}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white mb-1">Gestión de Personal</h2>
          <p className="text-neutral-400 text-sm">
            {personal.filter(p => p.estado === 'activo').length} bomberos activos
          </p>
        </div>
        <button
          onClick={() => {
            setShowFormulario(!showFormulario);
            setEditando(false);
            setFormulario({
              nombre: '',
              dni: '',
              legajo: '',
              rango: 'Bombero',
              especialidades: [],
              personalZona: false,
              grupoSanguineo: '',
              alergias: '',
              contactoEmergencia: ''
            });
          }}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-all"
        >
          {showFormulario ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {/* Formulario de alta/edición */}
      {showFormulario && (
        <div className="bg-neutral-900 border-2 border-red-600 rounded-xl p-4 space-y-3">
          <h3 className="text-white">
            {editando ? 'Editar Bombero' : 'Dar de Alta Bombero'}
          </h3>

          <div>
            <label className="block text-neutral-300 text-sm mb-2">Nombre Completo *</label>
            <input
              type="text"
              value={formulario.nombre}
              onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              placeholder="Juan Pérez"
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 text-sm mb-2">DNI *</label>
              <input
                type="text"
                value={formulario.dni}
                onChange={(e) => setFormulario({ ...formulario, dni: e.target.value })}
                placeholder="30123456"
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-neutral-300 text-sm mb-2">Legajo *</label>
              <input
                type="text"
                value={formulario.legajo}
                onChange={(e) => setFormulario({ ...formulario, legajo: e.target.value })}
                placeholder="101"
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 text-sm mb-2">Rango *</label>
            <select
              value={formulario.rango}
              onChange={(e) => setFormulario({ ...formulario, rango: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
            >
              {escalafon.map((cat) => (
                <optgroup key={cat.categoria} label={cat.categoria}>
                  {cat.rangos.map((rango) => (
                    <option key={rango} value={rango}>
                      {rango}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-300 text-sm mb-2">Especialidades</label>
            <div className="space-y-2">
              {especialidadesDisponibles.map((esp) => (
                <label key={esp} className="flex items-center gap-3 bg-neutral-950 border border-neutral-700 rounded-lg p-3 cursor-pointer hover:bg-neutral-800 transition-all">
                  <input
                    type="checkbox"
                    checked={formulario.especialidades.includes(esp)}
                    onChange={() => handleToggleEspecialidad(esp)}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-white">{esp}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 bg-neutral-950 border border-neutral-700 rounded-lg p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formulario.personalZona}
                onChange={(e) => setFormulario({ ...formulario, personalZona: e.target.checked })}
                className="w-4 h-4 accent-red-600"
              />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span className="text-white">Personal de Zona (Sierras)</span>
              </div>
            </label>
          </div>

          {/* Información médica opcional */}
          <div className="pt-3 border-t border-neutral-800">
            <h4 className="text-neutral-300 text-sm mb-3">Información Médica (Opcional)</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 text-sm mb-2">Grupo Sanguíneo</label>
                <select
                  value={formulario.grupoSanguineo}
                  onChange={(e) => setFormulario({ ...formulario, grupoSanguineo: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
                >
                  <option value="">Seleccionar</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-300 text-sm mb-2">Contacto Emergencia</label>
                <input
                  type="tel"
                  value={formulario.contactoEmergencia}
                  onChange={(e) => setFormulario({ ...formulario, contactoEmergencia: e.target.value })}
                  placeholder="+54 9 11 1234-5678"
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-neutral-300 text-sm mb-2">Alergias</label>
              <input
                type="text"
                value={formulario.alergias}
                onChange={(e) => setFormulario({ ...formulario, alergias: e.target.value })}
                placeholder="Ninguna, Penicilina, etc."
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              onClick={handleGuardarBombero}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {editando ? 'Guardar Cambios' : 'Dar de Alta'}
            </button>
            <button
              onClick={() => {
                setShowFormulario(false);
                setEditando(false);
                setFormulario({
                  nombre: '',
                  dni: '',
                  legajo: '',
                  rango: 'Bombero',
                  especialidades: [],
                  personalZona: false,
                  grupoSanguineo: '',
                  alergias: '',
                  contactoEmergencia: ''
                });
              }}
              className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de personal */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white">Personal Registrado</h3>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-neutral-400">≥6 hs</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-neutral-400">&lt;6 hs</span>
            </div>
          </div>
        </div>

        {personal.map((bombero) => (
          <div
            key={bombero.id}
            className={`bg-neutral-900 border rounded-xl p-4 ${
              bombero.estado === 'inactivo' 
                ? 'border-neutral-800 opacity-50' 
                : 'border-neutral-800 hover:border-red-600'
            } transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <button
                onClick={() => setSelectedBombero(bombero)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-neutral-950 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div>
                    <h3 className="text-white">{bombero.nombre}</h3>
                    <p className="text-neutral-400 text-sm">
                      {bombero.rango} • Legajo #{bombero.legajo}
                    </p>
                  </div>
                </div>
              </button>
              
              <div className="flex items-center gap-2">
                {/* Badge de horas semanales */}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  cumpleHorasMinimas(bombero.horasSemanales)
                    ? 'bg-green-900 text-green-300'
                    : 'bg-red-900 text-red-300'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-medium">{bombero.horasSemanales}h</span>
                </div>

                {/* Estado */}
                <div className={`px-2 py-1 rounded-lg text-xs ${
                  bombero.estado === 'activo'
                    ? 'bg-neutral-800 text-neutral-300'
                    : 'bg-red-900 text-red-300'
                }`}>
                  {bombero.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm mb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-500" />
                <span className="text-neutral-300">{bombero.grupoSanguineo}</span>
              </div>
              {bombero.personalZona && (
                <>
                  <div className="text-neutral-600">•</div>
                  <div className="flex items-center gap-1 text-green-400">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">Zona</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {bombero.especialidades.map((esp: string) => (
                <span key={esp} className="bg-neutral-950 border border-neutral-700 text-neutral-400 px-2 py-1 rounded text-xs">
                  {esp}
                </span>
              ))}
            </div>

            {/* Acciones */}
            {bombero.estado === 'activo' && (
              <div className="flex items-center gap-2 pt-3 border-t border-neutral-800">
                <button
                  onClick={() => handleEditarBombero(bombero)}
                  className="flex-1 bg-amber-900 hover:bg-amber-800 text-amber-300 rounded-lg py-2 flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <Edit2 className="w-3 h-3" />
                  Editar
                </button>
                <button
                  onClick={() => handleDarDeBaja(bombero)}
                  className="flex-1 bg-red-900 hover:bg-red-800 text-red-300 rounded-lg py-2 flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <UserX className="w-3 h-3" />
                  Dar de Baja
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
