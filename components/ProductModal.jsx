function ProductModal({ producto, cantidad, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">{producto.nombre}</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="info-row">
            <span className="info-label">Categoría</span>
            <span className="badge">{producto.categoria}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Unidad de medida</span>
            <span className="info-val">{producto.tipo}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Calorías</span>
            <span className="info-val">{producto.calorias}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Proteínas</span>
            <span className="info-val">{producto.proteinas}</span>
          </div>
          <div className="info-row">
            <span className="info-label">En nevera</span>
            <span className="info-val">{cantidad} {producto.tipo}</span>
          </div>
          <p className="prod-desc">{producto.descripcion}</p>
        </div>

      </div>
    </div>
  );
}

export default ProductModal;