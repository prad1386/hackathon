import { render, fireEvent } from "@testing-library/react";
import ActionMenu from "./index";

const props = {
  options: ["Item 1", "Item 2"],
  selectedRowActionStatus: ["Item 2"],
  handleActionsMenu: jest.fn(),
};

test("render action menu", () => {
  const { getByTestId } = render(<ActionMenu {...props} />);
  const actionMenu = getByTestId("action-menu");
  expect(actionMenu).toBeInTheDocument();
});

test("render actions items on click of action menu", () => {
  const { getByTestId, getByText } = render(<ActionMenu {...props} />);
  const actionMenu = getByTestId("action-menu");

  // Click action menu
  fireEvent.click(actionMenu);
  const actionItem1 = getByText("Item 1");
  expect(actionItem1).toBeInTheDocument();
  const actionItem2 = getByText("Item 2");
  expect(actionItem2).toBeInTheDocument();
});

test("renders item 1 as enabled and item 2 as disabled", () => {
  const { getAllByRole, getByTestId } = render(<ActionMenu {...props} />);
  const actionMenu = getByTestId("action-menu");

  // Click action menu
  fireEvent.click(actionMenu);
  const menuitem = getAllByRole("menuitem");
  expect(menuitem[1].getAttribute("aria-disabled")).toBeTruthy();
});

test("on click of item 1, handler function gets called", () => {
  const { getByText, getByTestId } = render(<ActionMenu {...props} />);
  const actionMenu = getByTestId("action-menu");

  // Click action menu
  fireEvent.click(actionMenu);
  const actionItem1 = getByText("Item 1");
  expect(actionItem1).toBeInTheDocument();

  // Click first action item
  fireEvent.click(actionItem1);
  expect(props.handleActionsMenu).toHaveBeenCalledTimes(1);
});
