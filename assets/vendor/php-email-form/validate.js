(function() {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();
      
      console.log("--- Formulario Enviado ---"); // Log 1: Confirma que el evento de envío funciona.

      let thisForm = this;
      let action = "https://fb54l0pqq2.execute-api.us-east-2.amazonaws.com/prod/contacto"; 
      
      console.log("URL de la API:", action); // Log 2: Muestra la URL a la que se va a conectar.

      thisForm.querySelector('.loading').classList.add('d-block'); 
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = {
          name: thisForm.querySelector('[name="name"]').value,
          email: thisForm.querySelector('[name="email"]').value,
          subject: thisForm.querySelector('[name="subject"]').value,
          message: thisForm.querySelector('[name="message"]').value,
      };

      console.log("Datos a enviar (JSON):", JSON.stringify(formData)); // Log 3: Muestra los datos exactos que se están enviando.

      fetch(action, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => {
        console.log("Respuesta recibida del servidor:", response); // Log 4: Muestra el objeto de respuesta completo.
        if (response.ok) {
          console.log("La respuesta fue exitosa (status 200-299).");
          return response.json();
        } else {
          console.error("La respuesta del servidor indicó un error.", response.status, response.statusText);
          // Intentamos leer el cuerpo del error para más detalles.
          return response.text().then(text => { throw new Error(`Error ${response.status}: ${text}`) });
        }
      })
      .then(data => {
        console.log("Datos de la respuesta (JSON):", data); // Log 5: Muestra el cuerpo de la respuesta si todo fue bien.
        thisForm.querySelector('.loading').classList.remove('d-block');
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset();
      })
      .catch((error) => {
        console.error('--- ¡ERROR! ---'); // Log 6: Captura cualquier error en la promesa de fetch.
        console.error('Error detallado:', error);
        thisForm.querySelector('.loading').classList.remove('d-block');
        thisForm.querySelector('.error-message').innerHTML = `Error: ${error.message}`;
        thisForm.querySelector('.error-message').classList.add('d-block');
      });
    });
  });
})();