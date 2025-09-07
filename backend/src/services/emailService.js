const nodemailer = require("nodemailer");

// Configuración del transporte (SMTP de Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // tu correo Gmail
    pass: process.env.EMAIL_PASS  // contraseña de aplicación
  }
});

// Función genérica para enviar correos
async function enviarCorreo(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"ITECH Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log("Correo enviado:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error enviando correo:", error);
    return { success: false, error: error.message };
  }
}

// Templates de email para notificaciones
const emailTemplates = {
  // Template para cambio de estado de reparación
  estadoReparacion: (cliente, reparacion, nuevoEstado) => ({
    subject: `🔧 Actualización de tu reparación #${reparacion.id} - ITECH Support`,
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          .email-container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .status-badge { display: inline-block; background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
          .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🔧 ITECH Support</h1>
            <p>Actualización de tu reparación</p>
          </div>
          <div class="content">
            <h2>Hola ${cliente.nombre || cliente.nombreCliente},</h2>
            <p>Tu reparación ha sido actualizada:</p>
            
            <div class="info-box">
              <h3>📱 Información de la reparación</h3>
              <p><strong>ID de reparación:</strong> #${reparacion.id}</p>
              <p><strong>Dispositivo:</strong> ${reparacion.dispositivo} ${reparacion.marcaModelo}</p>
              <p><strong>IMEI/Serial:</strong> ${reparacion.imei}</p>
              <p><strong>Estado actual:</strong> <span class="status-badge">${nuevoEstado}</span></p>
              <p><strong>Problema:</strong> ${reparacion.problema}</p>
            </div>

            <div class="info-box">
              <h3>💰 Información de costos</h3>
              <p><strong>Costo de reparación:</strong> $${parseFloat(reparacion.costo).toLocaleString('es-CO')}</p>
              ${reparacion.costoMateriales ? `<p><strong>Costo de materiales:</strong> $${parseFloat(reparacion.costoMateriales).toLocaleString('es-CO')}</p>` : ''}
              <p><strong>Total:</strong> $${(parseFloat(reparacion.costo) + parseFloat(reparacion.costoMateriales || 0)).toLocaleString('es-CO')}</p>
            </div>

            ${nuevoEstado === 'Reparación Completa' ? 
              '<div style="background: #d4edda; padding: 20px; border-radius: 8px; border: 1px solid #c3e6cb; color: #155724;"><h3>🎉 ¡Tu reparación está lista!</h3><p>Puedes pasar a recoger tu dispositivo en nuestras instalaciones.</p></div>' : 
              '<div style="background: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7; color: #856404;"><h3>⏳ Reparación en proceso</h3><p>Te notificaremos cuando esté lista para recoger.</p></div>'
            }

            <div class="footer">
              <p>Gracias por confiar en ITECH Support</p>
              <p>📞 Contacto: ${process.env.STORE_PHONE || '(+57) 310-208-1541'}</p>
              <p>📧 Email: ${process.env.STORE_EMAIL || 'soporte@itechsupport.com'}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Template para factura generada
  facturaGenerada: (cliente, factura) => ({
    subject: `💳 Factura #${factura.numero_factura} generada - ITECH Support`,
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          .email-container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .invoice-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6; }
          .total-box { background: #d4edda; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #c3e6cb; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>💳 ITECH Support</h1>
            <p>Tu factura ha sido generada</p>
          </div>
          <div class="content">
            <h2>Hola ${cliente.nombre || factura.nombre_cliente},</h2>
            <p>Se ha generado tu factura por el servicio realizado:</p>
            
            <div class="invoice-box">
              <h3>📄 Detalles de la factura</h3>
              <p><strong>Número de factura:</strong> #${factura.numero_factura}</p>
              <p><strong>Fecha de emisión:</strong> ${new Date(factura.fecha_emision).toLocaleDateString('es-ES')}</p>
              <p><strong>Cliente:</strong> ${factura.nombre_cliente}</p>
              <p><strong>Cédula:</strong> ${factura.cliente}</p>
            </div>

            <div class="invoice-box">
              <h3>💰 Resumen financiero</h3>
              <p><strong>Subtotal:</strong> $${parseFloat(factura.subtotal).toLocaleString('es-CO')}</p>
              <p><strong>Impuestos:</strong> $${parseFloat(factura.impuesto).toLocaleString('es-CO')}</p>
              <div class="total-box">
                <h3 style="margin: 0; color: #155724;">Total a pagar: $${parseFloat(factura.total).toLocaleString('es-CO')}</h3>
              </div>
            </div>

            <div class="invoice-box">
              <h3>📋 Información del servicio</h3>
              ${factura.reparacion_id ? `<p><strong>Reparación ID:</strong> #${factura.reparacion_id}</p>` : ''}
              <p><strong>Método de pago:</strong> ${factura.metodo_pago}</p>
              <p><strong>Estado:</strong> ${factura.estado}</p>
            </div>

            ${factura.estado === 'Pendiente' ? 
              '<div style="background: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7; color: #856404;"><h3>⏳ Pago pendiente</h3><p>Recuerda realizar el pago para completar el proceso.</p></div>' : 
              '<div style="background: #d4edda; padding: 20px; border-radius: 8px; border: 1px solid #c3e6cb; color: #155724;"><h3>✅ Factura pagada</h3><p>¡Gracias por tu pago! La transacción ha sido completada.</p></div>'
            }

            <div class="footer">
              <p>Gracias por confiar en ITECH Support</p>
              <p>📞 Contacto: ${process.env.STORE_PHONE || '(+57) 310-208-1541'}</p>
              <p>📧 Email: ${process.env.STORE_EMAIL || 'soporte@itechsupport.com'}</p>
              <p>📍 Dirección: ${process.env.STORE_ADDRESS || 'Dirección de la tienda'}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Función específica para notificar cambio de estado de reparación
async function notificarCambioEstado(cliente, reparacion, nuevoEstado) {
  if (!cliente.correo && !cliente.emailCliente) {
    console.log('Cliente sin email registrado, no se puede enviar notificación');
    return { success: false, error: 'Sin email' };
  }

  const email = cliente.correo || cliente.emailCliente || reparacion.emailCliente;
  const template = emailTemplates.estadoReparacion(cliente, reparacion, nuevoEstado);
  
  return await enviarCorreo(email, template.subject, template.html);
}

// Función específica para notificar factura generada
async function notificarFacturaGenerada(cliente, factura) {
  if (!cliente.correo && !cliente.email_cliente && !factura.email_cliente) {
    console.log('Cliente sin email registrado, no se puede enviar factura por email');
    return { success: false, error: 'Sin email' };
  }

  const email = cliente.correo || cliente.email_cliente || factura.email_cliente;
  const template = emailTemplates.facturaGenerada(cliente, factura);
  
  return await enviarCorreo(email, template.subject, template.html);
}

// Función para enviar recordatorios de reparaciones en proceso
async function enviarRecordatorioReparacion(cliente, reparacion, diasTranscurridos) {
  if (!cliente.correo && !cliente.emailCliente) {
    console.log('Cliente sin email registrado, no se puede enviar recordatorio');
    return { success: false, error: 'Sin email' };
  }

  const email = cliente.correo || cliente.emailCliente || reparacion.emailCliente;
  const template = emailTemplates.recordatorioReparacion(cliente, reparacion, diasTranscurridos);
  
  return await enviarCorreo(email, template.subject, template.html);
}

// Función para notificar equipo listo para recoger
async function notificarEquipoListo(cliente, reparacion) {
  return await notificarCambioEstado(cliente, reparacion, 'Reparación Completa');
}

// Función para verificar configuración de email
async function verificarConfiguracionEmail() {
  try {
    await transporter.verify();
    return { success: true, message: 'Configuración de email válida' };
  } catch (error) {
    console.error('Error en configuración de email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { 
  enviarCorreo,
  notificarCambioEstado,
  notificarFacturaGenerada,
  enviarRecordatorioReparacion,
  notificarEquipoListo,
  verificarConfiguracionEmail,
  emailTemplates
};