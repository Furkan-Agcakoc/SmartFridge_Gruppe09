class Method extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      alertMessage: "",
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      showAlert: false,
    });
  };

  triggerAlert = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: message,
    });
  };

  handleClickOpenDialog = (id, type) => {
    console.log(`Dialog opened for ${type} ID:`, id);
    const dialogText = dialogConfirmText[type];
    if (!dialogText) return;

    const dialogTitle = dialogText.title;
    const dialogDescription = dialogText.description;
    const dialogConfirmButtonText = dialogText.confirmButtonText;

    if (type === "grocery") {
      this.setState({ groceryIdToDelete: id });
    } else if (type === "recipe") {
      this.setState({ recipeIdToDelete: id });
    } else if (type === "household") {
      this.setState({ householdIdToDelete: id });
    }

    this.setState({
      dialogopen: true,
      dialogTitle,
      dialogDescription,
      dialogConfirmButtonText,
    });
  };

  handleCloseDialog = () => {
    this.setState({
      dialogopen: false,
      dialogTitle: "",
      dialogDescription: "",
      dialogConfirmButtonText: "",
      groceryIdToDelete: null,
      recipeIdToDelete: null,
      householdIdToDelete: null,
      
    });
  };

  handleConfirmDelete = () => {
    const { groceryIdToDelete, recipeIdToDelete, householdIdToDelete } =
      this.state;

    if (groceryIdToDelete) {
      console.log("Deleting grocery with ID:", groceryIdToDelete);
      // Hier können Sie Ihre Löschlogik für das Lebensmittel einfügen
    } else if (recipeIdToDelete) {
      console.log("Deleting recipe with ID:", recipeIdToDelete);
      // Hier können Sie Ihre Löschlogik für das Rezept einfügen
    } else if (householdIdToDelete) {
      console.log("Deleting household with ID:", householdIdToDelete);
      // Hier können Sie Ihre Löschlogik für das Haushalt einfügen
    }

    this.handleCloseDialog();
  };

  updateObject = () => {
    console.log("App.js => Object updated");
  };

  handleAnchorClick = () => {
    console.log("App.js => Object-Menu-Button clicked");
  };

  handleAnchorClose = () => {
    console.log("App.js => Object-Menu closed");
  };

  handleAnchorEdit = () => {
    console.log("App.js => Object-Menu: Edit clicked");
  };

  handleAnchorDelete = () => {
    console.log("App.js => Object-Menu: Delete clicked");
  };

  handleClickOpenDialog = () => {
    console.log("App.js => Dialog-Window opend");
  };

  handleCloseDialog = () => {
    console.log("App.js => Dialog-Window closed");
  };

  handleDeleteDialog = () => {
    console.log("App.js => Dialog-Window confirm deletion");
  };

  

  render() {
    return <></>;
  }
}

export default Method;


// -------------Old Householdpage---------------------------------------
// import React, { Component } from "react";
// import TitleHH from "../household/TitleHousehold";
// import Typography from "@mui/material/Typography";
// import { Box } from "@mui/material";
// import AddHomeWorkRoundedIcon from "@mui/icons-material/AddHomeWorkRounded";
// import Tooltip from "@mui/material/Tooltip";
// // import PopupHousehold from "../household/PopupHousehold";
// // import EditHouseholdPopup from "../household/EditHouseholdPopup";
// import HouseholdDialog from "../household/HouseholdDialog";
// import DeleteConfirmationDialog from "../dialogs/DeleteConfirmationDialog";
// import HouseholdAnchor from "../household/HouseholdAnchor";
// // import Alert from "@mui/material/Alert";

// class Household extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // popupOpen: false,
//       // householdCount: 0,
//       // households: [],
//       // householdName: "",
//       // showAlert: false,
//       // anchorEls: {},
//       // openMenus: {},
//       // currentlyEditing: null,
//       // dialogopen: false,
//       // householdIdToDelete: null, // New state to store householdId
//     };

//     this.emails = [
//       "furkana.gs2002@gmail.com",
//       "meayavuz@gmail.com",
//       "baran2323a@gmail.com",
//       "derzockerlp63@gmail.com",
//       "sead.shat@gmail.com",
//     ];
//   }

//   // openPopup = () => {
//   //   this.setState({
//   //     popupOpen: true,
//   //     currentlyEditing: null,
//   //   });
//   // };

//   // closePopup = () => {
//   //   this.setState({ popupOpen: false, currentlyEditing: null });
//   // };

