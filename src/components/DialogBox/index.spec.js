import { render } from "@testing-library/react";
import DialogBox from "./index";

const props = {
  title: "Dialog Box for testing",
  maxWidth: "sm",
  children: "Sample content",
  isOpen: true,
  handleClose: jest.fn(),
};

test("renders dialog box", () => {
  const { getByTestId, getByText } = render(<DialogBox {...props} />);
  const dialogBox = getByTestId("dialog-box");
  expect(dialogBox).toBeInTheDocument();
  const dialogTitle = getByText(props.title);
  expect(dialogTitle).toBeInTheDocument();
});

test("renders content for dialog body", () => {
  const { getByText } = render(<DialogBox {...props} />);
  const dialogContent = getByText(props.children);
  expect(dialogContent).toBeInTheDocument();
});

test("renders two buttons in dialog box", () => {
  const { getByRole } = render(<DialogBox {...props} />);
  const cancelBtn = getByRole("button", {
    name: /Cancel/i,
  });
  expect(cancelBtn).toBeInTheDocument();
  const submitBtn = getByRole("button", {
    name: /Submit/i,
  });
  expect(submitBtn).toBeInTheDocument();
});
