import App from "./App";
import { createRoot } from "react-dom/client";
import { initI18n } from "./utils/i18nUtils";

initI18n().then(() => {
  const params = new URLSearchParams(window.location.search);
  const host = params.get("host");

  const root = createRoot(document.getElementById("app"));
  root.render(<App host={host} />);
});
