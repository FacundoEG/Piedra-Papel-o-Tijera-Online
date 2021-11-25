import "./components/titles";
import "./components/buttons";
import "./components/ring";
import "./components/hands";
import "./pages/welcome";
import "./pages/enteroom";
import "./pages/newroom";
import "./pages/enteroom";
import "./pages/refused";
import "./pages/waitingroom";
import "./pages/game";
import "./pages/win";
import "./pages/lose";
import "./pages/draw";
import "./router";
import { state } from "./state";

(function () {
  // RECUPERA EL ESTADO GUARDADO EN SESSION STORAGE APENAS SE INGRESA A LA PAGE
  state.restoreState();
})();
