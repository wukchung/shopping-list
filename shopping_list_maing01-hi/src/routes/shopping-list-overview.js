//@@viewOn:imports
import {
  Utils,
  createVisualComponent,
  useSession,
} from "uu5g05";
import Plus4U5App, { withRoute } from "uu_plus4u5g02-app";
import { useSubApp, useSystemData } from "uu_plus4u5g02";
import React from 'react';

import Config from "./config/config.js";
import Css from "./css/common";
import Grid from '@mui/material/Grid';
import ShoppingListsOverview from "../components/shopping-lists-overview";
import RouteBar from "../core/route-bar"; // Ensure the path is correct

//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:helpers
//@@viewOff:helpers

let ShoppingListOverview = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ShoppingListOverview",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { awid } = useSubApp();
    const { state: sessionState } = useSession();
    const { data: systemData } = useSystemData();
    const {
      uuAppUuFlsBaseUri,
      uuAppUuSlsBaseUri,
      uuAppBusinessModelUri,
      uuAppApplicationModelUri,
      uuAppBusinessRequestsUri,
      uuAppUserGuideUri,
      uuAppWebKitUri,
      uuAppProductPortalUri,
    } = systemData?.relatedObjectsMap || {};
    // Additional private variables or hooks can be defined here

    //@@viewOff:private

    //@@viewOn:interface
    // Additional public methods or interface definitions can be placed here
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    return (
      <div {...attrs} style={{ backgroundColor: '#f0f0f0' }}>
        <RouteBar />

        <Grid container justifyContent="center" style={{ height: '100vh' }}>

          {/* Shopping Lists Overview Component */}
          <Grid item xs={12} md={6} style={{ backgroundColor: 'white', padding: '20px' }}>
            <ShoppingListsOverview />
          </Grid>

          {/* Optionally, additional content or grid items can be added here */}

        </Grid>

      </div>
    );
    //@@viewOff:render
  }
});

ShoppingListOverview = withRoute(ShoppingListOverview);

//@@viewOn:exports
export { ShoppingListOverview };
export default ShoppingListOverview;
//@@viewOff:exports
