import React from "react";
import { Route, Text, Reply } from "@botonic/react";
import Start from "./actions/Start";
import NotFound from "./actions/NotFound";
import BookRestaurant from "./actions/BookRestaurant";
import Carousel from "./actions/Carousel";
import BookHotel from "./actions/BookHotel";
import InfoReservation from "./actions/InfoReservation";
import CloseWebview from "./actions/CloseWebview";
import Bye from "./actions/Bye";
import MoreHelp from "./actions/MoreHelp";

export const routes: Route[] = [
  { path: "/", text: /^hi$/i, action: Start },

  // intent
  {
    path: "not-found",
    input: (i) => i.intents && i.intents[0].confidence < 0.7,
    action: NotFound,
  },
  { path: "book-restaurant", intent: "BookRestaurant", action: BookRestaurant },

  // booking  
  {
    path: "book-hotel",
    payload: /hotel-.*/,
    action: BookHotel,
  },
  {
    path: "info-reservation",
    payload: /enviar_.*/,
    action: InfoReservation,
  },
  {
    path: "close-webview",
    payload: "close-webview",
    action: CloseWebview,
  },
  {
    path: "carousel",
    payload: "carousel",
    text: /^.*\b(hotel|book)\b.*$/i,
    action: Carousel,
  },
  {
    path: "Bye",
    payload: /rating-.*/,
    text: /^bye$/i,
    action: Bye,
  },
  {
    path: "help",
    text: /.*/,
    payload: /help-.*/,
    action: MoreHelp,
  },
];

// export const routses: Route[] = [
//   {
//     path: "initial",
//     text: /hi/i,
//     // intent: 'Greetings',
//     action: () => (
//       <>
//         <Text>Hello! Nice to meet you ;)</Text>
//         <Text>
//           How can I help you?
//           <Reply payload="search">Search properties</Reply>
//           {/* <Reply payload="track">Track my order</Reply> */}
//         </Text>
//       </>
//     ),
//   },
// ];
