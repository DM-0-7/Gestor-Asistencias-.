import { useMemo, useCallback } from 'react';
import { message } from 'antd';
import { exportService } from '../services/exportService';

export const useExportHandlers = (attendances, courseName) => {
  const handleExport = useCallback((format) => {
    if (attendances.length === 0) {
      message.warning(' No hay datos para exportar');
      return;
    }

    try {
      if (format === 'excel') {
        exportService.exportToExcel(attendances, courseName || 'Curso');
        message.success(' Excel descargado exitosamente');
      } else if (format === 'csv') {
        exportService.exportToCSV(attendances, courseName || 'Curso');
        message.success(' CSV descargado exitosamente');
      }
    } catch (error) {
      console.error('Error exportando:', error);
      message.error(' Error al exportar archivo');
    }
  }, [attendances, courseName]);

  const exportMenuItems = useMemo(() => [
    {
      key: 'excel',
      label: ' Exportar Excel (.xlsx)',
      onClick: () => handleExport('excel')
    },
    {
      key: 'csv',
      label: ' Exportar CSV',
      onClick: () => handleExport('csv')
    }
  ], [handleExport]);

  return { exportMenuItems };
};
