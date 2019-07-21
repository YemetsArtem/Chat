import $ from "jquery";
import Page from "./page";

class Front extends Page {
  constructor(page, pages, chat) {
    super(page, pages);

    $(".goto").click(() => {
      chat.show();
    });
  }
}

export default Front;
