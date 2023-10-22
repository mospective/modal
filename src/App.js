import React, { useState } from "react";
import Modal from "./components/Modal/Modal";
import "./App.css";

function App() {
  // using isOpen state here to show/hide the modal
  // the trigger state will retain a reference of the element that triggered the modal
  const [isOpen, setIsOpen] = useState(false);
  const [trigger, setTrigger] = useState(null);

  // an event handler that opens the modal & retains a reference of the trigger
  const openModalHandler = (event) => {
    setIsOpen(!isOpen);
    setTrigger(event.target);
  };

  // an event handler that closes the modal
  const closeModalHandler = () => {
    setIsOpen(false);
  };

  return (
    <div className="app">
      {/* page content */}
      <main className="main">
        <h1>Random facts</h1>
        <p>
          Open the modal to view some random facts or read the news{" "}
          <a href="https://www.bbc.co.uk/news">Visit BBC News website</a>.
        </p>
        <button
          onClick={openModalHandler}
          className="modal-btn"
          type="button"
          aria-label="Open modal"
        >
          Open modal
        </button>
      </main>

      {/* imported modal component which takes content as it's children */}
      {/* purpose of the approach is allow resusability */}
      {/* note: the component is passing props for state of modal, close handler, passing trigger reference, modal title and desired element where modal should appear in the DOM */}
      <Modal
        className="modal-group"
        modalRoot={document.getElementById("root")}
        isModalOpen={isOpen}
        closeModalHandler={closeModalHandler}
        modalTrigger={trigger}
        modalTitle="Random facts"
      >
        <p>
          The Eiffel Tower can be 15 cm taller during the summer, due to thermal
          expansion meaning the iron heats up, the particles gain kinetic energy
          and take up more space.
        </p>
        <p>
          Visit google and search for "random fact" for more facts{" "}
          <a
            href="https://www.google.com"
            rel="noreferrer"
            aria-label="Link to google home page"
            target="_blank"
          >
            Visit google
          </a>
        </p>
        <p>
          Human teeth are the only part of the body that cannot heal themselves.
          Teeth are coated in enamel which is not a living tissue.
        </p>
        <p>
          The Ancient Romans used to drop a piece of toast into their wine for
          good health - hence why we 'raise a toast'.
        </p>
        <p>
          The Japanese word 'Kuchi zamishi' is the act of eating when you're not
          hungry because your mouth is lonely. We do this all the time.
        </p>
      </Modal>
    </div>
  );
}

export default App;
