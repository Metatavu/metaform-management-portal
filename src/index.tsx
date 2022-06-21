import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "reportWebVitals";
import { Provider } from "react-redux";
import { store } from "app/store";
import { CssBaseline, responsiveFontSizes, ThemeProvider } from "@mui/material";
import theme from "theme";
import App from "components/App";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import Config from "app/config";

const sentryDsn = Config.getSentryDsn();

/**
 * Initialize Sentry
 */
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 1.0,
    environment: Config.getSentryEnvironment(),
    integrations: [new BrowserTracing()]
  });
}

/**
 * Initializes React component structure to the web page
 */
ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <ThemeProvider theme={ responsiveFontSizes(theme) }>
        <CssBaseline/>
        <App/>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();