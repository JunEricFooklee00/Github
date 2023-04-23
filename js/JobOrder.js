// Get the clickable items and the info table
const clickableItems = document.querySelectorAll('.clickable-item');
const infoTable = document.querySelector('#info-table tbody');
const infoTC= document.querySelector('.info-table-container');
const dataContainer = document.querySelector('.data-container');

var button1 = document.getElementById("Accept");
var button2 = document.getElementById("Reject");
var button3 = document.getElementById("Validate");
button1.disabled = true;
button2.disabled = true;
button3.disabled = true;


// // Add a click event listener to each clickable item
// clickableItems.forEach((item) => {
//     item.addEventListener('click', () => {
//         const id = item.dataset.id;
//         const info = document.querySelector(`#info-${id}`).innerHTML;

//         // Populate the info table with the additional info
//         infoTable.innerHTML = info;
//     });
// });

const RFopenModalButtons = document.querySelectorAll('[data-modal-target="#RFmodal"]')
const RFcloseModalButtons = document.querySelectorAll('[data-close-buttonRF]')
const RFoverlay = document.getElementById('RFoverlay')

RFopenModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    RFopenModal(modal)
  })
})

RFoverlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.RFmodal.active')
  modals.forEach(modal => {
    RFcloseModal(modal)
  })
})

RFcloseModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.RFmodal')
    RFcloseModal(modal)
  })
})

function RFopenModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  RFoverlay.classList.add('active')
}

function RFcloseModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  RFoverlay.classList.remove('active')
}

// FOR JOB ORDER

const JOopenModalButtons = document.querySelectorAll('[data-modal-target="#JOmodal"]')
const JOcloseModalButtons = document.querySelectorAll('[data-close-buttonJO]')
const JOoverlay = document.getElementById('JOoverlay')

JOopenModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    JOopenModal(modal)
  })
})

JOoverlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.JOmodal.active')
  modals.forEach(modal => {
    JOcloseModal(modal)
  })
})

JOcloseModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.JOmodal')
    JOcloseModal(modal)
  })
})

function JOopenModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  JOoverlay.classList.add('active')
}

function JOcloseModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  JOoverlay.classList.remove('active')
}

// Hide the data container by default
dataContainer.style.display = 'none';

// Loop through each clickable-item div and add a click event listener
clickableItems.forEach((item) => {
  item.addEventListener('click', () => {
    const id = item.dataset.id;
    const info = document.querySelector(`#info-${id}`).innerHTML;

    // Populate the info table with the additional info
    infoTable.innerHTML = info;

    // Show the data container
    dataContainer.style.display = 'block';
  });
});

// Add an event listener to the trash button
$('.trash-button').on('click', function() {
  var id = $(this).data('id'); // Get the ID of the job to be deleted
  $.ajax({
    url: '/jobs/' + id, // The URL of the server endpoint to delete the job
    type: 'DELETE',
    success: function(result) {
      // If the job was deleted successfully, remove it from the HTML
      $('[data-id="' + id + '"]').remove();
    }
  });
});



