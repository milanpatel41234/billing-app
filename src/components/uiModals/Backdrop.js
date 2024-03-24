import React from 'react';
import ReactDOM from 'react-dom';

const BackdropOverlay = ({visible}) => {

  const portalRoot = document.getElementById('portal-root'); // Replace with the id of the root element in your HTML

  const overlay = (
    visible && (
      <div
        className="overlay"
        style={{
            backgroundColor: "rgba(0, 0, 0 ,0.3)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 999,
        }}
      ></div>
    )
  );

  return ReactDOM.createPortal(overlay, portalRoot);
};

export default BackdropOverlay;
