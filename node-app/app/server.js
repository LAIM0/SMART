const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

// Assign environment variables
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHostname = process.env.MONGO_HOSTNAME;
const mongoPort = process.env.MONGO_PORT;

const mongoDb = process.env.MONGO_DB;
const mongoUri = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHostname}:${mongoPort}/${mongoDb}`;
console.log(mongoUri)

/**
 * Setup services
 */

// Initiliase an express server
const app = express();
app.use(cors());

// Options to pass to mongodb to avoid deprecation warnings
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  authSource: "admin" // Souvent nécessaire si vous avez spécifié un utilisateur admin pour MongoDB
};

// Function to connect to the database
const conn = () => {
  mongoose.connect(
    mongoUri,
    options
  );
};
// Call it to connect
conn();

// Handle the database connection and retry as needed
const db = mongoose.connection;
db.on("error", err => {
  console.log("There was a problem connecting to mongo: ", err);
  console.log("Trying again");
  setTimeout(() => conn(), 5000);
});
db.once("open", () => console.log("Successfully connected to mongo"));

// Setup routes to respond to client
app.get("/welcome", async (req, res) => {
  console.log("Client request received");
  const user = await User.find().exec();
  console.log(user[0].name);
  res.send(
    `Hello Client! There is one record in the database for ${user[0].name}`
  );
});

// Setup a record in the database to retrieve
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

// Nom de l'utilisateur à ajouter
const userName = "Big Bill Brown";

// Vérifier d'abord si l'utilisateur existe déjà
User.findOne({ name: userName })
  .then(userFound => {
    if (userFound) {
      // L'utilisateur existe déjà, afficher un message et ne pas enregistrer le nouvel utilisateur
      console.log(`L'utilisateur ${userName} existe déjà`);
    } else {
      // L'utilisateur n'existe pas, créer et enregistrer le nouvel utilisateur
      const user = new User({ name: userName });
      return user.save(); // Sauvegarder le nouvel utilisateur et retourner la promesse pour le chaînage
    }
  })
  .then(user => {
    if (user) {
      // Si un nouvel utilisateur a été sauvegardé, afficher un message de confirmation
      console.log(`${user.name} saved to the database`);
    }
    // Si l'utilisateur existait déjà, cette partie du code ne sera pas exécutée
  })
  .catch(err => console.log(err)); // Gérer les erreurs potentielles

app.listen(3001, () => console.log(`Listening on port ${3001}`));
