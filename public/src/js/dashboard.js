window.onload = function( ){
  document.querySelector("#add-service-btn").onclick = popupForm;
}

function popupForm( ){
  Swal.fire({
    title: '<strong>Create new service</strong>',
    // icon: 'question',
    html:document.querySelector('#default-form').innerHTML,
    showCloseButton: true,
    showConfirmButton:false,
    showCancelButton:false,
    focusConfirm: false,
    // confirmButtonText:'Create',
    // confirmButtonAriaLabel: 'Thumbs up, great!',
    // cancelButtonText:'Cancel',
    // cancelButtonAriaLabel: 'Thumbs down'
  })
}