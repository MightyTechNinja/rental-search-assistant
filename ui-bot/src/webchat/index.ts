import { WebchatAppArgs } from "@botonic/react";
// @ts-ignore
import Chatbot from "../assets/chatbot.jpg";
// @ts-ignore
import Resortifi from "../assets/resortifi.png";

export const webchat: WebchatAppArgs = {
  theme: {
    style: {
      position: "relative",
      width: "50%",
      height: "80%",
    },
    header: {
      title: "Resortifi",
    },
    brand: {
      image: Resortifi,
    },
    triggerButton: {
      image: Chatbot,
      style: {
        position: "relative",
        display: "none",
      },
    },
    userInput: {
      emojiPicker: true as any,
    },
    replies: {
      align: "center",
      wrap: "nowrap",
    },
    reply: {
      style: {
        width: "fit-content",
        background: "rgb(109 221 159)",
        color: "auto",
        border: "none",
        "align-self": "center",
        "margin-bottom": "12px",
      },
    },
  },
  onInit: (app) => {
    // You can combine webchat listeners with the Webchat SDK's Api in order
    // to obtain extra functionalities. This will open automatically the webchat.
    app.open();
  },
};
