const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const app = express();

const jwt=require("jsonwebtoken");
const JWT_SECRET = "asadjaisdw923hgjjhgjh@43gfx82"
const mongoUrl = "mongodb+srv://shubhammali929:Shubham123@cluster0.5jvfp3i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.use(cors());
app.use(express.json());

const UserDetailsSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    pass: String,
  },
  {
    collection: "UserInfo",
  }
);
mongoose.model("UserInfo", UserDetailsSchema);

const SavedLocationSchema = new mongoose.Schema(
  {
    name: String,
    vicinity: String,
    lat: Number,
    lng: Number,
    place_id: String,
    userEmail: { type: String, ref: 'UserInfo' } 
    // Reference to the email of the user who saved the location
  },
  {
    collection: "SavedLocations",
  }
);
mongoose.model("SavedLocation", SavedLocationSchema);




mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("connected to database");
}).catch(e => console.log(e));

const UserInfo = mongoose.model("UserInfo", UserDetailsSchema);
const SavedLocation = mongoose.model("SavedLocation", SavedLocationSchema);





app.post('/register', async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    if (!name || !email || !pass) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const oldUser = await UserInfo.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    await UserInfo.create({ name, email, pass });
    res.status(201).json({ status: "success" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




app.post('/login', async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserInfo.findOne({ email });
    if (!user) return res.json({ error: "User Not found" });
    if (pass === user.pass) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET);
      if (res.status(201)) return res.json({ status: "success", token: token });
      else return res.json({ error: "error" });
    } else {
      return res.json({ status: "error", error: "Invalid password" });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/userData', async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    const userData = await UserInfo.findOne({ email: useremail });
    if (userData) {
      res.send({ status: "success", data: userData });
    } else {
      res.status(404).send({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});


app.get('/api/places', async (req, res) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${new URLSearchParams(req.query)}&key=${process.env.REACT_APP_PLACES_AND_MAP_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






app.post('/user/favorite-place', async (req, res) => { //for saving locations
  const { email, savedLocation } = req.body;
  const { name, vicinity, lat, lng, place_id } = savedLocation;
  try {
    const user = await UserInfo.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newSavedLocation = new SavedLocation({
      name,
      vicinity,
      lat,
      lng,
      place_id,
      userEmail: email // Link the saved location with the user's email
    });
    await newSavedLocation.save();
    res.json({ status: "success" });
  } catch (error) {
    console.error('Error adding favorite place:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/user/favorite-places', async (req, res) => {
  const { userEmail } = req.query;
  try {
    const savedLocations = await SavedLocation.find({ userEmail });
    res.json({ savedLocations }); // Ensure response is sent as JSON
  } catch (error) {
    console.error('Error fetching saved locations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.get('/user/saved-locations', async (req, res) => {
//   const { userEmail } = req.query;
//   try {
//     const user = await UserInfo.findOne({ email: userEmail });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     const savedLocations = await SavedLocation.find({ userEmail });
//     res.json({ status: "success", savedLocations });
//   } catch (error) {
//     console.error('Error retrieving saved locations:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




