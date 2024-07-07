# SmartFridge_Gruppe09 - SMART FRIDGE

Hochschule der Medien - Modul Software Praktikum (335138b) - Gruppe 9 - Sommersemester 2024

<p align="center">
<img href="http://smart-fridge.com" src="frontend/src/images/Fridge_logo.png" width="200">
<p>

## Contributors

[Furkan Agcakoc](https://github.com/Furkan-Agcakoc)<br>
[Mustafa Aslan](https://github.com/MustafaAslan55)<br>
[Baran Kocabey](https://github.com/Baran-Kocabey)<br>
[Sead Shatrolli](https://github.com/Sead-Shatrolli)<br>
[Mehmet-Akif Yavuz](https://github.com/Mehmet-Akif-Yavuz)<br>

## Table of Contents

- [SmartFridge_Gruppe09 - SMART FRIDGE"](#smartfridge_gruppe09---smart-fridge)
  - [Contributors](#contributors)
  - [Table of Contents](#table-of-contents)
- [Frontend Setup](#frontend-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Backend - Python / Flask](#backend---python--flask)
  - [Prerequisites](#prerequisites-1)
  - [Installation](#installation-1)
- [Database - MySQL](#database---mysql)
- [Deployment on Google Cloud](#deployment-on-google-cloud)

# Frontend Setup

This project uses React and Material-UI for the frontend.<br>
Follow these steps to set up and start the project.

## Prerequisites

Make sure you have Node.js and npm installed on your machine. You can download Node.js from [here](https://nodejs.org/).

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Furkan-Agcakoc/SmartFridge_Gruppe09.git
   ```
2. Navigate to the project directory:
   ```
   cd frontend
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

# Backend - Python / Flask

This project uses Python and Flask for the backend. Follow these steps to set up and start the backend server.

## Prerequisites

Make sure you have Python 3.7 or higher installed on your machine. You can download Python from [here](https://www.python.org/downloads/).

## Installation

1. Navigate to the backend directory:
   ```
   cd src
   ```
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```
4. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Run the main application:
   ```
   python main.py
   ```

# Database - MySQL

- MySQL Community Server 8.0.20:
  - Download the latest Community server for your OS from here https://dev.mysql.com/downloads/mysql/
  - Setup the database and import our database dump
- Google Cloud SQL:
  This requires the Google Cloud SDK & Google Cloud Proxy.
  See Google Documentation for install methods.
  Connection String for Proxy to get secure access to the Google Environment:

  ```
  ./cloud_sql_proxy -instances=smart-fridge-sopra:europe-west3:sopra-db-smartfridge=tcp:3306

  ```

  This method will only work, if we assign you to the project team and grant you access.

Depending on the configuration you chose, you need to update the connection string inside the mapper.py / SmartFridgeAPI.js


## Deployment on Google Cloud

Google App Engine Standard Environment is on NodeJS Version 11.  
See the `.yaml` file for additional configuration.

React requires an extra build step to generate static files for deployment, which are located in a separate folder. This needs to be done after every change to the JavaScript files.

To update the deployed version of the frontend code, follow these steps:

1. Navigate to the `/frontend` directory:
    ```sh
    cd frontend
    ```
2. Build the project:
    ```sh
    npm run build
    ```
3. Deploy the application:
    ```sh
    gcloud app deploy
    ```
4. Open the deployed application in your browser:
    ```sh
    gcloud app browse
    ```

