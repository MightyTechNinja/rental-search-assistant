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
          Hi human, I'm your virtual assistant of Resortifi Platform. I will
          help you manage your property reservations and much more.
        </Text>
        <Text>
          Select an option:
          <Button payload="carousel">Book a property</Button>
          <Button webview={CheckReservationsWebview}>
            Check your reservations
          </Button>
        </Text>
      </>
    );
  }
}
