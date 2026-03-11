  # Ecosistema Digital Bomberos

> **Nota de Estado:** Este proyecto se encuentra actualmente en **fase activa de desarrollo**. El foco principal de las actualizaciones recientes es la optimización de la lógica de negocio y la preparación de la arquitectura para la integración con servicios de backend.

**Ecosistema Digital Bomberos** es una solución integral diseñada para digitalizar y optimizar la respuesta operativa de un cuartel. El sistema centraliza la coordinación de emergencias, la gestión de personal y el monitoreo de unidades en una interfaz moderna, diseñada específicamente para facilitar la **toma de decisiones bajo presión**.

---

## El Desafío del Proyecto

Este sistema nace de la necesidad de reemplazar los métodos de registro manuales. El objetivo es resolver la fragmentación de la información, permitiendo que tanto el cuerpo activo como la administración trabajen sobre una **única fuente de verdad** para la gestión de incidentes y recursos críticos.

---

## Stack Tecnológico 

* **React 18 y Vite:** Se seleccionó esta combinación para garantizar una **Single Page Application (SPA)** de alto rendimiento, con tiempos de respuesta inmediatos y un empaquetado optimizado para producción.
* **TypeScript:** Implementado con un **tipado estricto** de interfaces para modelos de datos complejos (Incidentes, Personal, Unidades), lo que reduce drásticamente los errores en tiempo de ejecución y mejora la mantenibilidad.
* **Tailwind CSS y Shadcn UI:** Arquitectura de componentes basada en **Radix UI** para asegurar accesibilidad y modularidad. Se priorizó un diseño de alta visibilidad para entornos operativos nocturnos.
* **Lucide React:** Gestión de iconografía vectorial técnica.
* **Persistencia Local:** Implementación de manejo de estados mediante **localStorage** para asegurar la **resiliencia de datos** ante cierres accidentales o recargas del navegador durante la gestión de una emergencia activa.

---

## Arquitectura y Estructura


El sistema implementa una arquitectura basada en componentes y módulos de dominio, garantizando un código limpio y mantenible:

  ### Núcleo y Sesión
* **auth/**: Control de acceso y flujo de autenticación basado en **roles de usuario**.
* **dashboard/**: Vistas principales diferenciadas para el perfil de Administrador y Bombero.

  ### Módulos Operativos
* **emergencias/**: Módulo crítico de alertas, despacho y seguimiento de incidentes en tiempo real.
* **mapa/**: Visualización geoespacial de siniestros y posicionamiento de unidades.
* **incidentes/**: Gestión de historial, archivo y documentación de actuaciones pasadas.
* **protocolos/**: Repositorio digital de procedimientos estandarizados de actuación.

  ### Administración y Gestión
* **admin/**: Gestión de personal, flota de vehículos y reportes estadísticos oficiales **RUBA**.
* **bombero/**: Control de guardias, gestión de perfil e inventario personal.
* **ui/**: Biblioteca de componentes reutilizables con estilos desacoplados.
* **utils/**: Lógica transversal para el procesamiento de datos y constantes del sistema.

---

## Funcionalidades Destacadas

1. **Seguridad por Roles:** Permisos granulares que separan estrictamente la gestión operativa de la administrativa.
2. **Ciclo de Vida de Emergencia:** Flujo integral que abarca desde el disparo de la alerta inicial hasta la confección del informe final.
3. **Monitoreo de Unidades:** Control de estado operativo y cronograma de mantenimiento de la flota.
4. **Gestión de Guardias e Inventarios:** Registro de novedades y control de suministros por turno.
5. **Generación de Reportes:** Módulo preparado para estadísticas operativas.
6. **Persistencia Local:** Sincronización automática de datos para evitar pérdida de información en el cliente.

---

## Roadmap y Plan de Desarrollo

El proyecto avanza hacia una arquitectura **Full-Stack** con los siguientes objetivos:

* **Infraestructura:** Contenerización de la aplicación mediante **Docker**.
* **Backend:** Migración de la lógica de persistencia hacia una **API REST** con base de datos **PostgreSQL**.
* **Geolocalización:** Integración de seguimiento GPS para unidades en tiempo real.
* **Performance:** Refactorización de componentes para optimizar el renderizado en dispositivos móviles de recursos limitados.

---


## Instalación

1. Clonar el repositorio.
2. Instalar dependencias:
```bash
npm install

