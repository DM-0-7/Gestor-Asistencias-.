// ============================================================
// exportService.js - FUNCIÓN ACTUALIZADA PARA CÁRDEX
// ============================================================

import * as XLSX from 'xlsx';

export const exportService = {
  exportToExcel: (attendances, courseName) => {
    if (!attendances || attendances.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    const worksheetData = [
      [
        'Número de empleado',
        'Nombre del empleado',
        'Puesto',
        'Dependencia',
        'Dirección',
        'Departamento',
        'Asistencias',
        'Nombre de jefe inmediato',
        'Puesto del jefe inmediato',
        'Fecha de evaluación',
        'Fecha',
        'Hora Entrada',
        'Hora Salida',
        'Duración',
        'Estado'
      ],
      ...attendances.map(att => {
        const duration = calculateDuration(att.checkInTime, att.checkOutTime);

        const estado =
          att.status === 'LATE'
            ? 'Tarde'
            : att.status === 'PRESENT'
            ? 'A tiempo'
            : att.status === 'INCOMPLETE'
            ? 'En curso'
            : att.status || '';

        return [
          '',
          att.user?.name || `Usuario ${att.userId}`,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          formatDate(att.checkInTime),
          formatTime(att.checkInTime),
          att.checkOutTime ? formatTime(att.checkOutTime) : 'En curso',
          duration,
          estado
        ];
      })
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    ws['!cols'] = [
      { wch: 18 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 12 },
      { wch: 25 },
      { wch: 25 },
      { wch: 18 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cárdex Asistencias');
    XLSX.writeFile(
      wb,
      `Cardex_Asistencias_${courseName}_${formatDate(new Date())}.xlsx`
    );
  },

  exportToCSV: (attendances, courseName) => {
    if (!attendances || attendances.length === 0) {
      return;
    }

    const headers = [
      'Número de empleado',
      'Nombre del empleado',
      'Puesto',
      'Dependencia',
      'Dirección',
      'Departamento',
      'Asistencias',
      'Nombre de jefe inmediato',
      'Puesto del jefe inmediato',
      'Fecha de evaluación',
      'Fecha',
      'Hora Entrada',
      'Hora Salida',
      'Duración',
      'Estado'
    ];

    const rows = attendances.map(att => {
      const estado =
        att.status === 'LATE'
          ? 'Tarde'
          : att.status === 'PRESENT'
          ? 'A tiempo'
          : att.status === 'INCOMPLETE'
          ? 'En curso'
          : att.status || '';

      return [
        '',
        att.user?.name || `Usuario ${att.userId}`,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        formatDate(att.checkInTime),
        formatTime(att.checkInTime),
        att.checkOutTime ? formatTime(att.checkOutTime) : 'En curso',
        calculateDuration(att.checkInTime, att.checkOutTime),
        estado
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row
          .map(cell => {
            const value = cell ?? '';
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cardex_Asistencias_${courseName}_${formatDate(new Date())}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
};

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

function calculateDuration(checkInTime, checkOutTime) {
  if (!checkInTime || !checkOutTime) {
    return 'En curso';
  }

  if (checkOutTime === null || checkOutTime === 'null') {
    return 'En curso';
  }

  try {
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);

    const checkInMs = checkIn.getTime();
    const checkOutMs = checkOut.getTime();

    if (isNaN(checkInMs) || isNaN(checkOutMs)) {
      console.warn(' Fechas inválidas:', { checkInTime, checkOutTime });
      return 'Fecha inválida';
    }

    const diffMs = checkOutMs - checkInMs;

    if (diffMs < 0) {
      console.warn(' Check-out antes de check-in:', { checkInTime, checkOutTime });
      return 'Error';
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error(' Error calculando duración:', error);
    return 'Error';
  }
}

function formatTime(timestamp) {
  if (!timestamp) return '';

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Hora inválida';

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
}

function formatDate(timestamp) {
  if (!timestamp) return '';

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Fecha inválida';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
}
