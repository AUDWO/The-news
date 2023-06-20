import { state, subscribe } from "./state/index.js";

class NavList {
  constructor($container) {
    this.$newsList = $container.querySelector(".news-list");
    this.$scrollObserver = $container.querySelector(".scroll-observer");

    this.page = 1;
    this.currentCategory = null;

    this.totalNewsCount = 0;

    this.currentNewsCount = 0;

    this.intersectionObserver = this.createIntersectionObserver();

    this.render.then(() => {
      this.intersectionObserver.observer(this.$scrollObserver);
      subscribe(this);
    });
  }

  createIntersectionObserver() {
    return new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting }) => {
        if (!isIntersecting) return;

        // 더이상 불러들일 뉴스가 없다면
        if (
          this.currentNewsCount !== 0 &&
          this.totalNewsCount === this.currentNewsCount
        ) {
          console.log("NO MORE NEWS!");

          this.$scrollObserver.style.visibility = "hidden";
          return;
        }

        this.$scrollObserver.style.visibility = "visible";
        this.page += 1;
        this.render();
      });
    });
  }

  async render() {
    const isChangedCategory = this.currentCategory !== state.category;

    if (isChangedCategory) {
      this.page = 1;
      this.currentCategory = state.category;
    }

    const { totalResult, articles } = await this.fetchArticles(
      state.category,
      this.page
    );

    this.totalNewsCount = totalResult;
    const $articles = this.createArticleElement(articles);

    if (isChangedCategory) {
      this.$newsList.replaceChildren($articles);
      this.currentNewsCount = articles.length;
    } else {
      this.$newsList.appendChild($articles);
      this.currentNewsCount = articles.length;
    }
  }

  async fetchArticles(category, page) {
    const pageSize = 5;
    const apiKey = "57dd0e05975842149c1357ed23313418";
    const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
      category === "all" ? "" : category
    }&page=${page}&pagesize=${pageSize}&apiKey=${apiKey}`;
    try {
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  createArticleElements(articles) {
    const $template = document.createElement("template");
    $template.innerHTML = articles
      .map(
        ({ title, description, url, urlToImage }) =>
          ({ title, description, url, urlToImage }) =>
            `
    <section class="news-item">
      <div class="thumbnail">
        <a href="${url}" target="_blank" rel="noopener noreferrer">
          <img src="${
            urlToImage ||
            "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
          }" alt="thumbnail"/>
        </a>
      </div>
      <div class="contents">
        <h2>
          <a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>
        </h2>
        <p>${description || ""}</p>
      </div>
    </section>`
      )
      .join("");
    return $template.content;
  }
}

export default NewsList;
