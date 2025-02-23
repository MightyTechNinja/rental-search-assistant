import React from "react";
import {
  RequestContext,
  Text,
  Carousel,
  Element,
  Pic,
  Button,
  Title,
  Subtitle,
} from "@botonic/react";
import { BACKEND_URL, API_VECTOR_TOKEN } from "../config";

export default class extends React.Component {
  static contextType = RequestContext;
  static async botonicInit({ input, session, params, lastRoutePath }) {
    const url = BACKEND_URL + "/api/vector/search";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: API_VECTOR_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: input.data,
      }),
    });
    const resData = await res.json();
    session.resp = resData;
  }

  render() {
    return (
      <>
        <Text>Nice! Here are the perfect properties matching near you</Text>
        <Carousel>
          {this.context.session.resp?.map((property, i) => (
            <Element key={property.id}>
              <Title style="">{property.title}</Title>
              <Pic src={property.thumbnailUrl} />
              <Subtitle style="">{property.description}</Subtitle>
              <Button url={property.thumbnailUrl}>View</Button>
            </Element>
          ))}
        </Carousel>
      </>
    );
  }
}
