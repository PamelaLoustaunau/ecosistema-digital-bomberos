import React, { useState, useEffect } from "react";
import { Login } from "./components/auth/Login";
import { DashboardBombero } from "./components/dashboard/DashboardBombero";
import { DashboardAdmin } from "./components/dashboard/DashboardAdmin";
import { AlertaEmergencia } from "./components/emergencias/AlertaEmergencia";
import { obtenerISO_Argentina } from "./utils/fecha-argentina";

type UserRole = "admin" | "bombero" | null;

interface User {
  id: string;
  nombre: string;
  rol: "admin" | "bombero";
  esChofer: boolean;
}

// Claves de localStorage
const STORAGE_KEYS = {
  EMERGENCIAS: "bomberos_emergencias",
  EMERGENCIA_ACTIVA: "bomberos_emergencia_activa",
  GUARDIAS: "bomberos_guardias",
  HORAS_SEMANALES: "bomberos_horas_semanales",
  CURRENT_USER_ID: "bomberos_current_user_id",
  CURRENT_USER_ROL: "bomberos_current_user_rol",
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [showAlert, setShowAlert] = useState(false);

  // Estado con persistencia en localStorage
  const [alertData, setAlertData] = useState<any>(() => {
    const saved = localStorage.getItem(
      STORAGE_KEYS.EMERGENCIA_ACTIVA,
    );
    return saved ? JSON.parse(saved) : null;
  });

  const [emergenciasDelDia, setEmergenciasDelDia] = useState<
    any[]
  >(() => {
    const saved = localStorage.getItem(
      STORAGE_KEYS.EMERGENCIAS,
    );
    return saved ? JSON.parse(saved) : [];
  });

  const [horasSemanales, setHorasSemanales] = useState(() => {
    const saved = localStorage.getItem(
      STORAGE_KEYS.HORAS_SEMANALES,
    );
    return saved ? parseInt(saved) : 8;
  });

  const [guardias, setGuardias] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GUARDIAS);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            fecha: "2026-01-03",
            inicio: "18:00",
            fin: "00:00",
            tipo: "Cuartel",
            estado: "programada",
          },
          {
            id: 2,
            fecha: "2026-01-05",
            inicio: "08:00",
            fin: "14:00",
            tipo: "Disponibilidad",
            estado: "programada",
          },
          {
            id: 3,
            fecha: "2025-12-30",
            inicio: "12:00",
            fin: "18:00",
            tipo: "Cuartel",
            estado: "completada",
          },
          {
            id: 4,
            fecha: "2025-12-28",
            inicio: "20:00",
            fin: "02:00",
            tipo: "Zona",
            estado: "completada",
          },
        ];
  });

  // Sincronizar con localStorage cada vez que cambie el estado
  useEffect(() => {
    if (alertData) {
      localStorage.setItem(
        STORAGE_KEYS.EMERGENCIA_ACTIVA,
        JSON.stringify(alertData),
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.EMERGENCIA_ACTIVA);
    }
  }, [alertData]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.EMERGENCIAS,
      JSON.stringify(emergenciasDelDia),
    );
  }, [emergenciasDelDia]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.GUARDIAS,
      JSON.stringify(guardias),
    );
  }, [guardias]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.HORAS_SEMANALES,
      horasSemanales.toString(),
    );
  }, [horasSemanales]);

  // Persistir usuario actual en localStorage para registros de auditoría
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROL, currentUser.rol);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ROL);
    }
  }, [currentUser]);

  // Función para disparar alerta de emergencia
  const dispararAlerta = (emergencia: any) => {
    // Agregar ID único y timestamp si no existe
    const emergenciaConId = {
      ...emergencia,
      id: emergencia.id || `EMG-${Date.now()}`,
      timestamp: emergencia.timestamp || obtenerISO_Argentina(),
    };

    setAlertData(emergenciaConId);
    setShowAlert(true);

    // Agregar a la lista de emergencias del día
    setEmergenciasDelDia((prev) => {
      const nueva = [...prev, emergenciaConId];
      return nueva;
    });
  };

  // Función para completar informe de emergencia y FINALIZAR
  const completarInforme = (
    emergenciaId: string,
    informe: any,
  ) => {
    setEmergenciasDelDia((prev) =>
      prev.map((e) =>
        e.id === emergenciaId
          ? {
              ...e,
              informe,
              estado: "finalizada",
              informeBorrador: null,
            }
          : e,
      ),
    );

    // Si la emergencia finalizada es la activa, LIMPIAR COMPLETAMENTE
    if (alertData && alertData.id === emergenciaId) {
      setAlertData(null);
      setShowAlert(false);
      // Limpiar localStorage de emergencia activa
      localStorage.removeItem(STORAGE_KEYS.EMERGENCIA_ACTIVA);
    }
  };

  // Función para guardar borrador de informe
  const guardarBorrador = (
    emergenciaId: string,
    borrador: any,
  ) => {
    // Actualizar emergencias
    const emergenciasActualizadas = emergenciasDelDia.map(
      (e) =>
        e.id === emergenciaId
          ? { ...e, informeBorrador: borrador }
          : e,
    );
    setEmergenciasDelDia(emergenciasActualizadas);

    // Si es la emergencia activa, actualizar también alertData
    if (alertData && alertData.id === emergenciaId) {
      const alertActualizada = {
        ...alertData,
        informeBorrador: borrador,
      };
      setAlertData(alertActualizada);
    }
  };

  // Función para agregar una nueva guardia y actualizar horas
  const agregarGuardia = (guardia: any) => {
    // Generar ID único
    const guardiaConId = {
      ...guardia,
      id: Date.now(),
      estado: "programada",
    };

    // Calcular horas de la guardia
    const horasGuardia = calcularHorasGuardia(
      guardia.inicio,
      guardia.fin,
    );
    setHorasSemanales((prev) => prev + horasGuardia);
    setGuardias((prev) => [...prev, guardiaConId]);
  };

  // Función para editar una guardia existente
  const editarGuardia = (
    guardiaId: number,
    guardiaActualizada: any,
  ) => {
    // Encontrar la guardia original para recalcular horas
    const guardiaOriginal = guardias.find(
      (g) => g.id === guardiaId,
    );

    if (guardiaOriginal) {
      // Restar las horas de la guardia original
      const horasOriginales = calcularHorasGuardia(
        guardiaOriginal.inicio,
        guardiaOriginal.fin,
      );
      // Sumar las horas de la guardia actualizada
      const horasNuevas = calcularHorasGuardia(
        guardiaActualizada.inicio,
        guardiaActualizada.fin,
      );

      setHorasSemanales(
        (prev) => prev - horasOriginales + horasNuevas,
      );
    }

    // Actualizar la guardia en el array
    setGuardias((prev) =>
      prev.map((g) =>
        g.id === guardiaId
          ? { ...g, ...guardiaActualizada }
          : g,
      ),
    );
  };

  // Calcular horas entre dos tiempos (formato HH:MM)
  const calcularHorasGuardia = (
    inicio: string,
    fin: string,
  ): number => {
    if (!inicio || !fin) return 0;

    const [horaInicio, minInicio] = inicio
      .split(":")
      .map(Number);
    const [horaFin, minFin] = fin.split(":").map(Number);

    let totalMinutos =
      horaFin * 60 + minFin - (horaInicio * 60 + minInicio);

    // Si el fin es menor que el inicio, la guardia cruza medianoche
    if (totalMinutos < 0) {
      totalMinutos += 24 * 60;
    }

    return totalMinutos / 60;
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // NO limpiar datos al hacer login - persistencia total
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAlert(false);
    // NO limpiar localStorage al hacer logout - los datos persisten
  };

  const handleAlertResponse = (
    response: "voy" | "no_puedo",
  ) => {
    console.log("Respuesta a emergencia:", response);
    setShowAlert(false);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {showAlert && (
        <AlertaEmergencia
          alerta={alertData}
          onResponse={handleAlertResponse}
        />
      )}

      {currentUser.rol === "admin" ? (
        <DashboardAdmin
          user={currentUser}
          onLogout={handleLogout}
          emergenciaActiva={alertData}
          emergenciasFinalizadas={emergenciasDelDia.filter(
            (e) => e.informe,
          )}
          emergenciasDelDia={emergenciasDelDia}
          onGuardarBorrador={guardarBorrador}
          onNuevaEmergencia={dispararAlerta}
          onCompletarInforme={completarInforme}
          horasSemanales={horasSemanales}
          onAgregarGuardia={agregarGuardia}
          onEditarGuardia={editarGuardia}
          guardias={guardias}
        />
      ) : (
        <DashboardBombero
          user={currentUser}
          onLogout={handleLogout}
          onNuevaEmergencia={dispararAlerta}
          emergenciaActiva={alertData}
          emergenciasDelDia={emergenciasDelDia}
          onCompletarInforme={completarInforme}
          onGuardarBorrador={guardarBorrador}
          horasSemanales={horasSemanales}
          onAgregarGuardia={agregarGuardia}
          onEditarGuardia={editarGuardia}
          guardias={guardias}
        />
      )}
    </div>
  );
}