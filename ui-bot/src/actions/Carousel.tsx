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
import { BACKEND_URL } from "../config";

export default class extends React.Component {
  static contextType = RequestContext;
  static async botonicInit({ input, session, params, lastRoutePath }) {
    console.log("input.data=====", input.data);
    const url = BACKEND_URL + "/api/vector/search";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.VECTOR_API_TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: input.data,
      }),
    });
    const resData = await res.json();
    console.log("res=", resData);
    session.resp = resData;
  }
  render(this) {
    return (
      <>
        <Text>Select a property among these options:</Text>
        <Carousel>
          {this.context.session.resp.map((property, i) => (
            <Element key={property.id}>
              <Title style="">{property.title}</Title>
              <Pic src={property.thumbnailUrl} />
              <Subtitle style="">{property.description}</Subtitle>
              <Button url={property.thumbnailUrl}>Go Property</Button>
            </Element>
          ))}
        </Carousel>
      </>
    );
  }
}
