import { render } from "@testing-library/react";
import Page from "../page";

// Header is now an async Server Component that calls auth.getSession().
// jsdom can't render async components, so mock it with a sync placeholder.
jest.mock("../_components/header", () => ({
  Header: () => <header data-testid="header-mock">Header</header>,
}));

describe("Home Page", () => {
  it("renders successfully", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
