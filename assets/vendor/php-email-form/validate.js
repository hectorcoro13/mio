(function() {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      let action = "https://fb54l0pqq2.execute-api.us-east-2.amazonaws.com/prod";
      let recaptcha = thisForm.querySelector('.g-recaptcha');

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = {
          name: thisForm.querySelector('[name="name"]').value,
          email: thisForm.querySelector('[name="email"]').value,
          subject: thisForm.querySelector('[name="subject"]').value,
          message: thisForm.querySelector('[name="message"]').value,
      };

      fetch(action, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`${response.status} ${response.statusText}`);
        }
      })
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset();
      })
      .catch((error) => {
        console.error('Error:', error);
        thisForm.querySelector('.loading').classList.remove('d-block');
        thisForm.querySelector('.error-message').innerHTML = 'Error al enviar el mensaje. Intenta de nuevo.';
        thisForm.querySelector('.error-message').classList.add('d-block');
      });
    });
  });
})();