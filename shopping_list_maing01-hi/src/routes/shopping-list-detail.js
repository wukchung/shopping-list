//@@viewOn:imports
import {
  Utils,
  createVisualComponent,
  Environment,
  Lsi,
  DynamicLibraryComponent,
  useSession,
  useDynamicLibraryComponent,
} from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import { useSubApp, useSystemData } from "uu_plus4u5g02";
import Plus4U5App, { withRoute } from "uu_plus4u5g02-app";
import React, { useState } from 'react';

import Config from "./config/config.js";
import RouteBar from "../core/route-bar.js";
import importLsi from "../lsi/import-lsi.js";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Divider from '@mui/material/Divider';
import UserAccessList from "../components/user-access-list";

//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
    content: () => Config.Css.css`
    margin: 0 auto;
    max-width: 920px;

    .plus4u5-app-about > .uu5-bricks-header,
    .plus4u5-app-licence > .uu5-bricks-header,
    .plus4u5-app-authors > .uu5-bricks-header,
    .plus4u5-app-technologies > .uu5-bricks-header {
      border-bottom: 0;
    }

    .plus4u5-app-authors > .uu5-bricks-header {
      margin: 20px 0 10px 0;
      text-align: center;
    }

    > *:last-child {
      padding-bottom: 56px;
    }
  `,
    technologies: () => Config.Css.css({maxWidth: 480}),
    logos: () => Config.Css.css({textAlign: "center", marginTop: 56}),
    common: () =>
      Config.Css.css({
        maxWidth: 480,
        margin: "12px auto 56px",

        "& > *": {
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          padding: "9px 0 12px",
          textAlign: "center",
          color: "#828282",
          "&:last-child": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          },
        },
      }),
    listItem: () => Config.Css.css({
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#e0e0e0', // Change this color as needed
      }
    }),
    titleEdit: () => Config.Css.css({
      fontSize: '1.5rem', // Match the font size of h2
      fontWeight: 'bold',
      color: 'inherit',
      border: 'none',
      outline: 'none',
      padding: '0',
      margin: '19px 0 19px 0',
      backgroundColor: 'transparent', // Match the background of h2
      width: '100%' // Ensure it takes the full width
    }),
    divider: () => Config.Css.css({
      height: 'auto',
      alignSelf: 'stretch',
      borderLeft: '1px dotted grey' // Dotted grey line
    }),
    titleContainer: () => Config.Css.css({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 0 0 0' // Adjust padding as needed
    }),
  };

//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

