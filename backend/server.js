require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
 // Adjust for frontend URL

const app = express();
const PORT = process.env.PORT || 5000; // Use env PORT or default 5000
app.use(cors({ origin: "http://localhost:3000" }));
// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false, // Disable logging SQL queries
  }
);

// Database Connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected..."))
  .catch((err) => console.error("❌ Error connecting to the database:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Models
const Project = sequelize.define("Project", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  link: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: false },
});

const Contact = sequelize.define("Contact", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
});

// Sync Database
sequelize
  .sync()
  .then(() => console.log("✅ Database synced successfully"))
  .catch((err) => console.error("❌ Error syncing database:", err));

// Routes
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error fetching projects" });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Error creating project" });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.json({ message: "Message received!", contact });
  } catch (error) {
    res.status(500).json({ error: "Error saving contact message" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
