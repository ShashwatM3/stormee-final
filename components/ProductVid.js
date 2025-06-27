import React, { useState } from 'react';
import "./ProductVid.css";

function ProductVid() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='productvidmain'>
      <div>
        {/* Video Banner with Play Button */}
        <div className="video-banner" onClick={openModal}>
          <img 
            src="/validationEngine2.png" 
            alt="Stormee AI Video Banner" 
            className="banner-image"
          />
          <div className="play-button-overlay">
            <div className="play-button">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Modal Popup for Video */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
              <video width="100%" height="auto" controls autoPlay>
                <source src="productDemoVid.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductVid