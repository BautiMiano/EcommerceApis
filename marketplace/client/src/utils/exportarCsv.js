// Descarga un CSV armado en el navegador. "columnas" es [{ titulo, valor: (fila) => ... }].
export const exportarCsv = (nombreArchivo, columnas, filas) => {
  const escapar = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`
  const lineas = [
    columnas.map((columna) => escapar(columna.titulo)).join(';'),
    ...filas.map((fila) => columnas.map((columna) => escapar(columna.valor(fila))).join(';')),
  ]

  // El BOM hace que Excel respete los acentos
  const archivo = new Blob(['﻿' + lineas.join('\n')], { type: 'text/csv;charset=utf-8' })
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(archivo)
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}
