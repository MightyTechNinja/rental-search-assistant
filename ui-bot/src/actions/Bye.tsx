import React from "react";
import { Text } from "@botonic/react";
import RateUserMessage from "../webchat/RateUserMessage";

export default class extends React.Component {
  static async botonicInit(request) {
    const payload = request.input.payload;
    const rate = payload && payload.split("-")[1];
    return { rate };
  }
  render(this) {
    return (
      <>
        {this.props.rate && <RateUserMessage rate={this.props.rate} />}
        <Text>Thanks for using us. Have a nice day!</Text>
      </>
    );
  }
}
