/**
 * Utilidades de Fecha y Hora para Argentina (UTC-3)
 * Zona horaria: America/Argentina/Buenos_Aires
 * Fecha de referencia: Domingo 04/01/2026 (UTC-3)
 */

/**
 * Obtiene la fecha y hora actual en Argentina (UTC-3)
 * CORREGIDO: Argentina es UTC-3 (3 horas MENOS que UTC)
 */
export function obtenerFechaArgentina(): Date {
  // Opción 1: Usar directamente la API de zona horaria
  const fechaLocal = new Date();
  const fechaArgentina = new Date(fechaLocal.toLocaleString('en-US', { 
    timeZone: 'America/Argentina/Buenos_Aires' 
  }));
  return fechaArgentina;
}

/**
 * Convierte una fecha ISO a zona horaria argentina
 */
export function convertirAArgentina(isoString: string): Date {
  const fecha = new Date(isoString);
  const fechaArgentina = new Date(fecha.toLocaleString('en-US', { 
    timeZone: 'America/Argentina/Buenos_Aires' 
  }));
  return fechaArgentina;
}

/**
 * Obtiene la fecha actual en formato ISO en zona horaria argentina
 * IMPORTANTE: Retorna la hora LOCAL de Argentina, no UTC
 */
export function obtenerISO_Argentina(): string {
  const ahora = new Date();
  // Convertir a string en zona horaria argentina
  const fechaArgString = ahora.toLocaleString('en-US', { 
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // Parsear y crear ISO string
  const partes = fechaArgString.match(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/);
  if (partes) {
    const [_, mes, dia, año, hora, min, seg] = partes;
    return `${año}-${mes}-${dia}T${hora}:${min}:${seg}-03:00`;
  }
  
  return ahora.toISOString();
}

/**
 * Obtiene solo la fecha (YYYY-MM-DD) en zona horaria argentina
 */
export function obtenerFechaSoloArgentina(): string {
  const fechaArg = obtenerFechaArgentina();
  const year = fechaArg.getFullYear();
  const month = String(fechaArg.getMonth() + 1).padStart(2, '0');
  const day = String(fechaArg.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha ISO a formato argentino legible
 */
export function formatearFechaArgentina(isoString: string, options?: Intl.DateTimeFormatOptions): string {
  const fecha = new Date(isoString);
  return fecha.toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    ...options
  });
}

/**
 * Formatea una hora ISO a formato argentino (HH:MM)
 * CORREGIDO: Usa la zona horaria de Argentina
 */
export function formatearHoraArgentina(isoString: string, options?: Intl.DateTimeFormatOptions): string {
  const fecha = new Date(isoString);
  return fecha.toLocaleTimeString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options
  });
}

/**
 * Formatea fecha y hora completa en formato argentino
 */
export function formatearFechaHoraArgentina(isoString: string): string {
  const fecha = new Date(isoString);
  return fecha.toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Obtiene la hora actual en formato HH:MM (Argentina)
 */
export function obtenerHoraActualArgentina(): string {
  const ahora = new Date();
  return ahora.toLocaleTimeString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Obtiene el año actual en Argentina
 */
export function obtenerAñoArgentina(): number {
  return obtenerFechaArgentina().getFullYear();
}

/**
 * Calcula la diferencia en días entre dos fechas (considerando zona horaria argentina)
 */
export function calcularDiferenciaDias(fecha1: string | Date, fecha2?: string | Date): number {
  const f1 = typeof fecha1 === 'string' ? convertirAArgentina(fecha1) : fecha1;
  const f2 = fecha2 
    ? (typeof fecha2 === 'string' ? convertirAArgentina(fecha2) : fecha2)
    : obtenerFechaArgentina();
  
  const diff = Math.ceil((f1.getTime() - f2.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

/**
 * Verifica si una fecha es hoy (en zona horaria argentina)
 */
export function esHoy(fechaISO: string): boolean {
  const fechaDada = fechaISO.split('T')[0];
  const hoy = obtenerFechaSoloArgentina();
  return fechaDada === hoy;
}

/**
 * Obtiene la fecha de inicio del día actual en Argentina
 */
export function obtenerInicioDiaArgentina(): Date {
  const fechaArg = obtenerFechaArgentina();
  fechaArg.setHours(0, 0, 0, 0);
  return fechaArg;
}

/**
 * Obtiene la fecha de fin del día actual en Argentina
 */
export function obtenerFinDiaArgentina(): Date {
  const fechaArg = obtenerFechaArgentina();
  fechaArg.setHours(23, 59, 59, 999);
  return fechaArg;
}
