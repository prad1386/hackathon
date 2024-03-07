import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelperTooltip from "./index";

const props = {
  text: "Helper text",
  info: true,
};

test("renders tooltip", () => {
  const { getByTestId } = render(<HelperTooltip {...props} />);
  const tooltip = getByTestId("InfoOutlinedIcon");
  expect(tooltip).toBeInTheDocument();
});

test("renders text on tooltip hover", async () => {
  const { getByTestId, getByText } = render(<HelperTooltip {...props} />);
  const tooltip = getByTestId("InfoOutlinedIcon");
  fireEvent.mouseEnter(tooltip);
  await waitFor(() => getByText(props.text));
  expect(screen.getByText(props.text)).toBeInTheDocument();
});
