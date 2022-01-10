import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

/** apollo client setup */
const link = new HttpLink({
  uri: "http://localhost:8080/graphql",
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

/** global style overrides */
const body = document.getElementsByTagName("body")[0];
body.style.margin = "0";

const html = document.getElementsByTagName("html")[0];
html.style.backgroundColor = "#000";
html.style.color = "#f9f9f9";
html.style.fontFamily = "'Inter', san-serif";

ReactDOM.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
