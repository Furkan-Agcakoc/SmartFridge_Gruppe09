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