//   // handleChange = (event) => {
//   //   this.setState({
//   //     currentName: event.target.value,
//   //     showAlert: false,
//   //   });
//   // };

//   // handleCloseAlert = () => {
//   //   this.setState({ showAlert: false });
//   // };

//   // handleClickOpenDialog = (householdId) => {
//   //   this.setState({
//   //     dialogopen: true,
//   //     householdIdToDelete: householdId,
//   //   });
//   //   this.handleAnchorClose(householdId);
//   // };

//   handleCloseDialog = () => {
//     this.setState({ dialogopen: false });
//   };

//   handleConfirmDelete = () => {
//     const { householdIdToDelete } = this.state;
//     if (householdIdToDelete !== null) {
//       this.handleAnchorDelete(householdIdToDelete);
//     }
//     this.handleCloseDialog();
//   };

//   // handleCreateHousehold = () => {
//   //   const { currentName, currentlyEditing, households } = this.state;

//   //   if (currentName.trim() === "") {
//   //     this.setState({ showAlert: true });
//   //     return;
//   //   }

//   //   if (currentlyEditing !== null) {
//   //     // Edit existing household
//   //     this.setState({
//   //       households: this.updateHousehold({
//   //         householdId: currentlyEditing,
//   //         householdName: currentName,
//   //         emails: [],
//   //       }),
//   //       popupOpen: false,
//   //       currentName: "",
//   //       showAlert: false,
//   //       currentlyEditing: null,
//   //     });
//   //   } else {
//   //     // Create new household
//   //     const id = households.length + 1;
//   //     console.log("new household");

//   //     this.setState((prevState) => {
//   //       const newHouseholds = [
//   //         ...prevState.households,
//   //         {
//   //           householdId: id,
//   //           householdName: currentName,
//   //           emails: [],
//   //         },
//   //       ];
//   //       const newOpenMenus = { ...prevState.openMenus, [id]: false };
//   //       console.log(newHouseholds);

//   //       return {
//   //         householdCount: prevState.householdCount + 1,
//   //         popupOpen: false,
//   //         households: newHouseholds,
//   //         currentName: "",
//   //         showAlert: false,
//   //         openMenus: newOpenMenus,
//   //       };
//   //     });
//   //   }
//   // };

//   // updateHousehold(household) {
//   //   const updatedHouseholds = this.state.households.map((e) => {
//   //     if (household.householdId === e.householdId) {
//   //       return household;
//   //     }
//   //     return e;
//   //   });
//   //   return updatedHouseholds;
//   // }

//   // handleAnchorClick = (householdId, event) => {
//   //   this.setState((prevState) => {
//   //     const newOpenMenus = { ...prevState.openMenus, [householdId]: true };
//   //     const newAnchorEls = {
//   //       ...prevState.anchorEls,
//   //       [householdId]: event.target,
//   //     };
//   //     return {
//   //       anchorEls: newAnchorEls,
//   //       openMenus: newOpenMenus,
//   //     };
//   //   });
//   // };

//   // handleAnchorClose = (householdId) => {
//   //   this.setState((prevState) => {
//   //     const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
//   //     return {
//   //       openMenus: newOpenMenus,
//   //     };
//   //   });
//   // };

//   // handleAnchorEdit = (household) => {
//   //   this.setState((prevState) => {
//   //     const newOpenMenus = {
//   //       ...prevState.openMenus,
//   //       [household.householdId]: false,
//   //     };
//   //     return {
//   //       currentlyEditing: household.householdId,
//   //       currentName: household.householdName,
//   //       openMenus: newOpenMenus,
//   //     };
//   //   });
//   // };

//   // handleAnchorDelete = (householdId) => {
//   //   this.setState((prevState) => {
//   //     const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
//   //     const newHouseholds = prevState.households.filter(
//   //       (h) => h.householdId !== householdId
//   //     );
//   //     return {
//   //       households: newHouseholds,
//   //       openMenus: newOpenMenus,
//   //     };
//   //   });
//   // };

//   render() {
//     // const {
//     // households,
//     // showAlert,
//     // currentlyEditing,
//     // anchorEls,
//     // openMenus,
//     // dialogopen,
//     // currentName,
//     // } = this.state;

//     const {
//       households,
//       anchorEls,
//       openMenus,
//       popupOpen,
//       openPopup,
//       showAlertComponent,
//       dialogopen,
//       isEditMode,
//       currentlyEditing,
//     } = this.props;

