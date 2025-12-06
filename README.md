# 📈 Linear Regression Visualizer: Método de Mínimos Cuadrados

Este proyecto es una aplicación web interactiva diseñada para calcular, visualizar y explicar el proceso de **Regresión Lineal Simple** utilizando el método de Mínimos Cuadrados Ordinarios.

Desarrollado como herramienta educativa para ingeniería, la aplicación no solo entrega el resultado final, sino que desglosa el procedimiento matemático paso a paso, mostrando las tablas de cálculos intermedios y las fórmulas empleadas.

## 🚀 Características Principales

* **Entrada de Datos Dinámica:** Interfaz de usuario intuitiva para tabular pares de datos $(x, y)$.
* **Desglose Matemático:** Generación automática de tabla de cálculos intermedios:
    * Cálculo de $x^2$ y $x \cdot y$ para cada iteración.
    * Sumatorias exactas ($\Sigma x$, $\Sigma y$, $\Sigma x^2$, $\Sigma xy$).
* **Visualización de Fórmulas:** Muestra las ecuaciones de la pendiente ($m$ o $b$) y la intersección ($b$ o $a$) con los valores sustituidos para facilitar la comprensión del origen de los datos.
* **Gráfica Interactiva:** Renderizado de la dispersión de puntos y la recta de mejor ajuste resultante.

## 🛠️ Stack Tecnológico

* **Backend:** Python 3 (Flask) - Para el procesamiento matemático y manejo de rutas.
* **Frontend:** HTML5, CSS3 (Diseño responsivo), JavaScript.
* **Librerías Matemáticas:** NumPy / Pandas.
* **Visualización:** Chart.js (o Plotly.js).

## 🧮 Conceptos Aplicados

El proyecto implementa las fórmulas estadísticas para encontrar la recta $y = a + bx$ donde:

1.  Se calculan las sumatorias necesarias.
2.  Se obtiene la pendiente ($b$) mediante la covarianza y varianza.
3.  Se determina la intersección ($a$) usando los promedios.

---
_Desarrollado por Herrera Gomez Ignacio Ivan - Estudiante de Ingeniería en UPIICSA (IPN)._
