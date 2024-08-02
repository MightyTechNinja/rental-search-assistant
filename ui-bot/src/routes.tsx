import React from "react";
import { Route, Text, Reply } from "@botonic/react";

export const routes: Route[] = [
  {
    path: "initial",
    text: /hi/i,
    action: () => (
      <>
        <Text>Hello! Nice to meet you ;)</Text>
        <Text>
          How can I help you?
          <Reply payload="search">Search properties</Reply>
          {/* <Reply payload="track">Track my order</Reply> */}
        </Text>
      </>
    ),
  },
];
