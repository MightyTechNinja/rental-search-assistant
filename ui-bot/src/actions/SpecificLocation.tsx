import React from "react";
import styled from "styled-components";
import { Text, Button } from "@botonic/react";

const Flex = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;  
  margin-left: 52px;
  margin-right: 52px;
  margin-bottom: 12px;
`;

export default class extends React.Component {
  render() {
    const cities = [
      { name: "Los Angeles", payload: "los angeles" },
      { name: "Houston", payload: "houston" },
      { name: "Irving", payload: "irving" },
      { name: "Killeen", payload: "killeen" },
      { name: "Corpus Christi", payload: "corpus christi" },
    ];
    return (
      <>
        <Text>Please tell me which city you want to live in.</Text>
        <Flex>
          {cities.map((city, index) => (
            <Button key={index} payload="pick-location">
              {city.name}
            </Button>
          ))}
        </Flex>
      </>
    );
  }
}