//     const editingHousehold = currentlyEditing
//       ? households.find((h) => h.householdId === currentlyEditing)
//       : null;

//     // const showAlertComponent = showAlert && (
//     //   <Alert severity="error" sx={{ marginBottom: "20px" }}>
//     //     Bitte geben Sie einen Haushaltsnamen ein!
//     //   </Alert>
//     // );

//     return (
//       <>
//         <TitleHH />
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             position: "relative",
//             top: "150px",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "flex-start",
//               gap: "10px",
//               alignItems: "center",
//               width: "1100px",
//               height: "300px",
//             }}
//           >
//             <Typography
//               variant="h5"
//               fontSize={"24.2px"}
//               fontWeight={600}
//               sx={{ color: "third.main", width: "1000px" }}
//             >
//               Dein Haushalt, deine Regeln! Erstelle einen individuellen Raum für
//               deine Lebensmittel!
//             </Typography>
//             <Box
//               sx={{
//                 display: "flex",
//                 width: "100%",
//                 justifyContent: "flex-start",
//                 gap: "50px",
//                 maxWidth: "1000px",
//                 flexWrap: "wrap",
//                 paddingBottom: "200px",
//               }}
//             >
//               <Tooltip
//                 title="Neuen Haushalt hinzufügen"
//                 placement="bottom"
//                 arrow
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     width: "200px",
//                     height: "125px",
//                     borderRadius: "10px",
//                     boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
//                     backgroundColor: "transparent",
//                     color: "primary.main",
//                     border: "3px solid #13a88a",
//                     "&:hover": {
//                       color: "success.dark",
//                       backgroundColor: "rgba(29, 151, 35, 0.2)",
//                       border: "3px solid #06871D",
//                     },
//                   }}
//                   onClick={() => openPopup(false)}
//                 >
//                   <AddHomeWorkRoundedIcon
//                     sx={{ width: "75px", height: "auto" }}
//                   />
//                 </Box>
//               </Tooltip>
//               <HouseholdAnchor
//                 households={households}
//                 handleAnchorClick={this.props.handleAnchorClick}
//                 handleAnchorClose={this.props.handleAnchorClose}
//                 handleAnchorEdit={this.props.handleAnchorEdit}
//                 handleClickOpenDialog={this.props.handleClickOpenDialog}
//                 anchorEls={anchorEls}
//                 openMenus={openMenus}
//                 openPopup={this.props.openPopup}
//               />
//             </Box>
//             {popupOpen && (
//               <HouseholdDialog
//                 isEditMode={isEditMode}
//                 householdName={
//                   editingHousehold ? editingHousehold.householdName : ""
//                 }
//                 // householdEmails={householdEmails}
//                 closePopup={this.props.closePopup}
//                 handleCreateObject={this.props.handleCreateObject}
//                 handleInvalid={this.props.handleInvalid}
//                 handleInput={this.props.handleInput}
//                 showAlertComponent={showAlertComponent}
//                 households={households}
//                 openPopup={this.props.openPopup}
//               />
//             )}
//             {/* {popupOpen && (
//               <PopupHousehold
//                 // handleChange={this.handleChange}
//                 handleInvalid={this.props.handleInvalid}
//                 handleInput={this.props.handleInput}
//                 handleCreateObject={this.props.handleCreateObject}
//                 // closePopup={this.closePopup}
//                 closePopup={this.props.closePopup}
//                 showAlertComponent={showAlertComponent}
//               />
//             )} */}
//             {/* {currentlyEditing !== null && (
//               <EditHouseholdPopup
//                 // handleChange={this.handleChange}
//                 handleChange={this.props.handleChange}
//                 handleCreateHousehold={this.handleCreateHousehold}
//                 closePopup={this.closePopup}
//                 emails={this.emails}
//                 currentName={currentName}
//                 // showAlert={this.state.props.showAlert}
//               />
//             )} */}
//             {dialogopen && (
//               <DeleteConfirmationDialog
//                 handleCloseDialog={this.handleCloseDialog}
//                 handleConfirmDelete={this.handleConfirmDelete}
//               />
//             )}
//           </Box>
//         </Box>
//       </>
//     );
//   }
// }

