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
    const url = BACKEND_URL + "/api/external-search";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "2 bedrooms and 3 living rooms in dallas", // input.data,
      }),
    });
    const resData = await res.json();
    session.resp = resData;
    console.log("external search resData=", resData);
  }

  render() {
    return (
      <>
        <Text>Here are some external resources related to your query</Text>
        {this.context.session.resp?.images && (
          <Carousel>
            {this.context.session.resp.images.map((image, i) => (
              <Element key={i}>
                <Title style="">{image.title}</Title>
                <Pic src={image.image} />
                {/* <Subtitle style="">{property.description}</Subtitle> */}
                <Button url={image.url}>View</Button>
              </Element>
            ))}
          </Carousel>
        )}
        {this.context.session.resp?.webs && (
          <Carousel>
            {this.context.session.resp.webs.map((web, i) => (
              <Element key={i}>
                <Title style="">{web.title}</Title>
                {/* <Pic src={image.image} /> */}
                <Subtitle style="">{web.content}</Subtitle>
                <Button url={web.url}>View</Button>
              </Element>
            ))}
          </Carousel>
        )}
      </>
    );
  }
}