let ShoppingListDetail = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ShoppingListDetail",
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
    const products = [];
    if (uuAppBusinessModelUri) products.push({ baseUri: uuAppBusinessModelUri });
    if (uuAppApplicationModelUri) products.push({ baseUri: uuAppApplicationModelUri });
    if (uuAppBusinessRequestsUri) products.push({ baseUri: uuAppBusinessRequestsUri });
    if (uuAppUserGuideUri) products.push({ baseUri: uuAppUserGuideUri });
    if (uuAppWebKitUri) products.push({ baseUri: uuAppWebKitUri });

    const { state } = useDynamicLibraryComponent("Plus4U5.App.ShoppingListDetail");
    const legacyComponentsReady = !state.startsWith("pending");

    // State to manage shopping list items
    const [shoppingList, setShoppingList] = React.useState([
      { id: 1, name: 'Milk', done: false },
      { id: 2, name: 'Bread', done: false },
    ]);

    const [newItem, setNewItem] = React.useState("");
    const [addingItem, setAddingItem] = React.useState(false);
    const [filterDone, setFilterDone] = useState(false);

    const handleAddNewItem = () => {
      if (newItem.trim() !== "") {
        const newItemObject = {
          id: Date.now(), // simple ID generation
          name: newItem,
          done: false,
        };
        setShoppingList([...shoppingList, newItemObject]);
        setNewItem("");
      }
      setAddingItem(false);
    };

    // Function to toggle the filter
    const toggleFilter = () => {
      setFilterDone(!filterDone);
    };

    // Filter logic for list items
    const visibleItems = filterDone ? shoppingList.filter(item => !item.done) : shoppingList;

    const handleNewItemChange = (event) => {
      setNewItem(event.target.value);
    };

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleAddNewItem();
      }
    };

    // Function to toggle done/undone
    const toggleItemStatus = (itemId) => {
      const updatedList = shoppingList.map(item =>
        item.id === itemId ? { ...item, done: !item.done } : item
      );
      setShoppingList(updatedList);
    };

    // Function to delete an item
    const deleteItem = (itemId) => {
      const updatedList = shoppingList.filter(item => item.id !== itemId);
      setShoppingList(updatedList);
    };

    // State for shopping list name and edit mode
    const [shoppingListName, setShoppingListName] = useState('My Shopping List');
    const [isEditingName, setIsEditingName] = useState(false);

    // Function to handle name change
    const handleNameChange = (event) => {
      setShoppingListName(event.target.value);
    };

    const handleTitleEditKeyPress = (event) => {
      if (event.key === 'Enter') {
        setIsEditingName(false);
        handleNameChange(event);
      }
    };

    // Function to save the new name and exit edit mode
    const saveNameEdit = () => {
      setIsEditingName(false);
    };
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    return (
      <div {...attrs} style={{ backgroundColor: '#f0f0f0' }}>

        <Grid container justifyContent="center" style={{ height: '100vh' }}>
          {/* Empty Grid item for spacing */}
          <Grid item xs={false} sm={false} md={3} />

          <Grid item className={Css.divider()}>
            <Divider orientation="vertical" />
          </Grid>

          <Grid item xs={12} sm={6} md={3} style={{ backgroundColor: 'white', padding: '20px' }}>

            {/* Title and Filter Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {isEditingName ? (
                <input
                  type="text"
                  value={shoppingListName}
                  onChange={handleNameChange}
                  onBlur={saveNameEdit}
                  onKeyPress={handleTitleEditKeyPress}
                  autoFocus
                  className={Css.titleEdit()}
                />
              ) : (
                <div className={Css.titleContainer()}>
                  <h2>
                    {shoppingListName}
                    <IconButton onClick={() => setIsEditingName(true)}>
                      <EditIcon />
                    </IconButton>
                  </h2>
                </div>
              )}
              <IconButton onClick={toggleFilter}>
                <CheckCircleIcon color={filterDone ? 'primary' : 'disabled'} />
              </IconButton>
            </div>

            {/* Button to add a new item */}
            {!addingItem && (
              <Button variant="contained" color="primary" onClick={() => setAddingItem(true)}>
                Add New Item
              </Button>
            )}

            {/* Inline form to add a new item */}
            {addingItem && (
              <TextField
                label="New Item"
                value={newItem}
                onChange={handleNewItemChange}
                onKeyPress={handleKeyPress}
                onBlur={handleAddNewItem}
                autoFocus
                variant="outlined"
                fullWidth
              />
            )}

            {/* Shopping List rendering */}
            <List>
              {visibleItems.map(item => (
                <ListItem
                  key={item.id}
                  className={Css.listItem()}
                  style={{ textDecoration: item.done ? 'line-through' : 'none' }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={item.name}
                    style={{ textDecoration: item.done ? 'line-through' : 'none' }}
                    onClick={() => toggleItemStatus(item.id)}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item className={Css.divider()}>
            <Divider orientation="vertical" />
          </Grid>

          <Grid item xs={12} sm={6} md={3} style={{ padding: '20px' }}>
          {/* User Access List Component */}
            <div className={Css.titleContainer()}>
              <h2 style={{ padding: "7px 0 0 0"}}>Members</h2>
            </div>
            <UserAccessList />
          </Grid>

          {/* Another empty Grid item for spacing */}
          <Grid item xs={false} sm={false} md={3} />
        </Grid>

      </div>
    );
    //@@viewOff:render
  }
});

ShoppingListDetail = withRoute(ShoppingListDetail);

//@@viewOn:exports
export { ShoppingListDetail };
export default ShoppingListDetail;
//@@viewOff:exports
