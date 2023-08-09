import { render } from "@testing-library/react";
import { CurrentUserProvider } from "./providers/CurrentUserProvider";
import { PropsWithChildren } from "react";

const TestProviders = (props: PropsWithChildren) => {
  return <CurrentUserProvider>{props.children}</CurrentUserProvider>;
};
export const testRender = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestProviders });
};
