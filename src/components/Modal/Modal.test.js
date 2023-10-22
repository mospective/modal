import React from "react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { render, fireEvent, screen } from "@testing-library/react";
import Modal from "./Modal";

const modalRoot = document.createElement("div");
modalRoot.setAttribute("id", "modal-root");
document.body.appendChild(modalRoot);

test("Show modal with its children and close button", () => {
  // arrange
  const handleClose = jest.fn();

  // act
  const { getByText } = render(
    <Modal
      isModalOpen={true}
      modalRoot={modalRoot}
      modalTitle={"my modal title"}
      closeModalHandler={handleClose}
    />
  );

  // assert
  expect(getByText("my modal title")).toBeTruthy();

  // act
  fireEvent.click(getByText(/close/i));

  // assert
  expect(handleClose).toHaveBeenCalledTimes(1);

  screen.debug();
});

test("The modal does not show when is isModalOpen is false", () => {
  const { queryByText } = render(
    <Modal
      isModalOpen={false}
      modalRoot={modalRoot}
      modalTitle={"my modal title"}
    />
  );

  // assert
  expect(queryByText("my modal title")).not.toBeInTheDocument();
});

test("Move the focus to the close button and close modal", () => {
  // arrange
  const handleClose = jest.fn();

  const { getByText } = render(
    <Modal
      isModalOpen={true}
      modalRoot={modalRoot}
      modalTitle={"my modal title"}
      closeModalHandler={handleClose}
    />
  );

  const closebutton = getByText("Close modal");

  // Act
  closebutton.focus();

  // Assert
  expect(closebutton).toHaveFocus();

  // act
  fireEvent.click(getByText(/close/i));

  // assert
  expect(handleClose).toHaveBeenCalledTimes(1);

  screen.debug();
});

test("navigates through focusable elements using the Tab key", () => {
  // arrange
  const handleClose = jest.fn();

  act(() => {
    render(
      <>
        <Modal
          isModalOpen={true}
          modalRoot={modalRoot}
          modalTitle={"my modal title"}
          closeModalHandler={handleClose}
        >
          <button>Button 1</button>
          <a href="#test">Link to google</a>
          <input data-testid="input" type="text" />
          <button>Button 2</button>
        </Modal>
      </>,
      modalRoot
    );
  });

  // targets
  const firstElement = screen.getByTestId("content");
  const firstButton = screen.getByText("Button 1");
  const linkToGoogle = screen.getByText("Link to google");
  const inputElement = screen.getByTestId("input");
  const lastButton = screen.getByText("Button 2");
  const closebutton = screen.getByText("Close modal");

  // Act
  firstButton.focus();

  // assert
  expect(firstButton).toHaveFocus();

  // act
  userEvent.tab();

  // assert
  expect(linkToGoogle).toHaveFocus();

  // act
  userEvent.tab();

  // assert
  expect(inputElement).toHaveFocus();

  // act
  userEvent.tab();

  // assert
  expect(lastButton).toHaveFocus();

  // act
  userEvent.tab();

  // assert
  expect(closebutton).toHaveFocus();

  // act
  userEvent.tab();

  // assert
  expect(firstElement).toHaveFocus();

   // act
   userEvent.tab({ shift: true });

   // assert
   expect(closebutton).toHaveFocus();
});

test("Escape key close the modal", () => {

  // arrange
  const handleClose = jest.fn();

  // act
  const container = render(
    <Modal
      isModalOpen={true}
      modalRoot={modalRoot}
      modalTitle={"my modal title"}
      closeModalHandler={handleClose}
    />
  );

  // assert
  // Here we know that the modal is open
  expect(container.getByText("my modal title")).toBeInTheDocument();

  // target
  const divElement = screen.getByText("my modal title");

  // act
  fireEvent.keyDown(divElement, {
    key: "Escape",
  });

  // assert
  expect(handleClose).toHaveBeenCalledTimes(1);

  screen.debug();

});
