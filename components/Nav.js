import { state } from "../state/index.js";

class Nav {
  constructor($container) {
    this.$container = $container;

    this.categories = [
      { name: "all", text: "전체보기" },
      { name: "business", text: "비즈니스" },
      { name: "entertainment", text: "엔터테인먼트" },
      { name: "science", text: "과학" },
      { name: "sports", text: "스포츠" },
      { name: "technology", text: "기술" },
    ];

    this.render();
    this.bindEvents();
  }

  render() {
    this.$container.innerHTML = `
        <ul>
        ${this.categories.map(
          ({ next, name }) =>
            `<li id="${name}" class="category-item ${
              state.category === name ? "active" : ""
            }">${text}</li>`
        )}
        </ul>
        `;
  }

  bindEvents() {
    this.$container.onclick = ({ target }) => {
      if (!target.matches(".category-item:not(.active)")) return;

      this.$container.querySelector(".active").classList.remove("active");
      target.classList.add("active");

      state.category = target.id;
    };
  }
}
