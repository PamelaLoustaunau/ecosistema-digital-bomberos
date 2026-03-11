import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  ClipboardCheck, 
  GraduationCap, 
  BarChart3,
  LogOut,
  Flame,
  UserCheck,
  AlertCircle,
  Map,
  BookOpen,
  FileText,
  User
} from 'lucide-react';
import { TableroPrincipal } from './admin/TableroPrincipal';
import { GestionPersonal } from './admin/GestionPersonal';
import { EstadoUnidades } from './admin/EstadoUnidades';
import { ReportesRUBA } from './admin/ReportesRUBA';
import { NovedadesCuartel } from './admin/NovedadesCuartel';
import { TableroRespuestas } from '../emergencias/TableroRespuestas';
import { MapaOperativo } from '../mapa/MapaOperativo';
import { BibliotecaProtocolos } from '../protocolos/BibliotecaProtocolos';
import { HistorialIncidentes } from '../incidentes/HistorialIncidentes';
import { DashboardBombero } from './DashboardBombero';

interface DashboardAdminProps {
  user: any;
  onLogout: () => void;
  emergenciaActiva?: any;
  emergenciasFinalizadas?: any[];
  emergenciasDelDia?: any[];
  onGuardarBorrador?: (emergenciaId: string, borrador: any) => void;
  onNuevaEmergencia?: (emergencia: any) => void;
  onCompletarInforme?: (emergenciaId: string, informe: any) => void;
  horasSemanales?: number;
  onAgregarGuardia?: (guardia: any) => void;
  onEditarGuardia?: (guardiaId: number, guardia: any) => void;
  guardias?: any[];
}

type TabAdmin = 'inicio' | 'respuestas' | 'mapa' | 'historial' | 'personal' | 'unidades' | 'novedades' | 'reportes';

export function DashboardAdmin({ 
  user, 
  onLogout, 
  emergenciaActiva, 
  emergenciasFinalizadas = [], 
  emergenciasDelDia = [], 
  onGuardarBorrador,
  onNuevaEmergencia,
  onCompletarInforme,
  horasSemanales = 0,
  onAgregarGuardia,
  onEditarGuardia,
  guardias = []
}: DashboardAdminProps) {
  const [activeTab, setActiveTab] = useState<TabAdmin>('inicio');
  const [showProtocolos, setShowProtocolos] = useState(false);
  const [modoOperativo, setModoOperativo] = useState(false);

  // Si está en modo operativo, mostrar el dashboard de bombero
  if (modoOperativo) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Toggle para volver al modo admin */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white">{user.nombre}</h3>
                <p className="text-blue-300 text-sm">Modo Operativo (Vista Bombero)</p>
              </div>
            </div>
            <button
              onClick={() => setModoOperativo(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
            >
              Volver a Modo Jefe
            </button>
          </div>
        </div>
        
        <DashboardBombero 
          user={user} 
          onLogout={onLogout}
          onNuevaEmergencia={onNuevaEmergencia || (() => {})}
          emergenciaActiva={emergenciaActiva}
          emergenciasDelDia={emergenciasDelDia}
          onCompletarInforme={onCompletarInforme || (() => {})}
          onGuardarBorrador={onGuardarBorrador || (() => {})}
          horasSemanales={horasSemanales}
          onAgregarGuardia={onAgregarGuardia || (() => {})}
          onEditarGuardia={onEditarGuardia || (() => {})}
          guardias={guardias}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
    { id: 'respuestas', label: 'Respuestas', icon: UserCheck },
    { id: 'mapa', label: 'Mapa', icon: Map },
    { id: 'historial', label: 'Incidentes', icon: FileText },
    { id: 'personal', label: 'Personal', icon: Users },
    { id: 'unidades', label: 'Unidades', icon: Truck },
    { id: 'novedades', label: 'Novedades', icon: AlertCircle },
    { id: 'reportes', label: 'RUBA', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Biblioteca de Protocolos */}
      {showProtocolos && (
        <BibliotecaProtocolos
          onClose={() => setShowProtocolos(false)}
        />
      )}

      {/* Header con info del usuario */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white">{user.nombre}</h3>
              <p className="text-neutral-400 text-sm">Panel Administrativo</p>
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
              onClick={onLogout}
              className="text-neutral-400 hover:text-white p-2"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'inicio' && <TableroPrincipal emergenciasDelDia={emergenciasDelDia} onToggleModoOperativo={() => setModoOperativo(true)} />}
        {activeTab === 'respuestas' && <TableroRespuestas />}
        {activeTab === 'mapa' && <MapaOperativo emergenciaActiva={emergenciaActiva} emergenciasDelDia={emergenciasDelDia} onClose={() => setActiveTab('inicio')} />}
        {activeTab === 'historial' && (
          <HistorialIncidentes 
            emergenciasFinalizadas={emergenciasFinalizadas}
          />
        )}
        {activeTab === 'personal' && <GestionPersonal />}
        {activeTab === 'unidades' && <EstadoUnidades />}
        {activeTab === 'novedades' && <NovedadesCuartel />}
        {activeTab === 'reportes' && <ReportesRUBA />}
      </div>

      {/* Navegación inferior */}
      <div className="bg-neutral-900 border-t border-neutral-800">
        <div className="grid grid-cols-4 gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabAdmin)}
                className={`flex flex-col items-center gap-1 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}