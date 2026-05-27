import { useState } from "react";

function AddProductModal({ productos, nevera, onAdd, onClose }) {
  const [search, setSearch] = useState("");

  const filtered = Object.values(productos).filter((p) => {
    const q = search.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
  });

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">Añadir producto</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <input
            className="search-input"
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          <div className="prod-list">
            {filtered.length === 0 && (
              <p className="no-results">Sin resultados</p>
            )}
            {filtered.map((p) => (
              <div
                key={p.id}
                className="prod-item"
                onClick={() => onAdd(p.id)}
              >
                <div className="prod-item-info">
                  <div className="prod-item-name">{p.nombre}</div>
                  <div className="prod-item-cat">
                    {p.categoria} · {p.tipo}
                  </div>
                </div>
                {nevera[p.id] && (
                  <span className="already-tag">
                    {nevera[p.id]} en nevera
                  </span>
                )}
                <span className="add-plus">+</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AddProductModal;