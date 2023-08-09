import { render } from "@testing-library/react";
import { PropsWithChildren } from "react";

const TestProviders = (props: PropsWithChildren) => {
  return <>{props.children}</>;
};
export const testRender = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestProviders });
};
