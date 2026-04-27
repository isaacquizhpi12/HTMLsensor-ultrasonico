const token = "e8e28909-6ba4-4f64-8ce4-e301adfd7a85";
const variable = "Distance";

const estado = document.getElementById("estado");
const texto = document.getElementById("txt-dist");
const carro = document.getElementById("carro");
const barra = document.getElementById("nivel");
const root = document.documentElement;

// gráfica
const ctx = document.getElementById("grafica").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      data: [],
      borderColor: "white",
      tension: 0.3
    }]
  }
});

async function actualizar() {
  try {
    const res = await fetch(`https://api.tago.io/data?variable=${variable}&qty=1`, {
      headers: { "Device-Token": token }
    });

    const data = await res.json();

    if (!data.result || data.result.length === 0) return;

    let d = parseFloat(data.result[0].value);
    if (isNaN(d)) d = 0;

    actualizarUI(d);

  } catch (e) {
    estado.innerText = "Error";
  }
}

function actualizarUI(d) {
  texto.innerText = d.toFixed(1) + " cm";

  let pos = Math.min((d / 50) * 100, 100);
  carro.style.left = pos + "%";
  barra.style.width = pos + "%";

  // 🔥 CAMBIO DE FONDO
  if (d === 0) {
    estado.innerText = "SIN DETECCIÓN";
    root.style.setProperty('--bg', '#1f2937'); // gris
  } 
  else if (d <= 5) {
    estado.innerText = "PELIGRO";
    root.style.setProperty('--bg', '#7f1d1d'); // rojo
  } 
  else if (d <= 20) {
    estado.innerText = "CERCA";
    root.style.setProperty('--bg', '#78350f'); // naranja
  } 
  else if (d <= 50) {
    estado.innerText = "SEGURO";
    root.style.setProperty('--bg', '#064e3b'); // verde
  } 
  else {
    estado.innerText = "LIBRE";
    root.style.setProperty('--bg', '#1e3a8a'); // azul
  }

  // gráfica
  chart.data.labels.push("");
  chart.data.datasets[0].data.push(d);

  if (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
}

setInterval(actualizar, 1000);
actualizar();
