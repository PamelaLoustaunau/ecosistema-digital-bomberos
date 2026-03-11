import React, { useState } from 'react';
import { Shield, Flame, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

// Escalafón oficial de Bomberos Voluntarios Argentina
const escalafon = {
  oficialSuperior: ['Comandante General'],
  oficialJefe: ['Comandante Mayor', 'Comandante', 'Sub-Comandante'],
  oficialSubalterno: ['Oficial Principal', 'Oficial Inspector', 'Oficial Ayudante'],
  suboficial: ['Suboficial Mayor', 'Suboficial Principal', 'Sargento Primero', 'Sargento'],
  tropa: ['Cabo Primero', 'Cabo', 'Bombero']
};

// Base de datos de usuarios (en producción vendría de Supabase)
const usuariosRegistrados = [
  { 
    id: '1', 
    legajo: '001', 
    dni: '30123456',
    nombre: 'Carlos Méndez', 
    rango: 'Comandante',
    especialidades: ['Chofer', 'Incendio'],
    personalZona: false,
    estado: 'activo',
    fechaIngreso: '2010-03-15',
    horasSemanales: 8
  },
  { 
    id: '2', 
    legajo: '101', 
    dni: '35456789',
    nombre: 'Juan Pérez', 
    rango: 'Cabo Primero',
    especialidades: ['Chofer', 'Rescate'],
    personalZona: false,
    estado: 'activo',
    fechaIngreso: '2018-06-20',
    horasSemanales: 6
  },
  { 
    id: '3', 
    legajo: '102', 
    dni: '33987654',
    nombre: 'María González', 
    rango: 'Bombero',
    especialidades: ['Rescate'],
    personalZona: true,
    estado: 'activo',
    fechaIngreso: '2020-01-10',
    horasSemanales: 4
  },
  { 
    id: '4', 
    legajo: '050', 
    dni: '28765432',
    nombre: 'Roberto Silva', 
    rango: 'Oficial Principal',
    especialidades: ['Incendio', 'Rescate'],
    personalZona: false,
    estado: 'activo',
    fechaIngreso: '2012-09-05',
    horasSemanales: 10
  },
];

export function Login({ onLogin }: LoginProps) {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [primerIngreso, setPrimerIngreso] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  // Determina si el rango tiene acceso administrativo
  const esAdministrador = (rango: string): boolean => {
    return escalafon.oficialSuperior.includes(rango) || 
           escalafon.oficialJefe.includes(rango);
  };

  const handleLogin = () => {
    setError('');

    // Buscar usuario por legajo
    const usuario = usuariosRegistrados.find(u => u.legajo === legajo);

    if (!usuario) {
      setError('Legajo no encontrado en el sistema');
      return;
    }

    if (usuario.estado !== 'activo') {
      setError('Usuario inactivo. Contacte al administrador');
      return;
    }

    // Verificar contraseña
    // Primera vez: DNI por defecto
    if (password === usuario.dni) {
      if (!primerIngreso) {
        // Solicitar cambio de contraseña en primer ingreso
        setPrimerIngreso(true);
        return;
      }
    } else {
      // En producción, aquí se verificaría el hash de la contraseña
      if (password !== 'demo123') {
        setError('Contraseña incorrecta');
        return;
      }
    }

    // Crear objeto de usuario con rol determinado por jerarquía
    const userSession = {
      ...usuario,
      rol: esAdministrador(usuario.rango) ? 'admin' : 'bombero',
      esChofer: usuario.especialidades.includes('Chofer')
    };

    onLogin(userSession);
  };

  const handleCambiarPassword = () => {
    if (nuevaPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // En producción, aquí se actualizaría la contraseña en la BD
    setError('');
    setPrimerIngreso(false);
    setPassword(nuevaPassword);
    handleLogin();
  };

  // Pantalla de cambio de contraseña (primer ingreso)
  if (primerIngreso) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-neutral-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 rounded-full mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-white mb-1">Primer Ingreso</h2>
              <p className="text-neutral-400 text-sm">Por seguridad, debes cambiar tu contraseña</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-neutral-300 mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="Repetir contraseña"
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-600"
                  onKeyPress={(e) => e.key === 'Enter' && handleCambiarPassword()}
                />
              </div>

              {error && (
                <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleCambiarPassword}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 transition-all"
              >
                Cambiar Contraseña
              </button>

              <button
                onClick={() => {
                  setPrimerIngreso(false);
                  setPassword('');
                  setNuevaPassword('');
                  setConfirmarPassword('');
                  setError('');
                }}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4">
            <Flame className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-white mb-2">Sistema Integral</h1>
          <p className="text-neutral-400">Cuartel de Bomberos Voluntarios</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-white mb-1">Acceso al Sistema</h2>
            <p className="text-neutral-400 text-sm">Ingresa tus credenciales</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-300 mb-2">Número de Legajo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  value={legajo}
                  onChange={(e) => setLegajo(e.target.value)}
                  placeholder="Ej: 001, 101"
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="DNI (primera vez) o contraseña"
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-red-600"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 transition-all font-medium"
            >
              Ingresar al Sistema
            </button>
          </div>

          <div className="mt-6 p-4 bg-neutral-950 rounded-lg border border-neutral-800">
            <p className="text-neutral-400 text-xs mb-2">💡 Demo - Credenciales de prueba:</p>
            <div className="space-y-1">
              <p className="text-neutral-300 text-sm">
                <span className="text-neutral-500">Jefe:</span> Legajo <code className="bg-neutral-900 px-2 py-1 rounded">001</code> / Pass <code className="bg-neutral-900 px-2 py-1 rounded">demo123</code>
              </p>
              <p className="text-neutral-300 text-sm">
                <span className="text-neutral-500">Bombero:</span> Legajo <code className="bg-neutral-900 px-2 py-1 rounded">101</code> / Pass <code className="bg-neutral-900 px-2 py-1 rounded">demo123</code>
              </p>
              <p className="text-amber-300 text-xs mt-2">
                Primera vez: usar DNI como contraseña
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm">v1.0.0 - Sistema de Gestión Operativa</p>
        </div>
      </div>
    </div>
  );
}
