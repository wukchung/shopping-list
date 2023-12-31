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
import React, { useState ,useContext } from 'react';

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
import { useShoppingList } from '../contexts/ShoppingListContext';
import Css from "./css/common";
import { ThemeContext } from "../contexts/ThemeContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import { useParams } from 'react-router-dom';

//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants


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
    const { listId } = props.params || {};
    console.log(listId);
    const parsedListId = parseInt(listId);
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

    const { shoppingLists, setShoppingLists } = useShoppingList();

    const shoppingList = shoppingLists.find((list) => list.id === parsedListId);

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

        // Create a new updated array of shopping lists
        const updatedShoppingLists = shoppingLists.map((list) => {
          // For the list we are modifying, create a new object with updated items
          if (list.id === shoppingList.id) {
            return {
              ...list,
              items: [...list.items, newItemObject],
            };
          }
          // For all other lists, return them as they are
          return list;
        });
        console.log(updatedShoppingLists);
        // Update the state with the new array of shopping lists
        setShoppingLists(updatedShoppingLists);
        setNewItem("");
      }
      setAddingItem(false);
    };

    // Function to toggle the filter
    const toggleFilter = () => {
      setFilterDone(!filterDone);
    };

    // Filter logic for list items
    const visibleItems = filterDone ? shoppingList.items.filter((item) => !item.done) : shoppingList.items;

    const handleNewItemChange = (event) => {
      setNewItem(event.target.value);
    };

    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleAddNewItem();
      }
    };

    // Function to toggle done/undone
    const toggleItemStatus = (itemId) => {
      // Map over the shoppingLists to update the specific list and its items
      const updatedShoppingLists = shoppingLists.map((list) => {
        if (list.id === shoppingList.id) {
          // Map over the items of the specific list to update the status of the item
          const updatedItems = list.items.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item));

          // Return a new object for the updated list with the updated items
          return {
            ...list,
            items: updatedItems,
          };
        }
        // Return all other lists as they are
        return list;
      });

      // Update the shoppingLists state with the new array
      setShoppingLists(updatedShoppingLists);
    };

    // Function to delete an item
    const deleteItem = (itemId) => {
      // Map over the shoppingLists to update the specific list
      const updatedShoppingLists = shoppingLists.map((list) => {
        if (list.id === shoppingList.id) {
          // Create a new array for the list's items, excluding the item to be deleted
          const updatedItems = list.items.filter((item) => item.id !== itemId);

          // Return a new object for the updated list with the updated items
          return {
            ...list,
            items: updatedItems,
          };
        }
        // Return all other lists as they are
        return list;
      });

      // Update the shoppingLists state with the new array
      setShoppingLists(updatedShoppingLists);
    };

    // State for shopping list name and edit mode
    const [shoppingListName, setShoppingListName] = useState(shoppingList.name);
    const [isEditingName, setIsEditingName] = useState(false);

    // Function to handle name change
    const handleNameChange = (event) => {
      setShoppingListName(event.target.value);
    };

    const handleTitleEditKeyPress = (event) => {
      if (event.key === "Enter") {
        setIsEditingName(false);
        handleNameChange(event);
      }
    };

    // Function to save the new name and exit edit mode
    const saveNameEdit = () => {
      setIsEditingName(false);
    };
    const { theme } = useContext(ThemeContext); // Manage theme state

    // Data preparation for the chart
    const completedItemsCount = shoppingList.items.filter((item) => item.done).length;
    const pendingItemsCount = shoppingList.items.length - completedItemsCount;
    const chartData = [
      { name: "Completed", value: completedItemsCount },
      { name: "Pending", value: pendingItemsCount },
    ];

    // Define colors for the chart
    const COLORS = ["#0088FE", "#FF8042"];

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    return (
      <div key={theme}>
        <div {...attrs} className={Css.sideCol()}>
          <RouteBar />

          <Grid container justifyContent="center" style={{ height: "100vh" }}>
            {/* Empty Grid item for spacing */}
            <Grid item xs={false} sm={false} md={3} />

            <Grid item className={Css.divider()}>
              <Divider orientation="vertical" />
            </Grid>

            <Grid item xs={12} sm={6} md={3} className={Css.centerCol()} style={{ padding: "20px" }}>
              {/* Title and Filter Toggle */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                  <CheckCircleIcon color={filterDone ? "primary" : "disabled"} />
                </IconButton>
              </div>

              {/* Button to add a new item */}
              {!addingItem && (
                <Button variant="contained" color="primary" onClick={() => setAddingItem(true)}>
                  <Lsi import={importLsi} path={["ShoppingList", "addNewItem"]} />
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
                {visibleItems.map((item) => (
                  <ListItem
                    key={item.id}
                    className={Css.listItem()}
                    style={{ textDecoration: item.done ? "line-through" : "none" }}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={item.name}
                      style={{ textDecoration: item.done ? "line-through" : "none" }}
                      onClick={() => toggleItemStatus(item.id)}
                    />
                  </ListItem>
                ))}
              </List>

              {/* Pie Chart */}
              <h2>Done tasks statistics</h2>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <PieChart width={400} height={400}>
                  <Pie
                    data={chartData}
                    cx={200}
                    cy={200}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </Grid>

            <Grid item className={Css.divider()}>
              <Divider orientation="vertical" />
            </Grid>

            <Grid item xs={12} sm={6} md={3} style={{ padding: "20px" }}>
              {/* User Access List Component */}
              <div className={Css.titleContainer()}>
                <h2 style={{ padding: "7px 0 0 0" }}>Members</h2>
              </div>
              <UserAccessList />
            </Grid>

            {/* Another empty Grid item for spacing */}
            <Grid item xs={false} sm={false} md={3} />
          </Grid>
        </div>
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
