// JS
import "bootstrap";
import $ from "jquery";
import _ from "lodash";
import Front from "./front.js";
import Profile from "./profile.js";
import Chat from "./chat.js";
// CSS
import "../css/style.scss";
// HTML templates
import chat from "../templates/chat.html";
import frontpage from "../templates/frontpage.html";
import my_profile from "../templates/profile.html";
import another_profile from "../templates/another_profile.html";

// Insert templates in main block
$("main").append(frontpage);
$("main").append(chat);
$("main").append(my_profile);
$("main").append(another_profile);

window.onload = () => {
  // All pages elements
  const elements = [
    $(".front-page"),
    $(".chat"),
    $(".profile"),
    $(".another_profile")
  ];

  // Create pages instance
  const pages = {};
  pages.profile = new Profile("another_profile", elements);
  pages.myProfile = new Profile("profile", elements, "edit");
  pages.chat = new Chat("chat", elements, pages.profile, pages.myProfile);
  pages.front = new Front("front-page", elements, pages.chat);

  // Add events on Tab buttons
  _.forEach(pages, page => page.bindTab());

  // Default
  pages.front.show();
  pages.myProfile.putInfo();
  pages.myProfile.changeInfo();
  pages.chat.createChat();
};
