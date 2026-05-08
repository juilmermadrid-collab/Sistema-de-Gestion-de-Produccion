import api from './axiosConfig';

// 📥 Obtener tareas de la planilla activa
// Rutas Backend: GET /api/registros/tareas?selladoraId=...&turno=...
export const getTareasPlanilla = (params) => 
  api.get('/registros/tareas', { params });

// 📥 Obtener registros activos del operario actual
// Rutas Backend: GET /api/registros/en-curso
export const getRegistrosEnCurso = () => 
  api.get('/registros/en-curso');

// 📤 Iniciar un nuevo rollo (Crear registro)
// Rutas Backend: POST /api/registros/iniciar
export const iniciarRegistro = (data) => 
  api.post('/registros/iniciar', data);

// 📤 Finalizar un registro (Cerrar rollo y meter cantidad)
// Rutas Backend: POST /api/registros/finalizar
export const finalizarRegistro = (data) => 
  api.post('/registros/finalizar', data);