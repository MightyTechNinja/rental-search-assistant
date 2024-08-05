import React from "react";
import styled from "styled-components";
import { RequestContext, Text, Reply } from "@botonic/react";

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-left: 52px;
  margin-right: 52px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

export default class extends React.Component {
  static contextType = RequestContext;

  render() {
    return (
      <>
        <Text>I'm just a bot 😅 What do you want to do?</Text>
        <Flex>
          <Reply payload="specific-location">Search with me</Reply>
          <Reply payload="">Query anything</Reply>
        </Flex>
      </>
    );
  }
}
