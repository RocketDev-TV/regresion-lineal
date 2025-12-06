from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np

app = Flask(__name__)

# --- RUTAS ---
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calcular', methods=['POST'])
def calcular_regresion():
    try:
        # 1. Recibir datos
        datos_json = request.get_json()
        x_vals = [float(x) for x in datos_json['x']]
        y_vals = [float(y) for y in datos_json['y']]

        # 2. DataFrame
        df = pd.DataFrame({'x': x_vals, 'y': y_vals})

        # 3. Cálculos Intermedios
        df['x2'] = df['x'] ** 2
        df['xy'] = df['x'] * df['y']

        # 4. Sumatorias
        n = len(df)
        sum_x = df['x'].sum()
        sum_y = df['y'].sum()
        sum_x2 = df['x2'].sum()
        sum_xy = df['xy'].sum()

        # 5. Fórmulas Sxx y Sxy
        s_xy = sum_xy - ((sum_x * sum_y) / n)
        s_xx = sum_x2 - ((sum_x ** 2) / n)

        if s_xx == 0:
            return jsonify({'error': 'La pendiente es infinita (división por cero). Revisa tus datos de X.'}), 400

        # 6. Pendiente (b) e Intersección (a)
        b = s_xy / s_xx
        promedio_x = sum_x / n
        promedio_y = sum_y / n
        a = promedio_y - (b * promedio_x)

        # 7. Ecuación y Recta
        ecuacion = f"y = {a:.4f} + {b:.4f}x"
        
        linea_tendencia = [
            {'x': min(x_vals), 'y': a + b * min(x_vals)},
            {'x': max(x_vals), 'y': a + b * max(x_vals)}
        ]

        # 8. Respuesta
        respuesta = {
            'tabla': df.to_dict(orient='records'),
            'sumatorias': {
                'n': n,
                'sum_x': sum_x,
                'sum_y': sum_y,
                'sum_x2': sum_x2,
                'sum_xy': sum_xy
            },
            'calculos': {
                's_xx': round(s_xx, 4),
                's_xy': round(s_xy, 4),
                'promedio_x': round(promedio_x, 4),
                'promedio_y': round(promedio_y, 4),
                'b': round(b, 4),
                'a': round(a, 4)
            },
            'ecuacion': ecuacion,
            'puntos_recta': linea_tendencia
        }

        return jsonify(respuesta)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)