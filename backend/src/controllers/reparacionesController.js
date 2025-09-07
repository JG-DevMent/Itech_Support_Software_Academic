const reparacionesModel = require('../models/reparacionesModel');
const clientesModel = require('../models/clientesModel');
const { notificarCambioEstado } = require('../services/emailService');
const pool = require('../db');

exports.listarReparaciones = async (req, res) => {
  try {
    const reparaciones = await reparacionesModel.obtenerTodas();
    res.json(reparaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reparaciones' });
  }
};

exports.obtenerReparacionPorId = async (req, res) => {
  try {
    const reparacion = await reparacionesModel.obtenerPorId(req.params.id);
    if (!reparacion) return res.status(404).json({ error: 'Reparación no encontrada' });
    res.json(reparacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reparación' });
  }
};

exports.crearReparacion = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // Crear la reparación (la fecha se asigna automáticamente)
    const nuevaReparacion = await reparacionesModel.crear(req.body, connection);
    // Si se envían materiales, agregarlos y descontar inventario
    if (Array.isArray(req.body.materiales) && req.body.materiales.length > 0) {
      await reparacionesModel.agregarMateriales(nuevaReparacion.id, req.body.materiales, connection);
    }
    await connection.commit();
    // Obtener la reparación recién creada para devolver la fecha_registro
    const reparacionCompleta = await reparacionesModel.obtenerPorId(nuevaReparacion.id);
    res.status(201).json(reparacionCompleta);
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
};

exports.actualizarReparacion = async (req, res) => {
  try {
    const reparacionId = req.params.id;
    
    // Obtener la reparación antes de actualizar para comparar estados
    const reparacionAnterior = await reparacionesModel.obtenerPorId(reparacionId);
    if (!reparacionAnterior) {
      return res.status(404).json({ error: 'Reparación no encontrada' });
    }

    const actualizado = await reparacionesModel.actualizar(reparacionId, req.body);
    if (!actualizado) {
      return res.status(404).json({ error: 'Error actualizando reparación' });
    }

    // Verificar si el estado cambió y enviar notificación
    const estadoAnterior = reparacionAnterior.estado;
    const estadoNuevo = req.body.estado;
    
    if (estadoNuevo && estadoNuevo !== estadoAnterior) {
      try {
        // Obtener información del cliente para notificar
        const cliente = await clientesModel.obtenerPorCedula(reparacionAnterior.cliente);
        
        if (cliente && (cliente.correo || reparacionAnterior.emailCliente)) {
          // Obtener la reparación actualizada
          const reparacionActualizada = await reparacionesModel.obtenerPorId(reparacionId);
          
          // Enviar notificación de cambio de estado
          const resultadoNotificacion = await notificarCambioEstado(cliente, reparacionActualizada, estadoNuevo);
          
          if (resultadoNotificacion.success) {
            console.log(`Notificación enviada para reparación ${reparacionId}: ${estadoAnterior} -> ${estadoNuevo}`);
          } else {
            console.error(`Error enviando notificación para reparación ${reparacionId}:`, resultadoNotificacion.error);
          }
        }
      } catch (notifError) {
        console.error('Error enviando notificación automática:', notifError);
        // No fallar la actualización por error en notificación
      }
    }

    res.json({ 
      mensaje: 'Reparación actualizada correctamente',
      cambioEstado: estadoNuevo !== estadoAnterior,
      estadoAnterior: estadoAnterior,
      estadoNuevo: estadoNuevo
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarReparacion = async (req, res) => {
  try {
    const eliminado = await reparacionesModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Reparación no encontrada' });
    res.json({ mensaje: 'Reparación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar reparación' });
  }
};

// Materiales de reparación
exports.listarMateriales = async (req, res) => {
  try {
    const materiales = await reparacionesModel.obtenerMateriales(req.params.id);
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materiales' });
  }
};

exports.agregarMateriales = async (req, res) => {
  try {
    const materiales = await reparacionesModel.agregarMateriales(req.params.id, req.body.materiales);
    res.status(201).json(materiales);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarMaterial = async (req, res) => {
  try {
    const eliminado = await reparacionesModel.eliminarMaterial(req.params.materialId);
    if (!eliminado) return res.status(404).json({ error: 'Material no encontrado' });
    res.json({ mensaje: 'Material eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar material' });
  }
};

exports.buscarPorCedulaOImei = async (req, res) => {
  try {
    const valor = req.query.valor;
    if (!valor) return res.status(400).json([]);
    const resultados = await reparacionesModel.buscarPorCedulaOImei(valor);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar reparación' });
  }
};

exports.obtenerReparacionesPorMes = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const reparaciones = await reparacionesModel.obtenerPorMes(mes, anio);
    res.json(reparaciones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerReparacionesPorRangoFechas = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const reparaciones = await reparacionesModel.obtenerPorRangoFechas(desde, hasta);
    res.json(reparaciones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 