// ResultModal.jsx
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function ResultModal({ open, onClose, imageSrc, alt = "Result" }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const modal = (
    <div
      className="rm-overlay"
      role="button"
      tabIndex={0}
      aria-label="Close modal"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClose?.();
      }}
    >
      <div
        role="presentation"
        className="rm-panel-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <div role="dialog" aria-modal="true" className="rm-panel">
          

          {/* Image */}
          <img src={imageSrc} alt={alt} className="rm-image" />
        </div>
      </div>

      <style>{`
        .rm-overlay{
          position: fixed; inset: 0;
          display: flex; align-items: center; justify-content: center;
          padding: 24px; z-index: 1000;
          background: rgba(15,23,42,0.35);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          outline: none;
        }

        .rm-panel-wrap{
          display: inline-block;
        }

        .rm-panel{
          position: relative;
          display: inline-block;
          border-radius: 16px;
          overflow: hidden; /* clip image corners */
          background: transparent; /* no extra white box */
          box-shadow: 0 10px 40px rgba(0,0,0,0.25);
        }

        .rm-image{
          display: block;
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: calc(90vh - 32px); /* safety cap inside viewport */
        }

        .rm-close{
          position: absolute; top: 10px; right: 10px;
          width: 36px; height: 36px; border-radius: 999px;
          background: rgba(0,0,0,0.4); border: none; color: white;
          cursor: pointer; font-size: 22px; line-height: 1;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background .12s ease;
        }
        .rm-close:hover{ background: rgba(0,0,0,0.6); }
        .rm-close:focus{ outline: 2px solid #60a5fa; outline-offset: 2px; }
      `}</style>
    </div>
  );

  const root = document.getElementById("modal-root") || document.body;
  return createPortal(modal, root);
}
