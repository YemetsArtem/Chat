import $ from "jquery";
import axios from "axios";
import io from "socket.io-client";
import Page from "./page";

class Chat extends Page {
  constructor(page, pages, profile, myProfile) {
    super(page, pages);

    this.profile = profile;
    this.myProfile = myProfile;
  }

  createChat() {
    const socket = io();

    socket.on("rooms", rooms => {
      rooms.forEach(room => {
        // Fill rooms-list
        if ($(".rooms-list").find(`.room.${room}`).length === 0)
          $(`<li class="room ${room}">${room} room</li>`).insertBefore(".add");

        // Bind event on each room in list
        $(`.room.${room}`).on("click", () => {
          $(`#${room}`).show();

          rooms.forEach(anotherRoom => {
            if (anotherRoom !== room) $(`#${anotherRoom}`).hide();
          });

          socket.emit("join to room", room, document.cookie);

          // Don't execute code below if room page has already created
          if ($(".chat-messages").find(`#${room}`).length === 1) return;

          socket.on(`get users in ${room}`, (usersInRoom, thisUser) => {
            this.fillMembersList(usersInRoom, room, thisUser);
          });

          const messages = `<div class="myRoom" id="${room}">
          <h1 class="messages-title">${room} room</h1>
          <ul id="messages-content"></ul>
          </div>`;

          $(".chat-messages").append(messages);
        });
      });
    });

    this.createRoom(socket);
    this.transmitMessage(socket);
    this.receiveMessage(socket);
  }

  fillMembersList(usersInRoom, room, thisUser) {
    axios.get("/dbAll").then(res => {
      const users = res.data;
      const checkUserCookie = document.cookie.indexOf(thisUser) !== -1;
      const checkDislayState = $(`.myRoom#${room}`).css("display") !== "none";

      if (checkUserCookie || checkDislayState) {
        $(".members-list").html(" ");

        users.forEach(user => {
          for (let i = 0; i < usersInRoom.length; i++) {
            if (user.login === usersInRoom[i]) {
              if (document.cookie.indexOf(user.login) !== -1)
                var name = "(you)";
              else var name = "";

              const li = `<li class="user" id="${user.login}">
              <img class="photo" src="${user.photo}" alt="user photo">
              <span class="user_name">${user.name}</span>
              <span class="you">${name}</span>
              </li>`;

              $(".members-head").html(`${room} room's members:`);
              $(`.members-list`).append(li);

              this.showProfile(user.login, $(`#${user.login}`));
            }
          }
        });
      }
    });
  }

  transmitMessage(socket) {
    axios.get("/db").then(res => {
      const foundUser = res.data;
      const input = $(".chat-input");

      $(".chat-form").submit(function() {
        socket.emit("chat messages", {
          photo: foundUser.photo,
          nickname: foundUser.login,
          text: input.val()
        });
        input.val("");
        return false;
      });
    });
  }

  receiveMessage(socket) {
    socket.on("chat messages", (msg, room) => {
      // Define style for different users message
      let reverse, color;

      if (document.cookie.indexOf(msg.nickname) !== -1) {
        reverse = "";
        color = "";
      } else {
        reverse = "reverse";
        color = "color";
      }

      // Insert message in new list item
      $(`#${room} #messages-content`).append(
        $(
          `<li class='message' id='${reverse}'>
             <img class="photo ${msg.nickname}" src="${msg.photo}">
             <div class="message-content" id="${color}">
                <h2 class="nickname ${msg.nickname}">${msg.nickname}</h2>
                <hr>
                <p class="text">${msg.text}</p>
             </div>
          </li>`
        )
      );

      // Bind event on message nickname
      this.showProfile(msg.nickname, $(`.${msg.nickname}`));
    });
  }

  createRoom(socket) {
    $(".add button").click(() => {
      if ($(".rooms-list").find(`#new_room`).length === 0) {
        const addRoom = `<form id="new_room"><input placeholder="Enter room name: "><button>Apply</button></form>`;
        $(addRoom).insertBefore(".add");
        $(".add").hide();

        $("#new_room").submit(function() {
          const input = $(this).find("input");

          if (input.val() !== "") {
            socket.emit("add room", input.val());
            $(this).remove();
            $(".add").show();
          } else {
            input
              .css("border", "2px solid red")
              .attr("placeholder", "Please write something");
            setTimeout(() => {
              input
                .css("border", "2px solid gray")
                .attr("placeholder", "Enter room name:");
            }, 2500);
            return false;
          }
        });
      }
    });
  }

  showProfile(login, button) {
    button.click(e => {
      if (document.cookie.indexOf(login) !== -1) {
        this.myProfile.show();
        return;
      }

      this.profile.show();
      axios
        .post("/db", { nickname: login })
        .then(res => {
          this.profile.putInfo(res.data);
        })
        .catch(err => console.error(err));
    });
  }
}

export default Chat;
