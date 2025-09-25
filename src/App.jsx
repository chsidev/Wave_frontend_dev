import React from "react";
import NotFound from "./container/NotFound";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params';
import toast, { ToastBar, Toaster } from "react-hot-toast";

import Home from "./container/Home.jsx";
import PrizePool from "./container/PrizePool.jsx";
import Dashboard from "./container/Dashboard.jsx";
import CoinFlip from "./container/CoinFlip.jsx";
import HowTo from "./container/HowTo.jsx";

const App = () => {
  return (
    <Router>
      <QueryParamProvider>
        <div>
          <div className="preloader align-items-center justify-content-center">
            <div className="load">
              <hr /><hr /><hr /><hr />
            </div>
          </div>
          <Toaster
            position="top-right"
            reverseOrder={true}
            toastOptions={{ duration: 5000 }}
          >
            {(t) => (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => toast.dismiss(t.id)}
              >
                <ToastBar onClick={() => alert(1)} toast={t} />
              </div>
            )}
          </Toaster>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/prize">
              <PrizePool />
            </Route>
            <Route exact path="/coinflip">
              <CoinFlip />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact path="/howto">
              <HowTo />
            </Route>
            <Route exact path="*">
              <NotFound />
            </Route>
          </Switch>
          <div className="bottomtotop"> 
            <i className="fas fa-chevron-right" />
          </div>
        </div>
      </QueryParamProvider>
    </Router>
  );
};

export default App;
