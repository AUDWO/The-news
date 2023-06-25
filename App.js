import { Nav, NewsList } from "./components/index";
import { createState } from "./state/index";

const App = () => {
  $container.innerHTML = `
    <nav class="category-list">
    </nav>
    <div class="news-list-container">
      <article class="news-list"></article>
      <div class="scroll-observer">
      </div>
    </div>
    `;

  createState({ category: "all" });
  new Nav($container.querySelector(".category-list"));

  new NewsList($container.querySelector(".news-list-container"));
};

App(document.querySelector("root"));
