// components/PendingModal.jsx
import React, { useEffect } from "react";

const PendingModal = ({ show, imageSrc, alt = "Processing..." }) => {
  // lock/unlock body scroll
  useEffect(() => {
    if (show) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [show]);

  

  if (!show) return null;

  return (
    <>
      {/* Modal box (only image) */}
      <div className="modal d-block" role="dialog" aria-modal="true" aria-hidden="false">
        <div className="modal-dialog modal-sm custom-top" role="document">
          <div className="modal-content border-0 bg-transparent shadow-0 p-0">
            <img
              src={imageSrc}
              alt={alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px" }}
            />
          </div>
        </div>
      </div>

      {/* Smudged transparent backdrop */}
      <div className="modal-backdrop show custom-backdrop" />
    </>
  );
};

export default PendingModal;
