import React, { useEffect } from "react";
import { Text, Button } from "@botonic/react";
import CheckReservationsWebview from "../webviews/components/CheckReservations";

export default class extends React.Component {
  static async botonicInit(request) {
    const name = request.session.user.name;
    return { name };
  }

  render(this) {
    return (
      <>
        <Text>
          Hi 🙂, I'm your virtual assistant of Resortifi Platform. I will help you select anything you are looking for.
        </Text>
        <Text>
          Select Properties
          <Button payload="specific-location">By Specific Location</Button>
          <Button payload="near-me">Near Me</Button>
          {/* <Button webview={CheckReservationsWebview}>
            Check your reservations
          </Button> */}
        </Text>        
      </>
    );
  }
}
