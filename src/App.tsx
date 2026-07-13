import Landing from "./components/Landing";
import SnippetApp from "./components/SnippetApp";
import { useRoute } from "./router";

export default function App() {
  const route = useRoute();
  return route === "/app" ? <SnippetApp /> : <Landing />;
}
