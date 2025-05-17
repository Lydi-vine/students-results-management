const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 1234;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "SOS_MIS"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database SOS_MIS");
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("🎓 Welcome to SOS THS Backend Server");
});

//Register new user
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  const checkSql = "SELECT * FROM users WHERE username = ?";
  db.query(checkSql, [username], (err, results) => {
    if (err) {
      console.error("Error checking username:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: "Username already taken" });
    }

    const insertSql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(insertSql, [username, password], (insertErr, result) => {
      if (insertErr) {
        console.error("Error inserting user:", insertErr);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }

      res.status(201).json({ success: true, message: "User registered successfully" });
    });
  });
});


// LOGIN user
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", userId: user.user_id });
  });
});

// Create a trade
app.post("/addTrade", (req, res) => {
  const { trade_name } = req.body;

  const sql = "INSERT INTO trades (trade_name) VALUES (?)";
  db.query(sql, [trade_name], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Error adding trade" });
    }
    res.json({ success: true, message: "Trade added successfully" });
  });
});

// Get all trades
app.get("/trades", (req, res) => {
  const sql = "SELECT * FROM trades";
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error retrieving trades" });
    }
    res.json({ trades: rows });
  });
});

// Create a module
app.post("/addModule", (req, res) => {
  const { modname, modcredits } = req.body;

  const sql = "INSERT INTO modules (modname, modcredits) VALUES (?, ?)";
  db.query(sql, [modname, modcredits], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Error adding module" });
    }
    res.json({ success: true, message: "Module added successfully" });
  });
});

// Get all modules
app.get("/modules", (req, res) => {
  const sql = "SELECT * FROM modules";
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error retrieving modules" });
    }
    res.json({ modules: rows });
  });
});

// Add a trainee
app.post('/addTrainee', (req, res) => {
  const { firstnames, lastname, gender, trade_id } = req.body;
  const sql = `
    INSERT INTO trainees (firstnames, lastname, gender, trade_id)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [firstnames, lastname, gender, trade_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Error adding trainee" });
    }
    res.json({ success: true, message: "Trainee added successfully" });
  });
});

// Get all trainees with trade name
app.get('/trainees', (req, res) => {
  const sql = `
    SELECT t.trainee_id, t.firstnames, t.lastname, t.gender, tr.trade_name 
    FROM trainees t 
    JOIN trades tr ON t.trade_id = tr.trade_id
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error retrieving trainees" });
    }
    res.json({ trainees: rows });
  });
});


// Add a mark entry with automatic trade fetching and total marks calculation
app.post('/addMark', (req, res) => {
  const { trainee_id, module_id, user_id, formative_ass, summative_ass, comprehensive_ass } = req.body;

  // Fetch the trade_id of the trainee
  const fetchTraineeSql = 'SELECT trade_id FROM trainees WHERE trainee_id = ?';
  
  db.query(fetchTraineeSql, [trainee_id], (err, trainee) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Error retrieving trainee information" });
    }

    if (trainee.length === 0) {
      return res.status(400).json({ success: false, message: "Trainee not found" });
    }

    const trade_id = trainee[0].trade_id;

    // Calculate the total marks out of 100
    const total_marks_100 = (formative_ass + summative_ass + comprehensive_ass) / 150 * 100;

    // Insert mark entry
    const insertMarkSql = `
      INSERT INTO marks (trainee_id, trade_id, module_id, user_id, formative_ass, summative_ass, comprehensive_ass, total_marks_100)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertMarkSql, [trainee_id, trade_id, module_id, user_id, formative_ass, summative_ass, comprehensive_ass, total_marks_100], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Error adding marks" });
      }
      res.json({ success: true, message: "Marks added successfully" });
    });
  });
});

// View all marks with trainee and module info
app.get('/marks', (req, res) => {
  const sql = `
    SELECT 
        m.mark_id, 
        t.firstnames, 
        t.lastname, 
        m.formative_ass, 
        m.summative_ass, 
        m.comprehensive_ass, 
        m.total_marks_100, 
        tr.trade_name, 
        mo.modname
      FROM marks m
      JOIN trainees t ON m.trainee_id = t.trainee_id
      JOIN trades tr ON t.trade_id = tr.trade_id
      JOIN modules mo ON m.module_id = mo.module_id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching marks" });
    }
    res.json({ marks: rows });
  });
});


// Report Card for one trainee
app.get('/report/:trainee_id', (req, res) => {
  const traineeId = req.params.trainee_id;

  const reportSql = `
    SELECT 
      t.firstnames, t.lastname, tr.trade_name, mo.modname,
      m.formative_ass, m.summative_ass, m.comprehensive_ass, m.total_marks_100
    FROM marks m
    JOIN trainees t ON m.trainee_id = t.trainee_id
    JOIN trades tr ON t.trade_id = tr.trade_id
    JOIN modules mo ON m.module_id = mo.module_id
    WHERE m.trainee_id = ?
  `;

  db.query(reportSql, [traineeId], (err, marks) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error generating report' });
    }

    const total = marks.reduce((acc, m) => acc + m.total_marks_100, 0);
    const average = marks.length > 0 ? total / marks.length : 0;

    res.json({ 
      trainee: marks[0] ? `${marks[0].firstnames} ${marks[0].lastname}` : 'Unknown',
      trade: marks[0]?.trade_name || 'N/A',
      results: marks,
      total,
      average
    });
  });
});


// Improved Module Report with class filter
app.get('/module-report/:module_id', (req, res) => {
  const moduleId = req.params.module_id;

  const sql = `
    SELECT 
      t.firstnames, t.lastname, tr.trade_name, mo.modname,
      m.formative_ass, m.summative_ass, m.comprehensive_ass, m.total_marks_100
    FROM marks m
    JOIN trainees t ON m.trainee_id = t.trainee_id
    JOIN trades tr ON t.trade_id = tr.trade_id
    JOIN modules mo ON m.module_id = mo.module_id
    WHERE m.module_id = ?
  `;

  db.query(sql, [moduleId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching module report' });
    }

    const total = data.reduce((sum, row) => sum + row.total_marks_100, 0);
    const average = data.length > 0 ? total / data.length : 0;

    res.json({
      module: data[0]?.modname || 'Unknown',
      results: data,
      total,
      average
    });
  });
});



// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
