@echo off
echo ========================================
echo Actualizando repositorio GitHub
echo ========================================

cd "C:\Users\D1EGO\OneDrive - UNIVERSIDAD INTERAMERICANA PARA EL DESARROLLO\Estadias\LMS"

echo.
echo [1/4] Verificando estado...
git status

echo.
echo [2/4] Agregando archivos...
git add .

echo.
echo [3/4] Haciendo commit...
git commit -m "Fix: Sistema de asistencias con boton tarde y actualizacion automatica - Implementado checkInLate en backend y frontend - Agregado boton Llego Tarde en AttendanceModal - Corregida actualizacion automatica de listas - Agregada validacion para prevenir check-ins duplicados - Agregados imports faltantes en AttendanceService"

echo.
echo [4/4] Subiendo a GitHub...
git push

echo.
echo ========================================
echo Proceso completado!
echo ========================================
pause
