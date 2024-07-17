function toggleSidenav() {
  var sidenav = document.getElementById("mySidenav");
  sidenav.classList.toggle("active");
}

function closeNav() {
  var sidenav = document.getElementById("mySidenav");
  sidenav.classList.remove("active");
}

function generateFAQCards(containerId, preguntas) {
  const container = document.getElementById(containerId);
  for (const key in preguntas) {
    const pregunta = preguntas[key];
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => window.location.href = `respuesta.html?id=${key}`;
    card.innerHTML = `
    <div class="tarj"
      <span><i class="fas fa-info-circle info"></i></span>
      <div class="card-body tarjeta">
          <h5 class="pregunta">${pregunta.title}</h5>
          <span><i class="fas fa-angle-double-right"></i></span>
      </div>
    </div>
    `;
    container.appendChild(card);
  }
}