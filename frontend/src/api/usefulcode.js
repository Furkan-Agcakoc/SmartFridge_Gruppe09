  async getLatestUserID() {
    try {
      const res = await SmartFridgeAPI.getAPI().getUser(); // Fetch all users
      const latestID = res[res.length - 1].id;
      return parseInt(latestID) + 1;
    } catch (e) {
      this.setState({ error: e });
    }
  }

  async getAllUsers() {
    try {
      const res = await SmartFridgeAPI.getAPI().getUser(); // Fetch all users
      return res;
    } catch (e) {
      this.setState({ error: e });
    }
  }

  async addUser(firebaseUser) {
    const users = await this.getAllUsers();
    if (users.find((user) => user.email === firebaseUser.email) === undefined) {
      const latestUserID = await this.getLatestUserID();
      this.setState({ authLoading: true });
      try {
        const rb = {
          id: latestUserID,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          firebase_id: firebaseUser.uid,
          location: "Stuttgart, Vaihingen",
        };
        const requestBody = JSON.stringify(rb);
        const rInit = {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        };
        const resp = await fetch(Config.apiHost + "/user", rInit);
        if (resp.ok) {
          await window.location.reload();
          this.setState({ authLoading: false });
        }
      } catch (e) {
        this.setState({ error: e });
      }
    }
  }

  getUserByGid = (currentUser) => {
    return SmartFridgeAPI.getAPI()
      .getUserByGoogleId(currentUser.uid)
      .then((user) => {
        this.setState({
          user: user,
          loadingInProgress: false,
          loadingError: null,
        });
        return user; // Return the user data
      })
      .catch((e) => {
        this.setState({
          user: null,
          loadingInProgress: false,
          loadingError: e,
        });
        throw e; // Throw the error
      });
  };
