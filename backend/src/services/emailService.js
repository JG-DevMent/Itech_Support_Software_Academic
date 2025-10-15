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
      from: `"Itech Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log("Correo enviado:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error enviando correo:", error);
    return false;
  }
}

module.exports = { enviarCorreo };