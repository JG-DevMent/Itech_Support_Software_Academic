const { 
  notificarCambioEstado,
  notificarFacturaGenerada,
  enviarRecordatorioReparacion,
  verificarConfiguracionEmail
} = require('../services/emailService');
const reparacionesModel = require('../models/reparacionesModel');
const clientesModel = require('../models/clientesModel');
const facturasModel = require('../models/facturasModel');

const notificacionesController = {
  // Notificar cambio de estado de reparación
  async notificarEstadoReparacion(req, res) {
    try {
      const { reparacionId, nuevoEstado } = req.body;
      
      if (!reparacionId || !nuevoEstado) {
        return res.status(400).json({
          error: 'ID de reparación y nuevo estado son requeridos'
        });
      }

      // Obtener información de la reparación
      const reparacion = await reparacionesModel.obtenerPorId(reparacionId);
      if (!reparacion) {
        return res.status(404).json({
          error: 'Reparación no encontrada'
        });
      }

      // Obtener información del cliente
      const cliente = await clientesModel.obtenerPorCedula(reparacion.cliente);
      if (!cliente) {
        return res.status(404).json({
          error: 'Cliente no encontrado'
        });
      }

      // Enviar notificación
      const resultado = await notificarCambioEstado(cliente, reparacion, nuevoEstado);
      
      if (resultado.success) {
        res.json({
          message: 'Notificación enviada exitosamente',
          messageId: resultado.messageId,
          email: cliente.correo || cliente.emailCliente || reparacion.emailCliente
        });
      } else {
        res.status(500).json({
          error: 'Error enviando notificación',
          details: resultado.error
        });
      }

    } catch (error) {
      console.error('Error en notificarEstadoReparacion:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  },

  // Notificar factura generada
  async notificarFactura(req, res) {
    try {
      const { facturaId } = req.body;
      
      if (!facturaId) {
        return res.status(400).json({
          error: 'ID de factura es requerido'
        });
      }

      // Obtener información de la factura
      const factura = await facturasModel.obtenerPorId(facturaId);
      if (!factura) {
        return res.status(404).json({
          error: 'Factura no encontrada'
        });
      }

      // Obtener información del cliente
      const cliente = await clientesModel.obtenerPorCedula(factura.cliente);
      
      // Enviar notificación
      const resultado = await notificarFacturaGenerada(cliente || { nombre: factura.nombre_cliente }, factura);
      
      if (resultado.success) {
        res.json({
          message: 'Notificación de factura enviada exitosamente',
          messageId: resultado.messageId,
          email: cliente?.correo || factura.email_cliente
        });
      } else {
        res.status(500).json({
          error: 'Error enviando notificación de factura',
          details: resultado.error
        });
      }

    } catch (error) {
      console.error('Error en notificarFactura:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  },

  // Enviar recordatorio de reparación
  async enviarRecordatorio(req, res) {
    try {
      const { reparacionId } = req.body;
      
      if (!reparacionId) {
        return res.status(400).json({
          error: 'ID de reparación es requerido'
        });
      }

      // Obtener información de la reparación
      const reparacion = await reparacionesModel.obtenerPorId(reparacionId);
      if (!reparacion) {
        return res.status(404).json({
          error: 'Reparación no encontrada'
        });
      }

      // Calcular días transcurridos
      const fechaRegistro = new Date(reparacion.fecha_registro);
      const ahora = new Date();
      const diasTranscurridos = Math.floor((ahora - fechaRegistro) / (1000 * 60 * 60 * 24));

      // Obtener información del cliente
      const cliente = await clientesModel.obtenerPorCedula(reparacion.cliente);
      if (!cliente) {
        return res.status(404).json({
          error: 'Cliente no encontrado'
        });
      }

      // Enviar recordatorio
      const resultado = await enviarRecordatorioReparacion(cliente, reparacion, diasTranscurridos);
      
      if (resultado.success) {
        res.json({
          message: 'Recordatorio enviado exitosamente',
          messageId: resultado.messageId,
          diasTranscurridos,
          email: cliente.correo || cliente.emailCliente
        });
      } else {
        res.status(500).json({
          error: 'Error enviando recordatorio',
          details: resultado.error
        });
      }

    } catch (error) {
      console.error('Error en enviarRecordatorio:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  },

  // Enviar recordatorios automáticos (para reparaciones con más de X días)
  async enviarRecordatoriosAutomaticos(req, res) {
    try {
      const { diasLimite = 7 } = req.query;
      
      // Obtener todas las reparaciones activas
      const reparaciones = await reparacionesModel.obtenerTodas();
      const reparacionesActivas = reparaciones.filter(rep => 
        !['Reparación Completa', 'Entregado', 'Cancelado'].includes(rep.estado)
      );

      const ahora = new Date();
      const recordatoriosEnviados = [];
      const errores = [];

      for (const reparacion of reparacionesActivas) {
        try {
          const fechaRegistro = new Date(reparacion.fecha_registro);
          const diasTranscurridos = Math.floor((ahora - fechaRegistro) / (1000 * 60 * 60 * 24));

          if (diasTranscurridos >= diasLimite) {
            const cliente = await clientesModel.obtenerPorCedula(reparacion.cliente);
            if (cliente && (cliente.correo || cliente.emailCliente || reparacion.emailCliente)) {
              const resultado = await enviarRecordatorioReparacion(cliente, reparacion, diasTranscurridos);
              
              if (resultado.success) {
                recordatoriosEnviados.push({
                  reparacionId: reparacion.id,
                  cliente: cliente.nombre || reparacion.nombreCliente,
                  diasTranscurridos,
                  email: cliente.correo || cliente.emailCliente || reparacion.emailCliente
                });
              } else {
                errores.push({
                  reparacionId: reparacion.id,
                  error: resultado.error
                });
              }
            }
          }
        } catch (error) {
          errores.push({
            reparacionId: reparacion.id,
            error: error.message
          });
        }
      }

      res.json({
        message: 'Proceso de recordatorios completado',
        recordatoriosEnviados: recordatoriosEnviados.length,
        errores: errores.length,
        detalle: {
          enviados: recordatoriosEnviados,
          errores: errores
        },
        configuracion: {
          diasLimite: parseInt(diasLimite),
          reparacionesRevisadas: reparacionesActivas.length
        }
      });

    } catch (error) {
      console.error('Error en enviarRecordatoriosAutomaticos:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  },

  // Verificar configuración de email
  async verificarConfiguracion(req, res) {
    try {
      const resultado = await verificarConfiguracionEmail();
      
      if (resultado.success) {
        res.json({
          status: 'OK',
          message: 'Configuración de email válida',
          details: resultado.message
        });
      } else {
        res.status(500).json({
          status: 'ERROR',
          error: 'Configuración de email inválida',
          details: resultado.error
        });
      }

    } catch (error) {
      console.error('Error verificando configuración:', error);
      res.status(500).json({
        status: 'ERROR',
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  },

  // Obtener historial de notificaciones (simulado)
  async obtenerHistorial(req, res) {
    try {
      // En un sistema real, esto vendría de una tabla de logs
      const historial = [
        {
          id: 1,
          tipo: 'estado_reparacion',
          destinatario: 'cliente@ejemplo.com',
          asunto: 'Actualización de reparación #123',
          estado: 'enviado',
          fechaEnvio: new Date().toISOString(),
          reparacionId: 123
        }
      ];

      res.json({
        historial,
        total: historial.length
      });

    } catch (error) {
      console.error('Error obteniendo historial:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  },

  // Enviar notificación personalizada
  async enviarNotificacionPersonalizada(req, res) {
    try {
      const { email, asunto, mensaje, tipo = 'personalizada' } = req.body;
      
      if (!email || !asunto || !mensaje) {
        return res.status(400).json({
          error: 'Email, asunto y mensaje son requeridos'
        });
      }

      const htmlMensaje = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <style>
            .email-container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>📧 ITECH Support</h1>
              <p>Mensaje personalizado</p>
            </div>
            <div class="content">
              <div style="white-space: pre-line; line-height: 1.6;">${mensaje}</div>
              
              <div class="footer">
                <p>Mensaje enviado desde ITECH Support</p>
                <p>📞 Contacto: ${process.env.STORE_PHONE || '(+57) 310-208-1541'}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      const resultado = await enviarCorreo(email, asunto, htmlMensaje);
      
      if (resultado.success) {
        res.json({
          message: 'Notificación personalizada enviada exitosamente',
          messageId: resultado.messageId,
          email
        });
      } else {
        res.status(500).json({
          error: 'Error enviando notificación personalizada',
          details: resultado.error
        });
      }

    } catch (error) {
      console.error('Error en enviarNotificacionPersonalizada:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  }
};

module.exports = notificacionesController;