import $ from "jquery";
import _ from "lodash";
import axios from "axios";
import Page from "./page";

class Profile extends Page {
  constructor(page, pages, edit) {
    super(page, pages);

    this.userEditContainers = $(`.${edit}`);
    this.userInfoContainers = {
      login: $(`.${page} #login`),
      photo: $(`.${page} #photo`),
      name: $(`.${page} #name`),
      email: $(`.${page} #email`),
      phone: $(`.${page} #phone`),
      address: $(`.${page} #address`),
      company: $(`.${page} #company`),
      profession: $(`.${page} #profession`),
      salary: $(`.${page} #salary`),
      projects: $(`.${page} #projects`),
      about: $(`.${page} #about`),
      level: $(`.${page} #level`)
    };
  }

  putInfo(data) {
    axios
      .get("/db")
      .then(res => {
        const foundUser = data || res.data;

        _.forEach(this.userInfoContainers, (value, key) => {
          for (let foundUserKey in foundUser) {
            if (key === foundUserKey) {
              if (key === "photo") value.attr("src", foundUser[foundUserKey]);
              else value.html(foundUser[foundUserKey]);
            }
          }
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  changeInfo() {
    this.editInfo();
    this.saveInfo();
  }

  editInfo() {
    const edit = () => {
      const infoContainers = $(".info");
      const inputContainers = $(".change");

      // If input container is already exist - don't do nothing
      if (inputContainers.length !== 0) return;

      // Hide info containers
      infoContainers.hide();

      // Insert input containers
      _.forEach(this.userEditContainers, value => {
        $(value).append(
          `<div class='change'>
          <input 
          value="${$(value)
            .find(".info")
            .text()}"
          placeholder="Enter your new ${$(value)
            .find(".info")
            .attr("id")}">
          </div>`
        );
      });
    };

    // Bind edit button
    $("#edit-btn").click(e => {
      e.preventDefault();
      $(".save-changes").show();
      $("#edit-btn").hide();

      edit();
    });
  }

  saveInfo() {
    const save = () => {
      const infoContainers = $(".info");
      const inputContainers = $(".change");

      const changeUserInfo = () => {
        let changedUser = {};

        _.forEach(inputContainers, value => {
          changedUser[
            `${$(value)
              .parent()
              .find(".info")
              .attr("id")}`
          ] = $(value)
            .find("input")
            .val();
        });

        return changedUser;
      };

      const changedUser = changeUserInfo();

      axios
        .post("/db", changedUser)
        .then(() => {
          this.putInfo();
          infoContainers.show();
          inputContainers.remove();
        })
        .catch(err => console.error(err));
    };

    // Bind save button
    $("#save-btn").click(e => {
      e.preventDefault();

      $(".save-changes").hide();
      $("#edit-btn").show();

      save();
    });

    // Bind cancel button
    $("#cancel-btn").click(e => {
      e.preventDefault();

      $(".save-changes").hide();
      $("#edit-btn").show();

      const infoContainers = $(".info");
      const inputContainers = $(".change");

      infoContainers.show();
      inputContainers.remove();
    });
  }
}

export default Profile;
