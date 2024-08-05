import React from "react";
import styled from "styled-components";
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

const AnswerBox = styled.div`
  margin-left: 36px;
  text-wrap: initial;
`;

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
        {this.context.session.resp?.images?.length > 0 && (
          <Carousel>
            {this.context.session.resp.images.map((image, i) => (
              <Element key={i}>
                <Title style="">{image.title}</Title>
                <Pic src={image.image} />
                <Button url={image.url}>View</Button>
              </Element>
            ))}
          </Carousel>
        )}
        {this.context.session.resp?.webs?.length > 0 && (
          <Carousel>
            {this.context.session.resp.webs.map((web, i) => (
              <Element key={i}>
                <Title style="">{web.title}</Title>
                <Subtitle style="">{web.content}</Subtitle>
                <Button url={web.url}>View</Button>
              </Element>
            ))}
          </Carousel>
        )}
        {this.context.session.resp?.answer && (
          <AnswerBox>
            <Title style="">{this.context.session.resp.answer}</Title>
          </AnswerBox>
        )}
        {/* {this.context.session.resp?.related && (
          <Subtitle style="">{this.context.session.resp.related}</Subtitle>
        )} */}
      </>
    );
  }
}
