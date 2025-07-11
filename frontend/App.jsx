import { AppProvider } from "@shopify/polaris";
import Routes from "./Routes";

function App({ host }) {
  return (
    <AppProvider
      config={{
        apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
        host,
        forceRedirect: true,
      }}
    >
      <Routes />
    </AppProvider>
  );
}

export default App;
