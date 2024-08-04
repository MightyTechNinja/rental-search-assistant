import React from "react";
import { Route, Text, Reply } from "@botonic/react";
import BookHotel from "./actions/BookHotel";
import BookRestaurant from "./actions/BookRestaurant";
import Bye from "./actions/Bye";
import CloseWebview from "./actions/CloseWebview";
import ExternalSearch from "./actions/ExternalSearch";
import InfoReservation from "./actions/InfoReservation";
import MoreHelp from "./actions/MoreHelp";
import NearMe from "./actions/NearMe";
import NotFound from "./actions/NotFound";
import PickLocation from "./actions/PickLocation";
import SpecificLocation from "./actions/SpecificLocation";
import Start from "./actions/Start";

export const routes: Route[] = [
  { path: "/", text: /^(hi|hello|hey|good morning|)$/i, action: Start },
  {
    path: "specific-location",
    payload: "specific-location",
    action: SpecificLocation,
    childRoutes: [
      {
        path: "pick-location",
        payload: "pick-location",
        action: PickLocation,
      },
    ],
  },
  {
    path: "near-me",
    payload: "near-me",
    action: NearMe,
  },
  {
    path: "external-search",
    payload: "external-search",
    action: ExternalSearch,
  },

  {
    path: "not-found",
    input: (i) => i.intents && i.intents[0].confidence < 0.7,
    action: NotFound,
  },
  { path: "book-restaurant", intent: "BookRestaurant", action: BookRestaurant },

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
    path: "Bye",
    payload: /rating-.*/,
    text: /^(bye|good bye|)$/i,
    action: Bye,
  },
  // {
  //   path: "help",
  //   text: /.*/,
  //   payload: /help-.*/,
  //   action: MoreHelp,
  // },
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