// export default Household;
const dialogConfirmText = {
  houeshold: {
    title: "Haushalt löschen bestätigen",
    description:
      "Sind Sie sicher, dass Sie dieses Haushalt löschen möchten? Alle Mitglieder, der Kühlschrankinhalt und alle gespeicherten Rezepte werden dauerhaft entfernt. Diese Aktion kann nicht rückgängig gemacht werden.",
    // confirmButtonText: "Löschen",
  },
  grocery: {
    title: "Lebensmittel löschen bestätigen",
    description:
      "Sind Sie sicher, dass Sie dieses Lebensmittel löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    // confirmButtonText: "Löschen",
  },
  recipe: {
    title: "Rezept löschen bestätigen",
    description:
      "Sind Sie sicher, dass Sie dieses Rezept löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    // confirmButtonText: "Löschen",
  },
};


// ----FridgePage------------------------------


handleCreateGroceries = (groceryData) => {
  const { currentlyEditing, groceries } = this.state;

  if (currentlyEditing !== null) {
    console.log("Editing grocery ID:", currentlyEditing);
    // Edit existing grocery
    this.setState({
      groceries: this.updateGrocery({
        groceryId: currentlyEditing,
        groceryName: groceryData.name,
        groceryQuantity: groceryData.quantity,
        groceryUnit: groceryData.unit,
      }),
      popupGroceryOpen: false,
      recipeData: {
        name: "",
        quantity: "",
        unit: "",
      },
      // showAlert: false,
      currentlyEditing: null,
    });
  } else {
    const id = groceries.length + 1;
    console.log("Creating grocery:", groceries);
    console.log(groceryData);
    // Code to create a new grocery
    this.setState((prevState) => {
      const newGroceries = [
        ...prevState.groceries,
        {
          groceryId: id,
          groceryName: groceryData.name,
          groceryQuantity: groceryData.quantity,
          groceryUnit: groceryData.unit,
        },
      ];
      const newOpenMenus = { ...prevState.openMenus, [id]: false };
      console.log(newGroceries);
      console.log(newOpenMenus);

      return {
        groceryCount: prevState.groceryCount + 1,
        popupGroceryOpen: false,
        groceries: newGroceries,
        recipeData: {
          name: "",
          quantity: "",
          unit: "",
        },
        openMenus: newOpenMenus,
      };
    });
  }
};


handleAnchorClickRecipe = (recepyId, event) => {
  console.log("Anchor clicked for grocery ID:", recepyId);
  this.setState((prevState) => {
    const newOpenMenus = { ...prevState.openMenus, [recepyId]: true };
    const newAnchorEls = {
      ...prevState.anchorEls,
      [recepyId]: event.target,
    };
    console.log("newOpenMenus:", newOpenMenus);
    return {
      anchorEls: newAnchorEls,
      openMenus: newOpenMenus,
    };
  });
};

handleAnchorCloseRecipe = (recepyId) => {
  console.log("Anchor closed for grocery ID:", recepyId);
  this.setState((prevState) => {
    const newOpenMenus = { ...prevState.openMenus, [recepyId]: false };
    return {
      openMenus: newOpenMenus,
    };
  });
};

handleAnchorEditRecipe = (recipe) => {
  console.log("Editing recipe:", recipe);
  console.log(this.state.recipeData);
  this.setState((prevState) => {
    const newOpenMenus = {
      ...prevState.openMenus,
      [recipe.recipeId]: false,
    };
    // Log the previous state
    console.log("Previous state:", prevState);
    // Log the new openMenus object
    console.log("New openMenus:", newOpenMenus);
    // Log the values being set for currentlyEditingRecipe and other states
    console.log("Currently editing recipe ID:", recipe.recipeId);
    console.log("Current ingredient:", {
      amount: recipe.recipeIngredientsAmount,
      unit: recipe.recipeIngredientsUnit,
      name: recipe.recipeIngredientsName,
    });
    console.log("Rezeptenliste: ", recipe);
    console.log("Recipe data:", {
      title: recipe.recipeTitle,
      duration: recipe.recipeDuration,
      servings: recipe.recipeServings,
      instructions: recipe.recipeInstructions,
      ingredients: recipe.recipeIngredients,
    });

    return {
      currentlyEditingRecipe: recipe.recipeId,
      currentIngredient: {
        amount: recipe.recipeIngredientsAmount,
        unit: recipe.recipeIngredientsUnit,
        name: recipe.recipeIngredientsName,
      },
      recipeData: {
        title: recipe.recipeTitle,
        duration: recipe.recipeDuration,
        servings: recipe.recipeServings,
        instructions: recipe.recipeInstructions,
        ingredients: recipe.recipeIngredients,
      },
      openMenus: newOpenMenus,
    };
  });
};