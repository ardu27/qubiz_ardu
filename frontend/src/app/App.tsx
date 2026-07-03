import { CurrentUserProvider } from "./CurrentUserContext";
import { AppRouter } from "./router";

function App() {
  return (
    <CurrentUserProvider>
      <AppRouter />
    </CurrentUserProvider>
  );
}

export default App;
