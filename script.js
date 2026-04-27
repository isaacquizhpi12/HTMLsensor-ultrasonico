const token = "e8e28909-6ba4-4f64-8ce4-e301adfd7a85";
const variable = "Distance";

const texto = document.getElementById("txt-dist");
const estado = document.getElementById("estado");
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
      borderColor: "cyan",
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

  // 🎨 colores neón dinámicos
  if (d === 0) {
    root.style.setProperty('--color', '#9ca3af');
    estado.innerText = "SIN DETECCIÓN";
  } 
  else if (d <= 5) {
    root.style.setProperty('--color', '#ff0000');
    estado.innerText = "PELIGRO";
  } 
  else if (d <= 20) {
    root.style.setProperty('--color', '#ff9900');
    estado.innerText = "CERCA";
  } 
  else if (d <= 50) {
    root.style.setProperty('--color', '#00ffcc');
    estado.innerText = "SEGURO";
  } 
  else {
    root.style.setProperty('--color', '#00ccff');
    estado.innerText = "LIBRE";
  }

  chart.data.labels.push("");
  chart.data.datasets[0].data.push(d);

  if (chart.data.labels.length > 12) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
}

setInterval(actualizar, 1000);
actualizar();
