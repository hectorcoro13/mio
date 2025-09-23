<?php
/**
 * Script para procesar el formulario de contacto del portafolio de Hector Coronel.
 * Recibe los datos vía POST, los sanea y los envía al correo especificado.
 *
 * IMPORTANTE: Este script requiere un servidor con PHP para funcionar.
 */

// Evita que se acceda al script directamente.
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(403);
    echo "Acceso denegado.";
    exit;
}

// --- CONFIGURACIÓN ---
// Reemplaza esto con tu dirección de correo electrónico.
$recipient_email = "hector32219@gmail.com";

// --- RECOLECCIÓN Y SANITIZACIÓN DE DATOS ---
// Se recogen los datos del formulario y se limpian para evitar código malicioso.
$name = isset($_POST['name']) ? filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? filter_var(trim($_POST['subject']), FILTER_SANITIZE_STRING) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

// --- VALIDACIÓN ---
// Verifica que los campos no estén vacíos y que el email sea válido.
if (empty($name) || empty($subject) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400); // Error de solicitud incorrecta.
    echo "Por favor, completa todos los campos del formulario correctamente.";
    exit;
}

// --- CONSTRUCCIÓN DEL CORREO ---
// Se arma el cuerpo y los encabezados del correo.
$email_subject = "Nuevo mensaje de tu Portafolio: \"$subject\"";

$email_body = "Has recibido un nuevo mensaje desde tu portafolio web.\n\n";
$email_body .= "--------------------------------------------------\n";
$email_body .= "Nombre: " . $name . "\n";
$email_body .= "Email de Contacto: " . $email . "\n";
$email_body .= "--------------------------------------------------\n\n";
$email_body .= "Mensaje:\n" . $message . "\n";

// Los encabezados son importantes para que el correo no llegue a SPAM
// y para poder usar "Responder a" directamente al email del visitante.
$headers = "From: " . $name . " <" . $email . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// --- ENVÍO DEL CORREO ---
// Se intenta enviar el correo usando la función mail() de PHP.
if (mail($recipient_email, $email_subject, $email_body, $headers)) {
    http_response_code(200);
    // El archivo validate.js espera una respuesta simple. "OK" o un string vacío funcionan.
    echo "OK"; 
} else {
    http_response_code(500); // Error interno del servidor.
    echo "Hubo un problema en el servidor al intentar enviar el mensaje.";
}

?>