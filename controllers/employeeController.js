const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Employee = require("../models/employeeModel");

/**
 *  LOGIN EMPLOYEE
 */
const loginEmployee = async (req, res) => {
  const { username, password } = req.body;
  try {
    const employee = await Employee.findOne({ username });
    if (!employee) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: employee._id, username: employee.username, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      employee: {
        id: employee._id,
        username: employee.username,
        role: employee.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 *  ADD EMPLOYEE
 *  (Admin-only action)
 */
const addEmployee = async (req, res) => {
  try {
    // 1️⃣ Validate that the logged-in user is an admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { username, password, role } = req.body;

    // 2️⃣ Simple validation
    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Optional: only allow alphanumeric usernames
    const usernamePattern = /^[A-Za-z0-9_]{3,20}$/;
    if (!usernamePattern.test(username))
      return res.status(400).json({ message: "Invalid username format" });

    // 3️⃣ Check if username already exists
    const existing = await Employee.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Username already exists" });

    // 4️⃣ Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5️⃣ Create new employee document
    const newEmployee = new Employee({
      username,
      password: hashedPassword,
      role: role || "employee",
    });

    await newEmployee.save();

    // 6️⃣ Respond success
    res.status(201).json({
      message: "Employee added successfully",
      employee: {
        id: newEmployee._id,
        username: newEmployee.username,
        role: newEmployee.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginEmployee, addEmployee };
