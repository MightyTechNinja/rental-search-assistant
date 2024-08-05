import React from "react";
import { Route, Text, Reply } from "@botonic/react";
import BookHotel from "./actions/BookHotel";
import BookRestaurant from "./actions/BookRestaurant";
import Bye from "./actions/Bye";
import CloseWebview from "./actions/CloseWebview";
import ExternalSearch from "./actions/ExternalSearch";
import Greetings from "./actions/Greetings";
import InfoReservation from "./actions/InfoReservation";
import MoreHelp from "./actions/MoreHelp";
import NearMe from "./actions/NearMe";
import NotFound from "./actions/NotFound";
import PickLocation from "./actions/PickLocation";
import SpecificLocation from "./actions/SpecificLocation";
import Start from "./actions/Start";

const withConfidence = (input, intent) =>
  input.intents.some((int) => int.label === intent && int.confidence >= 0.4);

export const routes: Route[] = [
  { path: "/", text: /^hi$/i, action: Start },
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
    path: "greetings",
    input: (i) => withConfidence(i, "Greetings"),
    action: Greetings,
  },
  // {
  //   path: "greetings",
  //   intent: "Greetings",
  //   action: Greetings,
  // },
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
