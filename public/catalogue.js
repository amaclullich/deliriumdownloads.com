(() => {
  const search = document.querySelector("#resource-search");
  const cards = [...document.querySelectorAll(".resource-card")];
  const buttons = [...document.querySelectorAll("[data-filter]")];
  const count = document.querySelector("#results-count");
  const empty = document.querySelector("#empty-state");
  const reset = document.querySelector("#reset-search");
  const form = document.querySelector("#resource-search-form");
  let activeFilter = "all";

  const update = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const audiences = card.dataset.audience.split(/\s+/);
      const audienceMatch = activeFilter === "all" || audiences.includes(activeFilter);
      const searchMatch = !query || card.dataset.search.includes(query);
      const show = audienceMatch && searchMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = visible === cards.length && !query && activeFilter === "all"
      ? `Showing all ${cards.length} downloads`
      : `Showing ${visible} ${visible === 1 ? "download" : "downloads"}`;
    empty.hidden = visible !== 0;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      update();
    });
  });

  search.addEventListener("input", update);
  form.addEventListener("submit", (event) => event.preventDefault());
  reset.addEventListener("click", () => {
    search.value = "";
    activeFilter = "all";
    buttons.forEach((button, index) => {
      button.classList.toggle("is-active", index === 0);
      button.setAttribute("aria-pressed", String(index === 0));
    });
    update();
    search.focus();
  });

  document.querySelectorAll("[data-set-filter]").forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.dataset.setFilter;
      const button = buttons.find((item) => item.dataset.filter === target);
      if (button) button.click();
    });
  });

})();
