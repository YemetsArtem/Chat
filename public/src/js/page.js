import $ from "jquery";

class Page {
  constructor(page, pages) {
    this.pages = pages;
    this.page = $(`.${page}`);
    this.tab = $(`#${page}`);
  }

  show() {
    this.pages.forEach(page => {
      if (page[0] === this.page[0]) page.show();
      else page.hide("slow");
    });
  }

  bindTab(cb) {
    this.tab.click(() => {
      const fn = cb || this.show.bind(this);
      fn();
    });
  }
}

export default Page;
