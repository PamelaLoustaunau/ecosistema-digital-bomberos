import React, { useState } from 'react';
import { User, Droplet, Phone, Award, Calendar, Shield, Edit2, Save, Camera, Star, ClipboardCheck } from 'lucide-react';
import { MisInventarios } from './MisInventarios';

interface MiPerfilProps {
  user: any;
}

export function MiPerfil({ user }: MiPerfilProps) {
  const [editMode, setEditMode] = useState(false);
  const [fichaMedica, setFichaMedica] = useState({
    grupoSanguineo: user.esChofer ? 'O+' : 'A+',
    alergias: user.esChofer ? 'Ninguna' : 'Penicilina',
    medicacionCronica: '',
    contactoEmergenciaNombre: 'María Rodríguez',
    contactoEmergenciaTelefono: '+54 9 11 1234-5678',
    observacionesMedicas: 'Prótesis en rodilla izquierda. Apto para actividad física.'
  });

  const perfil = {
    nombre: user.nombre,
    legajo: user.esChofer ? '101' : '102',
    rango: 'Bombero 1ra',
    especialidad: user.esChofer ? 'Operador de Vehículos de Emergencia' : 'Rescate Urbano',
    fechaIngreso: '2022-03-15',
    esChofer: user.esChofer,
    certificaciones: [
      { nombre: 'RCP y Primeros Auxilios', fecha: '2025-06-15', vigencia: 'Vigente' },
      { nombre: 'Rescate Vehicular', fecha: '2025-08-20', vigencia: 'Vigente' },
      { nombre: 'Incendios Forestales', fecha: '2024-11-10', vigencia: 'Por Renovar' },
    ]
  };

  const handleSave = () => {
    // Aquí se guardaría la información en la base de datos
    setEditMode(false);
    alert('Ficha médica actualizada correctamente');
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Encabezado del perfil */}
      <div className="bg-gradient-to-br from-red-900 to-red-950 border border-red-800 rounded-xl p-6 text-center relative">
        {/* Foto de perfil */}
        <div className="relative inline-block mb-4">
          <div className="bg-red-800 w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4 border-red-700">
            <User className="w-12 h-12 text-white" />
          </div>
          <button className="absolute bottom-0 right-0 bg-neutral-800 hover:bg-neutral-700 p-2 rounded-full border-2 border-red-800 transition-all">
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>
        
        <h2 className="text-white mb-1">{perfil.nombre}</h2>
        <p className="text-red-200 mb-1">Legajo #{perfil.legajo}</p>
        
        {/* Rango y Especialidad */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="bg-red-800 px-3 py-1 rounded-full">
            <span className="text-red-200 text-sm">{perfil.rango}</span>
          </div>
        </div>
        
        <p className="text-red-300 text-sm mb-3">{perfil.especialidad}</p>
        
        {perfil.esChofer && (
          <div className="inline-block bg-blue-900 px-4 py-2 rounded-full">
            <span className="text-blue-300">🚒 Chofer Certificado</span>
          </div>
        )}
      </div>

      {/* Ficha Médica de Emergencia */}
      <div className="bg-red-950 border-2 border-red-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            <h3 className="text-red-200">Ficha Médica de Emergencia</h3>
          </div>
          <button
            onClick={() => editMode ? handleSave() : setEditMode(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              editMode 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-900 hover:bg-red-800 text-red-200'
            }`}
          >
            {editMode ? (
              <>
                <Save className="w-4 h-4" />
                <span className="text-sm">Guardar</span>
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">Editar</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {/* Grupo Sanguíneo */}
          <div className="bg-red-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Droplet className="w-4 h-4 text-red-300" />
              <span className="text-red-300 text-sm">Grupo Sanguíneo</span>
            </div>
            {editMode ? (
              <select
                value={fichaMedica.grupoSanguineo}
                onChange={(e) => setFichaMedica({ ...fichaMedica, grupoSanguineo: e.target.value })}
                className="w-full bg-red-950 border border-red-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            ) : (
              <p className="text-white text-2xl">{fichaMedica.grupoSanguineo}</p>
            )}
          </div>

          {/* Alergias */}
          <div className="bg-red-900 rounded-lg p-3">
            <span className="text-red-300 text-sm">Alergias</span>
            {editMode ? (
              <input
                type="text"
                value={fichaMedica.alergias}
                onChange={(e) => setFichaMedica({ ...fichaMedica, alergias: e.target.value })}
                className="w-full bg-red-950 border border-red-700 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-red-500"
                placeholder="Ej: Penicilina, maní, etc."
              />
            ) : (
              <p className="text-white mt-1">{fichaMedica.alergias}</p>
            )}
          </div>

          {/* Medicación Crónica */}
          <div className="bg-red-900 rounded-lg p-3">
            <span className="text-red-300 text-sm">Medicación Crónica</span>
            {editMode ? (
              <input
                type="text"
                value={fichaMedica.medicacionCronica}
                onChange={(e) => setFichaMedica({ ...fichaMedica, medicacionCronica: e.target.value })}
                className="w-full bg-red-950 border border-red-700 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-red-500"
                placeholder="Ej: Enalapril 10mg, etc."
              />
            ) : (
              <p className="text-white mt-1">{fichaMedica.medicacionCronica || 'Ninguna'}</p>
            )}
          </div>

          {/* Contacto de Emergencia */}
          <div className="bg-red-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-red-300" />
              <span className="text-red-300 text-sm">Contacto de Emergencia</span>
            </div>
            {editMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={fichaMedica.contactoEmergenciaNombre}
                  onChange={(e) => setFichaMedica({ ...fichaMedica, contactoEmergenciaNombre: e.target.value })}
                  className="w-full bg-red-950 border border-red-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  placeholder="Nombre completo"
                />
                <input
                  type="tel"
                  value={fichaMedica.contactoEmergenciaTelefono}
                  onChange={(e) => setFichaMedica({ ...fichaMedica, contactoEmergenciaTelefono: e.target.value })}
                  className="w-full bg-red-950 border border-red-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>
            ) : (
              <div>
                <p className="text-white">{fichaMedica.contactoEmergenciaNombre}</p>
                <div className="flex items-center gap-2 mt-2">
                  <a 
                    href={`tel:${fichaMedica.contactoEmergenciaTelefono}`} 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Llamar Ahora</span>
                  </a>
                  <span className="text-neutral-300 text-sm">{fichaMedica.contactoEmergenciaTelefono}</span>
                </div>
              </div>
            )}
          </div>

          {/* Observaciones Médicas Importantes */}
          <div className="bg-red-900 rounded-lg p-3">
            <span className="text-red-300 text-sm">Observaciones Médicas Importantes</span>
            {editMode ? (
              <textarea
                value={fichaMedica.observacionesMedicas}
                onChange={(e) => setFichaMedica({ ...fichaMedica, observacionesMedicas: e.target.value })}
                className="w-full bg-red-950 border border-red-700 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-red-500 min-h-[100px]"
                placeholder="Condiciones preexistentes, prótesis, cirugías recientes, etc."
              />
            ) : (
              <p className="text-white mt-1 whitespace-pre-wrap">{fichaMedica.observacionesMedicas || 'Ninguna'}</p>
            )}
          </div>
        </div>

        {editMode && (
          <div className="mt-4 bg-amber-900 border border-amber-700 rounded-lg p-3">
            <p className="text-amber-300 text-xs">
              ⚠️ Esta información es crítica para situaciones de emergencia. Asegúrate de mantenerla actualizada.
            </p>
          </div>
        )}
      </div>

      {/* Información General */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <h3 className="text-white mb-3">Información General</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-neutral-400">Fecha de Ingreso</span>
            <span className="text-white">
              {new Date(perfil.fechaIngreso).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-neutral-400">Años de Servicio</span>
            <span className="text-white">
              {new Date().getFullYear() - new Date(perfil.fechaIngreso).getFullYear()} años
            </span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-neutral-400">Rango</span>
            <span className="text-white">{perfil.rango}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Especialidad</span>
            <span className="text-white text-right">{perfil.especialidad}</span>
          </div>
        </div>
      </div>

      {/* Certificaciones */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-neutral-400" />
          <h3 className="text-white">Mis Certificaciones</h3>
        </div>

        <div className="space-y-3">
          {perfil.certificaciones.map((cert, idx) => (
            <div
              key={idx}
              className={`border rounded-lg p-3 ${
                cert.vigencia === 'Vigente'
                  ? 'bg-green-950 border-green-800'
                  : 'bg-amber-950 border-amber-800'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white">{cert.nombre}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  cert.vigencia === 'Vigente'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-amber-900 text-amber-300'
                }`}>
                  {cert.vigencia}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-300">
                  Obtenido: {new Date(cert.fecha).toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mis Inventarios */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardCheck className="w-5 h-5 text-neutral-400" />
          <h3 className="text-white">Historial de Inventarios</h3>
        </div>

        <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all">
          <ClipboardCheck className="w-5 h-5" />
          <span>Ver Mis Inventarios</span>
        </button>

        <p className="text-neutral-400 text-xs mt-2 text-center">
          Próximamente: acceso a historial completo de inventarios realizados
        </p>
      </div>
    </div>
  );
}