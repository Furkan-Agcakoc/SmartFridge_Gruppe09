import React from 'react';
import Popup from '../dialogs/Popup';
import SmartFridgeAPI from '../../api/SmartFridgeAPI';
import HouseholdBO from '../../api/HouseholdBO';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { UserBO } from '../../api';

class HouseholdCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      fridgeId: null,
      person_id: null,
    };
  }

  addHousehold = () => {
    let newHousehold = new HouseholdBO(this.state.title, parseInt(this.state.fridgeId));
    SmartFridgeAPI.getAPI().addHousehold(newHousehold)
      .then(household => {
        this.setState({
          title: '',
          person_id: null
        });
        this.props.onClose(household);
        this.props.setTrigger(false); // Schließen des Popups nach dem Hinzufügen
        this.updateUser(household)
      })
      .catch(e => console.error(e));
  }

  updateUser = (household) => {
    let updatedUser = Object.assign(new UserBO, this.props.user)
    updatedUser.setHouseholdId(household.id)

    SmartFridgeAPI.getAPI().updateUser(updatedUser).then((user)=>{
      console.log("HIER WAR ICH")
      this.props.updateHousehold(household)
    })
  }

  titleValueChange = (event) => {
    const value = event.target.value;
    this.setState({
      title: value
    });
  }

  render() {
    const { trigger, setTrigger } = this.props;
    const { title } = this.state;

    return (
      trigger ?
        <Popup open={trigger} setTrigger={setTrigger}>
          <h2>Household Erstellen</h2>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off">
            <TextField
              label="Householdname"
              variant="outlined"
              id="title"
              size="small"
              onChange={this.titleValueChange}
              type="text"
              name="Householdname"
              placeholder="Householdname"
              value={title}
              required />
            <Button
              onClick={this.addHousehold}
              variant="contained"
              type="button">Hinzufügen</Button>
          </Box>
        </Popup>
        : null
    );
  }
}

export default HouseholdCreate;