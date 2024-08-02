import React from "react";
import { Text } from "@botonic/react";
import HotelFormMessage from "../webchat/HotelFormMessage";

export default class extends React.Component {
  static async botonicInit(request) {
    const hotel = request.input.payload.split("-")[1];
    const name = request.session.user.name;
    return { hotel, name };
  }
  render(this) {
    return (
      <>
        <Text>
          {this.props.name} you have selected **{this.props.hotel}**. To confirm
          the reservation, we would need some more information.
        </Text>
        <HotelFormMessage hotel={this.props.hotel} />
      </>
    );
  }
}
