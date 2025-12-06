document.addEventListener('DOMContentLoaded', () => {
    agregarFila(); agregarFila(); agregarFila();
    initTheme();
});

// --- TEMA ---
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');

    btn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        if(!document.getElementById('resultadosSection').classList.contains('hidden')) renderizarGrafica();
    });
}

// --- TABLA ---
function agregarFila() {
    const tbody = document.querySelector('#tablaDatos tbody');
    const tr = document.createElement('tr');
    
    // AQUÍ ESTÁN LOS PLACEHOLDERS QUE PEDISTE
    tr.innerHTML = `
        <td><input type="number" step="any" class="form-control x-val" placeholder="Ej: 10.5"></td>
        <td><input type="number" step="any" class="form-control y-val" placeholder="Ej: 250.0"></td>
        <td><button onclick="eliminarFila(this)" class="btn-icon-delete"><i class="fas fa-times"></i></button></td>
    `;
    tbody.appendChild(tr);
}

function eliminarFila(btn) {
    const row = btn.parentNode.parentNode;
    if (document.querySelectorAll('#tablaDatos tbody tr').length > 1) row.remove();
    else {
        row.querySelectorAll('input').forEach(i => i.value = '');
        mostrarNotificacion("Debe haber al menos una fila.", "error");
    }
}

function limpiarTabla() {
    document.querySelector('#tablaDatos tbody').innerHTML = '';
    agregarFila(); agregarFila();
    document.getElementById('resultadosSection').classList.add('hidden');
    mostrarNotificacion("Tabla limpiada.");
}

// --- CÁLCULO ---
async function calcularRegresion() {
    const xInputs = document.querySelectorAll('.x-val');
    const yInputs = document.querySelectorAll('.y-val');
    let x = [], y = [];

    for(let i=0; i<xInputs.length; i++) {
        if(xInputs[i].value && yInputs[i].value) {
            x.push(parseFloat(xInputs[i].value));
            y.push(parseFloat(yInputs[i].value));
        }
    }

    if (x.length < 2) return mostrarNotificacion("Se necesitan al menos 2 pares de datos.", "error");

    try {
        const res = await fetch('/calcular', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({x, y})
        });

        if (!res.ok) throw new Error((await res.json()).error);
        
        const data = await res.json();
        mostrarResultados(data, x, y);
        mostrarNotificacion("¡Cálculo exitoso!", "success");

    } catch (e) { console.error(e); mostrarNotificacion(e.message, "error"); }
}

// --- RESULTADOS ---
let currentPlotData = null;

function mostrarResultados(data, xRaw, yRaw) {
    document.getElementById('resultadosSection').classList.remove('hidden');
    currentPlotData = { data, xRaw, yRaw };

    // 1. Tabla Cuerpo
    const tbody = document.querySelector('#tablaResultados tbody');
    tbody.innerHTML = '';
    data.tabla.forEach(r => {
        tbody.innerHTML += `<tr><td>${nm(r.x)}</td><td>${nm(r.y)}</td><td>${nm(r.x2)}</td><td>${nm(r.xy)}</td></tr>`;
    });

    // 2. TOTALES APILADOS
    document.querySelector('#tablaTotales').innerHTML = `
        <tr>
            <td><span class="total-label">Σx</span><span class="total-value">${nm(data.sumatorias.sum_x)}</span></td>
            <td><span class="total-label">Σy</span><span class="total-value">${nm(data.sumatorias.sum_y)}</span></td>
            <td><span class="total-label">Σx²</span><span class="total-value">${nm(data.sumatorias.sum_x2)}</span></td>
            <td><span class="total-label">Σxy</span><span class="total-value">${nm(data.sumatorias.sum_xy)}</span></td>
        </tr>
    `;

    // 3. Fórmulas
    document.getElementById('resultadoEcuacion').innerText = data.ecuacion;
    document.getElementById('sustitucionB').innerText = `b = ${nm(data.calculos.s_xy)} / ${nm(data.calculos.s_xx)} = ${nm(data.calculos.b)}`;
    document.getElementById('sustitucionA').innerText = `a = ${nm(data.calculos.promedio_y)} - (${nm(data.calculos.b)} × ${nm(data.calculos.promedio_x)}) = ${nm(data.calculos.a)}`;

    renderizarGrafica();
    document.getElementById('resultadosSection').scrollIntoView({ behavior: 'smooth' });
}

function nm(n) { return parseFloat(n).toFixed(4); }

function renderizarGrafica() {
    if (!currentPlotData) return;
    const { data, xRaw, yRaw } = currentPlotData;
    const isDark = document.body.classList.contains('dark-mode');
    
    const colors = {
        text: isDark ? '#e6edf3' : '#2c3e50',
        grid: isDark ? '#30363d' : '#dee2e6',
        points: isDark ? '#58a6ff' : '#006633',
        line: isDark ? '#f85149' : '#dc3545'
    };

    const trace1 = { x: xRaw, y: yRaw, mode: 'markers', type: 'scatter', name: 'Datos', marker: {size: 10, color: colors.points} };
    const trace2 = { x: [data.puntos_recta[0].x, data.puntos_recta[1].x], y: [data.puntos_recta[0].y, data.puntos_recta[1].y], mode: 'lines', name: 'Recta', line: {color: colors.line, width: 3} };

    const layout = {
        title: { text: 'Dispersión y Recta', font: {color: colors.text} },
        paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { gridcolor: colors.grid, color: colors.text },
        yaxis: { gridcolor: colors.grid, color: colors.text },
        font: { family: 'Roboto' }, margin: {t:40, b:40, l:40, r:20},
        legend: { x: 0, y: 1 }
    };
    Plotly.newPlot('miGrafica', [trace1, trace2], layout, {responsive: true, displayModeBar: false});
}

// --- NOTIFICACIONES ---
function mostrarNotificacion(msg, tipo='info') {
    const box = document.createElement('div');
    box.className = `toast ${tipo}`;
    box.innerHTML = `<i class="fas ${tipo==='error'?'fa-exclamation-circle':'fa-check-circle'}"></i> <span>${msg}</span>`;
    document.getElementById('notification-container').appendChild(box);
    setTimeout(() => { box.style.animation = 'fadeOut 0.5s'; setTimeout(()=>box.remove(), 400); }, 3000);
}