import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardCheck, 
  Package, 
  BookOpen,
  LogOut,
  Flame,
  User,
  AlertTriangle,
  Map,
  FileText,
  Bell
} from 'lucide-react';
import { InicioGuardia } from './bombero/InicioGuardia';
import { MiPerfil } from './bombero/MiPerfil';
import { CalendarioGuardias } from './bombero/CalendarioGuardias';
import { InventarioCuartel } from './bombero/InventarioCuartel';
import { InventarioTurno } from './bombero/InventarioTurno';
import { NuevaEmergencia } from '../emergencias/NuevaEmergencia';
import { BibliotecaProtocolos } from '../protocolos/BibliotecaProtocolos';
import { MapaOperativo } from '../mapa/MapaOperativo';
import { HistorialIncidentes } from '../incidentes/HistorialIncidentes';
import { EmergenciasDelDia } from '../emergencias/EmergenciasDelDia';

interface DashboardBomberoProps {
  user: any;
  onLogout: () => void;
  onNuevaEmergencia: (emergencia: any) => void;
  emergenciaActiva?: any;
  emergenciasDelDia: any[];
  onCompletarInforme: (emergenciaId: string, informe: any) => void;
  onGuardarBorrador: (emergenciaId: string, borrador: any) => void;
  horasSemanales: number;
  onAgregarGuardia: (guardia: any) => void;
  onEditarGuardia: (guardiaId: number, guardia: any) => void;
  guardias: any[];
}

type TabBombero = 'inicio' | 'emergencias' | 'mapa' | 'guardias' | 'inventario' | 'epp' | 'historial' | 'perfil';

export function DashboardBombero({ user, onLogout, onNuevaEmergencia, emergenciaActiva, emergenciasDelDia, onCompletarInforme, onGuardarBorrador, horasSemanales, onAgregarGuardia, onEditarGuardia, guardias }: DashboardBomberoProps) {
  const [activeTab, setActiveTab] = useState<TabBombero>('inicio');
  const [showNuevaEmergencia, setShowNuevaEmergencia] = useState(false);
  const [showProtocolos, setShowProtocolos] = useState(false);

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
    { id: 'emergencias', label: 'Emergencias', icon: Bell },
    { id: 'mapa', label: 'Mapa', icon: Map },
    { id: 'guardias', label: 'Guardias', icon: Calendar },
    { id: 'inventario', label: 'Inventario', icon: ClipboardCheck },
    { id: 'epp', label: 'EPP', icon: Package },
    { id: 'historial', label: 'Historial', icon: FileText },
  ];

  const handleSubmitEmergencia = (emergencia: any) => {
    setShowNuevaEmergencia(false);
    onNuevaEmergencia(emergencia);
    // Navegar automáticamente a la pestaña de emergencias
    setActiveTab('emergencias');
  };

  const emergenciasPendientes = emergenciasDelDia.filter(e => !e.informe).length;

  // Encontrar emergencias con unidades despachadas (para el mapa)
  const emergenciaEnRuta = emergenciasDelDia.find(e => 
    !e.informe && e.informeBorrador?.unidadesUtilizadas?.length > 0
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Formulario de Nueva Emergencia */}
      {showNuevaEmergencia && (
        <NuevaEmergencia
          onClose={() => setShowNuevaEmergencia(false)}
          onSubmit={handleSubmitEmergencia}
        />
      )}

      {/* Biblioteca de Protocolos */}
      {showProtocolos && (
        <BibliotecaProtocolos
          onClose={() => setShowProtocolos(false)}
        />
      )}

      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white">{user.nombre}</h3>
              <p className="text-neutral-400 text-sm">Bombero Operativo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProtocolos(true)}
              className="text-neutral-400 hover:text-white p-2"
              title="Protocolos"
            >
              <BookOpen className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('perfil')}
              className="text-neutral-400 hover:text-white p-2"
              title="Mi Perfil"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="text-neutral-400 hover:text-white p-2"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-auto pb-32">
        {activeTab === 'inicio' && (
          <InicioGuardia 
            user={user} 
            horasSemanales={horasSemanales}
            guardias={guardias}
            onNavigateToChecklist={() => setActiveTab('inventario')}
            onNavigateToGuardias={() => setActiveTab('guardias')}
          />
        )}
        {activeTab === 'perfil' && <MiPerfil user={user} />}
        {activeTab === 'emergencias' && (
          <EmergenciasDelDia 
            emergencias={emergenciasDelDia}
            onCompletarInforme={onCompletarInforme}
            onGuardarBorrador={onGuardarBorrador}
          />
        )}
        {activeTab === 'mapa' && <MapaOperativo emergenciaActiva={emergenciaEnRuta} emergenciasDelDia={emergenciasDelDia} onClose={() => setActiveTab('inicio')} />}
        {activeTab === 'guardias' && (
          <CalendarioGuardias 
            user={user} 
            guardias={guardias}
            onAgregarGuardia={onAgregarGuardia} 
            onEditarGuardia={onEditarGuardia}
            onNavigateToHistorial={() => setActiveTab('inicio')} 
          />
        )}
        {activeTab === 'inventario' && <InventarioCuartel user={user} onNavigateToInicio={() => setActiveTab('inicio')} />}
        {activeTab === 'epp' && <InventarioTurno user={user} />}
        {activeTab === 'historial' && (
          <HistorialIncidentes 
            emergenciasFinalizadas={emergenciasDelDia.filter(e => e.informe)}
          />
        )}
      </div>

      {/* Botón Flotante de Nueva Emergencia */}
      <button
        onClick={() => setShowNuevaEmergencia(true)}
        className="fixed bottom-32 right-6 z-50 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl shadow-red-900/50 flex items-center gap-3 transition-all hover:scale-105 animate-pulse"
      >
        <AlertTriangle className="w-6 h-6" />
        <span className="pr-2">NUEVA EMERGENCIA</span>
      </button>

      {/* Navegación */}
      <div className="bg-neutral-900 border-t border-neutral-800 fixed bottom-0 left-0 right-0 z-40">
        <div className="grid grid-cols-4 gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasPendientes = tab.id === 'emergencias' && emergenciasPendientes > 0;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabBombero)}
                className={`relative flex flex-col items-center gap-1 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
                {hasPendientes && (
                  <div className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {emergenciasPendientes}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}