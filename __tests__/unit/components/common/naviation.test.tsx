import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Navigation } from "@components/common";

describe("네비게이션 ", () => {
  it("헤딩을 랜더링해야한다.", () => {
    render(<Navigation />);

    const heading = screen.getByRole("gnb-heading");

    expect(heading).toBeInTheDocument();
  });
});
