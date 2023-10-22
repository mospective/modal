import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./modal.css";

const Modal = ({ modalRoot, isModalOpen, closeModalHandler, modalTrigger, modalTitle, children }) => {
    // useRef stores a reference of the modal
    const modalRef = useRef(null);
    const focusableModalElements = useRef(null);

    // Tab keydown event handler
    const tabKeypress = (event) => {
        // Here the focus is being trapped in the modal when tabbing through
        const firstElement = focusableModalElements.current[0];
        const lastElement = focusableModalElements.current[focusableModalElements.current.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
        }
    };

    // closes modal when escape key is pressed and reverts the focus to the element of trigger, see closeModalWithTriggerFocus()
    const escapeKeypress = () => {
        closeModalWithTriggerFocus();
    };

    // Key press handler for keydown event when modal is open
    const keydownHandler = (event) => {
        switch (event.key) {
            case "Tab":
                tabKeypress(event);
                break;
            case "Escape":
                escapeKeypress();
                break;
            default:
                break;
        }
    };

    // close modal handler that closes the modal and reverts the focus back to the element that triggered the modal.
    const closeModalWithTriggerFocus = () => {
        closeModalHandler();
        modalTrigger?.focus();
    };

    useEffect(() => {
        // useEffect is being used to pick up interactive content when the modal is open.
        if (isModalOpen) {
            // focusableModalElements reference is set here
            // currently taking modalRef reference to find all interactive elements.
            // these interactive elements are stored in a nodeList similar to an array
            focusableModalElements.current = modalRef.current.querySelectorAll("a[href], button:not([disabled]), textarea, input, select, iframe, [tabindex='0'], [tabindex='1']");
            // focusing on the first interactive element when modal is open
            focusableModalElements.current[0].focus();
            // adds global modifier to the body to indicate that modal is open and necessary styles have been applied
            document.body.classList.add("modal__overlay--active");
        } else {
            // remove modifier when modal is close
            document.body.classList.remove("modal__overlay--active");
        }
        // When this dependency updates by comparing the previous value it held and in turn, it will re-run
    }, [isModalOpen]);

    // return block is using React portal which will allow the modal to sit outside of the main content when active
    return ReactDOM.createPortal(
        <>
            {/* when modal state is true show modal */}
            {isModalOpen && (
                <div className="modal__overlay">
                    {/* For the purpose of accessibility, role is set to dialog which will allow screenreaders read it */}
                    {/* aria-modal is set depending on isModalOpen state. If true, it informs assistive technologies windows/content underneath the modal are not available */}
                    {/* aria-labelledby gives dialog (modal) an accessible name. This set to the title which has the same id name as aria-labelledby (This creates the connections)  */}
                    {/* similar to the above, aria-describedby provides accessible description. ID name is used with aria-describedby */}
                    {/* NVDA tool was used for testing screenreader */}
                    {/* data-testid="content" was added for testing purposes */}
                    <div
                        className="modal__container"
                        role="dialog"
                        tabIndex="-1"
                        aria-modal={isModalOpen}
                        onKeyDown={keydownHandler}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-content"
                        ref={modalRef}
                    >
                        <div className="modal__inner" data-testid="content" tabIndex="0">
                            <div className="modal__header">
                                <h2 id="modal-title">{modalTitle}</h2>
                            </div>
                            <div id="modal-content" className="modal__content">
                                {/* this is where the content appears as when aded in App.js */}
                                {children}
                            </div>
                            <div className="modal__footer">
                                {/* Close modal event handler */}
                                <button onClick={closeModalWithTriggerFocus} className="close-btn" type="button" aria-label="Close modal">Close modal</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>,
        // portal to outside of the app element
        modalRoot
    );
};

export default Modal;
