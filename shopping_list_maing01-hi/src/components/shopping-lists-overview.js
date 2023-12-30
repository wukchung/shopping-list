//@@viewOn:imports
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { createVisualComponent, useRoute, Lsi } from "uu5g05";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useShoppingList } from '../contexts/ShoppingListContext';
import importLsi from "../lsi/import-lsi.js";
import Css from "../routes/css/common";

//@@viewOff:imports

//@@viewOn:statics
const TAG = "ShoppingListsOverview";
//@@viewOff:statics

let ShoppingListsOverview = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: TAG,
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newListName, setNewListName] = useState("");

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedListId, setSelectedListId] = useState(null);

    const { shoppingLists, setShoppingLists } = useShoppingList();

    //@@viewOff:hooks

    //@@viewOn:private
    const [, setRoute] = useRoute();

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setNewListName("");
    };

    const handleAddList = (event) => {
      event.preventDefault();
      if (newListName.trim() !== "") {
        const newList = {
          id: Date.now(), // Simple ID generation
          name: newListName
        };
        setShoppingLists([...shoppingLists, newList]);
        setNewListName(""); // Reset the input field
      }
      setIsModalOpen(false); // Close the modal
    };

    const handleNewListNameChange = (event) => {
      setNewListName(event.target.value);
    };

    const handleDeleteClick = (listId) => {
      setSelectedListId(listId);
      setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
      setShoppingLists(shoppingLists.filter(list => list.id !== selectedListId));
      handleCloseDeleteConfirm();
    };

    const handleCloseDeleteConfirm = () => {
      setDeleteConfirmOpen(false);
      setSelectedListId(null);
    };

    //@@viewOff:private

    //@@viewOn:render
    return (
      <div>
        <h1 className={Css.title()}>
          <Lsi import={importLsi} path={["ShoppingList", "listTitle"]} />
        </h1>
        <Button style={{ marginBottom: "20px" }} variant="contained" color="primary" onClick={handleOpenModal}>
          Add New List
        </Button>

        <Grid container spacing={2}>
          {shoppingLists.map((list) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={list.id}>
              <Card>
                <CardContent className={Css.card()}>
                  <Typography variant="h5" component="h2">
                    {list.name}
                  </Typography>
                  {/* Additional list details can go here */}
                </CardContent>
                <CardActions className={Css.cardAction()}>
                  <Button size="small" onClick={() => setRoute(`detail?listId=${list.id}`)}>
                    <Lsi import={importLsi} path={["ShoppingList", "open"]} />
                  </Button>
                  <IconButton onClick={() => handleDeleteClick(list.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Modal for adding new shopping list */}
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }} // Center the modal
        >
          <div style={{ backgroundColor: "black", padding: "20px", outline: "none", borderRadius: "4px" }}>
            {/* Modal content: form to add a new list */}
            <form onSubmit={handleAddList}>
              <TextField
                name="listName"
                label="List Name"
                value={newListName}
                onChange={handleNewListNameChange}
                variant="outlined"
                fullWidth
                required
              />
              <Button type="submit" color="primary" variant="contained" style={{ marginTop: "20px" }}>
                <Lsi import={importLsi} path={["ShoppingList", "addList"]} />
              </Button>
            </form>
          </div>
        </Modal>

        {/* Confirmation dialog for deletion */}
        <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
          <DialogTitle>{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Lsi import={importLsi} path={["ShoppingList", "deleteConfirmText"]} />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteConfirm} color="primary">
              <Lsi import={importLsi} path={["ShoppingList", "deleteCancel"]} />
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              <Lsi import={importLsi} path={["ShoppingList", "deleteConfirm"]} />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
    //@@viewOff:render
  }
});

//@@viewOn:exports
export default ShoppingListsOverview;
//@@viewOff:exports
