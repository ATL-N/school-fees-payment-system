//0210019016
const session = require("express-session");
const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg"); // Replace 'mysql2' with 'pg' for PostgreSQL
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const pgSession = require("connect-pg-simple")(session);
const saltRounds = 10;
require('dotenv').config();


const app = express();

// const db = mysql.createPool({
//   host: "127.0.0.1",
//   user: "root",
//   password: "12345678",
//   database: "SchoolFeesSystem",
// });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Default PostgreSQL port
  ssl: true,  // Enable SSL
});

// const pool = new Pool({
//   user: "postgres",
//   host: "127.0.0.1",
//   database: "schoolfeessystem",
//   password: 123,
//   port: 5432, // Default PostgreSQL port
// });

const PORT = process.env.PORT || 5050;

// Express middleware setup
app.use(
  cors({
    origin: ["http://localhost:3000", "https://school-fees-payment-system-frontend.onrender.com"],
    // origin: "https://school-fees-payment-system-frontend.onrender.com",
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    store: new pgSession({
      pool,
      tableName: "session",
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'None',
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Session expiration time (e.g., 1 day)
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("server running on port 5050");
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    // Handle the error, e.g., exit the application or return an error response.
  } else {
    console.log("Database connection successful.");

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        return cb(null, "./uploads"); // Specify the destination directory for uploaded files
      },
      filename: (req, file, cb) => {
        // Generate a unique filename for the uploaded file
        const uniqueSuffix = Date.now();
        const fileNameWithoutExt = path.parse(file.originalname).name;
        cb(
          null,
          fileNameWithoutExt +
            "-" +
            uniqueSuffix +
            path.extname(file.originalname)
        );
      },
    });

    const upload = multer({ storage }); // Create a multer instance

    app.get("/home", (req, res) => {
      console.log("home api running");
      if (req.session.userDetails) {
        console.log('req.session.userDetails', req.session.userDetails)
        res.json({ userDetails: req.session.userDetails });
      } else {
        console.log('req.session.userDetails 225555', req.session.userDetails)

        return res.json({ error: "Please sign in to access the page " });

      }
    }); //postgres

    app.post("/api/addStudent", (req, res) => {
      try {
        console.log("REQ BODY", req.body);

        // Extract student details from the request body
        var {
          studentName,
          studentClass,
          classid,
          amountOwed,
          parentNameM,
          parentNameS,
          dateOfBirth,
          gender,
          address,
          customParentNameM,
          customParentNameMTel,
          customParentNameMMail,
          parentNameMAddress,
          custompPrentNameS,
          parentNameSAddress,
          customParentNameSMail,
          customParentNameSTel,
          parentMId,
          parentSId,
          customParentNameMRelation,
          customParentNameSRelation,
          image,
        } = req.body;

        console.log("customParentNameM", customParentNameM);
        // const image = req.file ? req.file.filename : null;
        let useParentNameS;
        let [useParentSId, useParentMId, useStudentId] = "";

        const insertParent = async (
          parentName,
          parentTel,
          parentMail,
          parentAddress
        ) => {
          const sqlInsertParent =
            "INSERT INTO ParentGuardianDetails (ParentName, ContactNumber, Email, ResidenceAddress) VALUES ($1, $2, $3, $4) RETURNING id";
          const values = [parentName, parentTel, parentMail, parentAddress];

          const { rows } = await pool.query(sqlInsertParent, values);
          return rows[0].id;
        };

        const insertStudent = async (paID) => {
          const sqlInsert =
            "INSERT INTO studentDetails (Image, StudentName, ClassName, AmountOwed, DateOfBirth, Gender, Address, ParentID, ClassID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id";
          const values = [
            image,
            studentName,
            studentClass,
            amountOwed,
            dateOfBirth,
            gender,
            address,
            paID,
            classid,
          ];

          const { rows } = await pool.query(sqlInsert, values);
          return rows[0].id;
        };

        const insertParentStudentMapping = async (
          parentid,
          studentid,
          relation
        ) => {
          const sqlInsertMapping =
            "INSERT INTO ParentStudentMapping (ParentId, StudentId, RelationToWard) VALUES($1, $2, $3)";
          const values = [parentid, studentid, relation];

          await pool.query(sqlInsertMapping, values);
        };

        console.log("reached if statement", parentSId, parentMId);

        if (
          parentSId !== "others" &&
          parentMId !== "others" &&
          parentMId !== ""
        ) {
          console.log("useStudentId", "nothers nothers");
          insertStudent(parentMId).then((studentid) => {
            useStudentId = studentid;
            console.log(
              "useStudentId",
              useStudentId,
              studentid,
              "nothers nothers"
            );

            insertParentStudentMapping(
              parentMId,
              useStudentId,
              customParentNameMRelation
            );
            insertParentStudentMapping(
              parentSId,
              useStudentId,
              customParentNameSRelation
            );
          });
        } else if (
          parentSId !== "others" &&
          parentMId == "others" &&
          parentSId !== ""
        ) {
          console.log("useStudentId", "nothers others");
          insertParent(
            customParentNameM,
            customParentNameMTel,
            customParentNameMMail,
            parentNameMAddress
          ).then((parentid) => {
            useParentMId = parentid;
            insertStudent(useParentMId).then((studentid) => {
              useStudentId = studentid;
              console.log(
                "useStudentId",
                useStudentId,
                studentid,
                "nothers nothers"
              );

              insertParentStudentMapping(
                parentSId,
                useStudentId,
                customParentNameSRelation
              );
              insertParentStudentMapping(
                useParentMId,
                useStudentId,
                customParentNameMRelation
              );
            });
          });
        } else if (
          parentSId == "others" &&
          parentMId !== "others" &&
          parentMId !== ""
        ) {
          console.log("useStudentId", "others nothers");
          insertParent(
            custompPrentNameS,
            customParentNameSTel,
            customParentNameSMail,
            parentNameSAddress
          ).then((parentid) => {
            useParentSId = parentid;
            insertStudent(useParentSId).then((studentid) => {
              useStudentId = studentid;
              console.log(
                "useStudentId",
                useStudentId,
                studentid,
                "nothers nothers"
              );

              insertParentStudentMapping(
                useParentSId,
                useStudentId,
                customParentNameSRelation
              );
              insertParentStudentMapping(
                parentMId,
                useStudentId,
                customParentNameMRelation
              );
            });
          });
        } else if (parentSId == "others" && parentMId == "others") {
          async function insertData() {
            try {
              if (parentSId === "others" && parentMId === "others") {
                console.log("useStudentId3", "others others");
                useParentMId = await insertParent(
                  customParentNameM,
                  customParentNameMTel,
                  customParentNameMMail,
                  parentNameMAddress
                );
                // useParentMId = parentIdM;
                console.log("done inserting parent 1", useParentMId);

                const studentId = await insertStudent(useParentMId);
                // insertParent(custompPrentNameS, customParentNameSTel, customParentNameSMail, parentNameSAddress);
                const useStudentId = studentId;
                console.log(
                  "useStudentId",
                  useStudentId,
                  studentId,
                  "nothers nothers"
                );

                const parentIdS = await insertParent(
                  custompPrentNameS,
                  customParentNameSTel,
                  customParentNameSMail,
                  parentNameSAddress
                );
                const useParentSId = parentIdS;
                console.log("done inserting parent 2", useParentSId);

                await insertParentStudentMapping(
                  useParentSId,
                  useStudentId,
                  customParentNameSRelation
                );
                await insertParentStudentMapping(
                  useParentMId,
                  useStudentId,
                  customParentNameMRelation
                );
              }
            } catch (error) {
              console.error(error);
            }
          }

          insertData();
        } else {
          console.log("running else", parentSId, parentMId);
        }

        if (parentSId == "") {
          console.log("useStudentId", "empty empty");
          async function insertData() {
            try {
              if (parentSId === "" && parentMId === "") {
                console.log("useStudentId3", "empty empty");
                useParentMId = await insertParent("n/a", "n/a", "n/a", "n/a");
                // useParentMId = parentIdM;
                console.log("done inserting parent 1", useParentMId);

                const studentId = await insertStudent(useParentMId);
                // insertParent(custompPrentNameS, customParentNameSTel, customParentNameSMail, parentNameSAddress);
                const useStudentId = studentId;
                console.log(
                  "useStudentId",
                  useStudentId,
                  studentId,
                  "nothers nothers"
                );

                const parentIdS = await insertParent(
                  "n/a",
                  "n/a",
                  "n/a",
                  "n/a"
                );
                const useParentSId = parentIdS;
                console.log("done inserting parent 2", useParentSId);

                await insertParentStudentMapping(
                  useParentSId,
                  useStudentId,
                  customParentNameSRelation
                );
                await insertParentStudentMapping(
                  useParentMId,
                  useStudentId,
                  customParentNameMRelation
                );
              }
            } catch (error) {
              console.error(error);
            }
          }

          insertData();
        }

        res
          .status(200)
          .json({
            message: "Student added successfully",
            studentId: useStudentId,
          });
        console.log("finished if statement", parentSId, parentMId);
      } catch {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // addstudent postgres

    app.post("/api/addStaff", async (req, res) => {
      console.log("req file", req.file);
      console.log("REQ BODY", req.body);
      const {
        staffName,
        dateOfBirth,
        contactNumber,
        email,
        gender,
        qualification,
        role,
        address,
        salary,
        password,
        image,
      } = req.body;
      // const image = req.file ? req.file.filename : null;

      // Check if a staff member with the same name already exists
      const checkQuery =
        "SELECT * FROM staffdetails WHERE (staffname = $1 OR email = $2) AND deleted='No'";
      try {
        const result = await pool.query(checkQuery, [staffName, email]);

        if (result.rows.length > 0) {
          res.status(200).json({
            error:
              "Staff member with the same email or staffName already exists",
          });
        } else {
          const hash = await bcrypt.hash(password, saltRounds);

          const insertQuery =
            "INSERT INTO staffdetails (image, staffname, dateofbirth, address, contactnumber, email, gender, qualification, role, salary, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
          await pool.query(insertQuery, [
            image,
            staffName,
            dateOfBirth,
            address,
            contactNumber,
            email,
            gender,
            qualification,
            role,
            salary,
            hash,
          ]);

          console.log("Data inserted successfully");
          res.status(200).json({ message: "staff added successfully" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); //postgres

    app.get("/api/getStaff", (req, res) => {
      const sqlGet =
        "SELECT * FROM StaffDetails WHERE Deleted = 'No' ORDER BY staffname";
      pool.query(sqlGet, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.send(result.rows);
        }
      });
    }); // postgres

    app.post("/api/login", async (req, res) => {
      console.log("REQ BODY", req.body);
      const { username, password } = req.body;

      try {
        const result = await pool.query(
          "SELECT * FROM staffdetails WHERE email=$1 AND deleted='No'",
          [username]
        );

        if (result.rows.length > 0) {
          console.log("password", result.rows[0].password);

          const passResult = await bcrypt.compare(
            password,
            result.rows[0].password
          );

          console.log('passResult', passResult)

          if (passResult) {
            req.session.userDetails = result.rows[0];
            console.log('result.rows[0]', req.session.userDetails)
            res.status(200).json({
              result: result.rows,
              userDetails: req.session.userDetails,
              message: "Login successful",
            });
          } else {
            res
              .status(200)
              .json({ error: `Incorrect password for ${username}` });
          }
        } else {
          res.status(200).json({ error: "User does not exist" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); //postgres

    app.post("/api/logout", (req, res) => {
      console.log("running log out api");
      if (req.session.userDetails) {
        // Destroy the session
        console.log("running log out api2");
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
            res.status(500).json({ error: "An error occurred during logout" });
          } else {
            console.log("running log out api3");

            // req.session.userDetails = null;
            res.clearCookie("connect.sid");

            res.status(200).json({ message: "Logged out successfully" });
          }
        });
      } else {
        res.status(401).json({ error: "Not logged in" });
      }
    }); //postgres

    app.post("/api/addClass", (req, res) => {
      console.log("REQ BODY", req.body);
      const { className, classTeacher, classSize } = req.body;
      const sqlInsert =
        "INSERT INTO ClassesTable (ClassName, ClassTeacher) VALUES ($1, $2) RETURNING id";
      const values = [className, classTeacher];

      pool.query(sqlInsert, values, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Data inserted successfully", className);
          res.status(200).json({ message: `${className} added successfully` });
        }
      });
    }); //postgres

    app.post("/api/addSemester", (req, res) => {
      console.log("REQ BODY", req.body);
      const { semesterName, dateStart, dateEnd, active } = req.body;
      const sqlInsert =
        "INSERT INTO semester (semestername, startdate, enddate, active) VALUES ($1, $2, $3, $4) RETURNING id";
      const values = [semesterName, dateStart, dateEnd, active];

      pool.query(sqlInsert, values, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("semester added successfully", semesterName);
          res
            .status(200)
            .json({ message: `${semesterName} added successfully` });
        }
      });
    }); //postgres

    app.get("/api/getSemester", (req, res) => {
      const sqlGet = ` SELECT * FROM semester WHERE deleted='No' ORDER BY id DESC`;

      pool.query(sqlGet, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("getsemester", result.rows);
          res.send(result.rows);
        }
      });
    }); //postgres

    app.get("/api/getClasses", (req, res) => {
      const sqlGet = `
        SELECT
            CT.id AS id,
            CT.ClassName AS ClassName,
            CT.ClassTeacher,
            COUNT(ST.id) AS ClassSize
        FROM ClassesTable CT
        LEFT JOIN studentDetails ST ON CT.id = ST.ClassID
        WHERE CT.Deleted = 'No'
        GROUP BY CT.id, CT.ClassName, CT.ClassTeacher
        ORDER BY CT.ClassName;
      `;

      pool.query(sqlGet, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.send(result.rows);
        }
      });
    }); //postgres

    app.get("/api/getStaff/:id", (req, res) => {
      const { id } = req.params;
      const sqlGetStaff =
        "SELECT * FROM StaffDetails WHERE id=$1 AND Deleted = 'No' ORDER BY id DESC";
      pool.query(sqlGetStaff, [id], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.send(result.rows);
        }
      });
    }); //postgres

    app.get("/api/getClasses/:id", (req, res) => {
      const { id } = req.params;
      const sqlGet =
        "SELECT * FROM ClassesTable WHERE id = $1 AND Deleted='No'";
      pool.query(sqlGet, [id], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.send(result.rows);
        }
      });
    }); //postgres

    app.post(
      "/api/updateStaffPassword/:id",
      upload.single("image"),
      (req, res) => {
        console.log("req file", req.file);
        console.log("REQ BODY", req.body);
        const id = req.params.id;
        const { oldPassword, newPassword, userName, email } = req.body;

        const sqlSelect =
          "SELECT * FROM StaffDetails WHERE Email=$1 AND Deleted='No'";
        pool.query(sqlSelect, [email], (error, result) => {
          if (error) {
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (result.rows.length > 0) {
              bcrypt.compare(
                oldPassword,
                result.rows[0].password,
                (passError, passResult) => {
                  if (passResult) {
                    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
                      const sqlUpdatePass =
                        "UPDATE StaffDetails SET password=$1 WHERE id=$2 AND Deleted='No'";
                      pool.query(sqlUpdatePass, [hash, id], (error, result) => {
                        if (error) {
                          res
                            .status(500)
                            .json({ error: "Internal Server Error" });
                        } else {
                          res
                            .status(200)
                            .json({ message: "Password updated successfully" });
                        }
                      });
                    });
                  } else {
                    res.status(200).json({
                      error:
                        "Wrong old password. Password update unsuccessful.",
                    });
                  }
                }
              );
            } else {
              res.status(200).json({ error: "User does not exist" });
            }
          }
        });
      }
    ); //postgres

    app.post("/api/updateStaff/:id", upload.single("image"), (req, res) => {
      console.log("req file", req.file);
      console.log("REQ BODY", req.body);
      const id = req.params.id;
      const {
        staffName,
        dateOfBirth,
        contactNumber,
        email,
        gender,
        qualification,
        role,
        address,
        salary,
        image,
      } = req.body;
      // const image = req.file ? req.file.filename : null;

      const sqlUpdate =
        "UPDATE staffdetails SET Image=$1, StaffName=$2, DateOfBirth=$3, Address=$4, ContactNumber=$5, Email=$6, Gender=$7, Qualification=$8, Role=$9, Salary=$10 WHERE id=$11";

      pool.query(
        sqlUpdate,
        [
          image,
          staffName,
          dateOfBirth,
          address,
          contactNumber,
          email,
          gender,
          qualification,
          role,
          salary,
          id,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Data updated successfully");
            res.status(200).json({ message: "Data updated successfully" });
          }
        }
      );
    }); //postgres

    app.post("/api/addGrade", async (req, res) => {
      console.log("REQ BODY", req.body);
      const { gradeName, minGradePoint, maxGradePoint } = req.body;

      try {
        // Check if a subject with the same name already exists
        const checkQuery =
          "SELECT * FROM Grades WHERE gradename = $1 AND deleted = 'No'";
        const checkResult = await pool.query(checkQuery, [gradeName]);

        if (checkResult.rows.length > 0) {
          res
            .status(200)
            .json({ error: "Grade name already exists" });
        } else {
          const sqlInsert =
            "INSERT INTO Grades (gradename, MinGrade, MaxGrade) VALUES ($1, $2, $3) ";
          pool.query(
            sqlInsert,
            [gradeName, minGradePoint, maxGradePoint],
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                console.log("GRADE inserted successfully");
                res.status(200).json({ message: "Grade added successfully" });
              }
            }
          );
        }
      } catch (err) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); //postgres

    app.post("/api/addStudentGrade", async (req, res) => {
      console.log("REQ BODY", req.body);
      const {
        subjectName,
        subjectId,
        staffName,
        staffId,
        className,
        classId,
        semester,
        year,
        scores,
      } = req.body;

      let gradeId;
      let gradeName;

      const scoreEntries = Object.entries(scores);
      console.log("scores", scores);

      // Use a variable to track whether any errors occurred during processing
      let hasError = false;
      let errorMessage, successMessage;

      const sendResponse = () => {
        if (hasError) {
          res.status(200).json({ error: errorMessage });
        } else {
          res
            .status(200)
            .json({ message: successMessage });
        }
      };

      // Use Promise.all to wait for all queries to complete before sending the response
      try {
        await Promise.all(
          scoreEntries.map(async ([studentId, scoreData], index) => {
            const { classCore, totalScore, examsCore, studentName } = scoreData;

            // Check if a subject with the same name already exists
            const checkQuery =
              "SELECT COUNT(*) as count FROM StudentGrades WHERE StudentID = $1 AND SubjectID = $2 AND ClassID = $3 AND Semester = $4 AND Deleted='No'";
            const checkResult = await pool.query(checkQuery, [
              studentId,
              subjectId,
              classId,
              semester,
            ]);

            if (checkResult.rows[0].count > 0) {
              const sqlGetGrade =
                "SELECT * FROM Grades WHERE MinGrade <= $1 AND MaxGrade >= $2 AND Deleted = 'No'";
              const { rows } = await pool.query(sqlGetGrade, [
                parseFloat(totalScore),
                parseFloat(totalScore),
              ]);

              if (rows && rows.length > 0) {
                gradeId = rows[0].id;
                gradeName = rows[0].gradename;
                console.log("gradeId", gradeId, gradeName);

                const sqlUpdate = `
                  UPDATE StudentGrades 
                  SET StudentID=$1, SubjectID=$2, StaffID=$3, Semester=$4, AcademicYear=$5,
                      TotalScore=$6, ClassScore=$7, ExamScore=$8, ClassID=$9, StudentName=$10,
                      SubjectName=$11, ClassName=$12, gradename=$13, GradeID=$14, StaffName=$15 
                  WHERE StudentID=$1 AND SubjectID=$2 AND ClassID=$9 AND Semester=$4
                `;
                await pool.query(sqlUpdate, [
                  studentId,
                  subjectId,
                  staffId,
                  semester,
                  year,
                  totalScore,
                  classCore,
                  examsCore,
                  classId,
                  studentName,
                  subjectName,
                  className,
                  gradeName,
                  gradeId,
                  staffName,
                ]);
                successMessage = 'marks updated succesfully'
              } else {
                hasError = true;
                errorMessage = 'Could not get a matching grade for the total score'
              }
            } else {
              const sqlGetGrade =
                "SELECT * FROM Grades WHERE MinGrade <= $1 AND MaxGrade >= $2 AND Deleted = 'No'";
              const { rows } = await pool.query(sqlGetGrade, [
                parseFloat(totalScore),
                parseFloat(totalScore),
              ]);

              if (rows && rows.length > 0) {
                gradeId = rows[0].id;
                gradeName = rows[0].gradename;
                console.log("gradeId", gradeId, gradeName);

                const sqlInsert = `
                  INSERT INTO StudentGrades 
                  (StudentID, SubjectID, StaffID, Semester, AcademicYear, TotalScore,
                   ClassScore, ExamScore, ClassID, StudentName, SubjectName, ClassName, 
                   gradename, GradeID, StaffName) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                `;
                await pool.query(sqlInsert, [
                  studentId,
                  subjectId,
                  staffId,
                  semester,
                  year,
                  totalScore,
                  classCore,
                  examsCore,
                  classId,
                  studentName,
                  subjectName,
                  className,
                  gradeName,
                  gradeId,
                  staffName,
                ]);
                successMessage = 'marks added succesfully'

              } else {
                hasError = true;
                errorMessage = 'Could not get a matching grade for the total score'
              }
            }

            // If it's the last iteration, send the response
            if (index === scoreEntries.length - 1) {
              sendResponse();
            }
          })
        );
      } catch (error) {
        console.error(error);
        hasError = true;
        errorMessage = 'Internal server error'
        sendResponse();
      }
    }); // postgres

    app.post("/api/takeAttendance", async (req, res) => {
      console.log("REQ BODY", req.body);
      const { className, classId, semester, attendance } = req.body;

      let hasError = false;
      let errorMessage;

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const formattedDate = `${year}-${month}-${day}`;
      // console.log("formattedDate", formattedDate);

      const attendanceEntries = Object.entries(attendance);
      //console.log("attendance", attendance);

      const sendResponse = () => {
        if (hasError) {
          res
            .status(200)
            .json({
              error: errorMessage,
            });
        } else {
          res
            .status(200)
            .json({ message: "attendance taken successfully" });
            // console.log('attendance taken successfully')
        }
      };

      // Use Promise.all to wait for all queries to complete before sending the response
      try {
        await Promise.all(
          attendanceEntries.map(async ([studentId, attendanceData], index) => {
            const { status, studentName } = attendanceData;

            // Check if attendance for the student on the same day already exists
            const checkQuery =
              "SELECT COUNT(*) as count FROM AttendanceTable WHERE StudentID = $1 AND AttendanceDate::date = $2";
            const checkResult = await pool.query(checkQuery, [
              studentId,
              formattedDate,
            ]);

            //console.log('checkResult.rows[0].count', checkResult.rows[0].count, formattedDate)

            if (checkResult.rows[0].count == 0) {
              console.log('attendance taken successfully 111')
              const sqlInsert =
                "INSERT INTO AttendanceTable (StudentID, ClassID, Semester, Status, AttendanceDate) VALUES ($1, $2, $3, $4, $5)";
              await pool.query(sqlInsert, [
                studentId,
                classId,
                semester,
                status,
                formattedDate,
              ]);
              console.log('attendance taken successfully 222')

            }else{
              // console.log('attendance taken not successful 222')
              hasError = true;
              errorMessage = 'attendance already taken for today'
            }

            // If it's the last iteration, send the response
            if (index === attendanceEntries.length - 1) {
              sendResponse();
            }
          })
        );
      } catch (error) {
        console.error(error);
        hasError = true;
        errorMessage = 'Internal server error'
        sendResponse();
      }
    }); // postgres

    app.post("/api/addSubject", async (req, res) => {
      console.log("REQ BODY", req.body);
      const { subjectName } = req.body;

      try {
        // Check if a subject with the same name already exists
        const checkQuery =
          "SELECT COUNT(*) as count FROM Subjects WHERE SubjectName = $1";
        const checkResult = await pool.query(checkQuery, [subjectName]);

        if (checkResult.rows[0].count > 0) {
          res.status(200).json({ error: "Subject with the same name already exists" });
        } else {
          const sqlInsert = "INSERT INTO Subjects (SubjectName) VALUES ($1)";
          await pool.query(sqlInsert, [subjectName]);
          res.status(200).json({ message: "Subject added successfully" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      
    }); // postgres

    app.post("/api/addFees", async (req, res) => {
      console.log("REQ BODY", req.body);
      const { classId, className, semesterid, feesForTheTime, feesType } =
        req.body;

      try {
        const insertQuery =
          "INSERT INTO Fees (semesterid, ClassID, ClassName, FeeName, Amount) VALUES($1, $2, $3, $4, $5) RETURNING id";
        const insertResult = await pool.query(insertQuery, [
          semesterid,
          classId,
          className,
          feesType,
          feesForTheTime,
        ]);

        const feesId = insertResult.rows[0].id;

        const updateFeesOwed = `
          UPDATE studentDetails
          SET AmountOwed = AmountOwed + $1
          WHERE ClassID = $2 AND Deleted='No';
        `;
        await pool.query(updateFeesOwed, [feesForTheTime, classId]);

        res.status(200).json({
          message: "Fees inserted or updated successfully",
          feesId,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: "Internal Server Error. Please try again",
        });
      }
    }); // postgres

    app.post("/api/addExpense", async (req, res) => {
      console.log("REQ BODY", req.body);
      const { recipientName, amount, purpose } = req.body;

      try {
        const insertQuery =
          "INSERT INTO Expenses (Receipient, AmountPaid, Purpose) VALUES ($1, $2, $3) RETURNING id";
        const insertResult = await pool.query(insertQuery, [
          recipientName,
          amount,
          purpose,
        ]);

        const expenseId = insertResult.rows[0].id;

        console.log("Data inserted successfully");

        res.status(200).json({
          message: "Data inserted successfully",
          expenseId,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: "Internal Server Error",
        });
      }
    }); // postgres

    app.post("/api/updateClass/:id", async (req, res) => {
      console.log("REQ BODY", req.body);
      const { className, classTeacher, feesForTheTime, classSize } = req.body;
      const id = req.params.id;
      console.log("id", id);

      try {
        const updateQuery =
          "UPDATE ClassesTable SET ClassName=$1, ClassTeacher=$2, FeesForTheTime=$3, ClassSize=$4 WHERE id=$5";
        await pool.query(updateQuery, [
          className,
          classTeacher,
          feesForTheTime,
          classSize,
          id,
        ]);

        console.log(
          "Data Updated successfully",
          className,
          classTeacher,
          feesForTheTime,
          classSize
        );
        res.status(200).json({ message: "Data updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.post("/api/updateGrade/:id", async (req, res) => {
      console.log("REQ BODY", req.body);
      const { gradeName, minGradePoint, maxGradePoint } = req.body;
      const id = req.params.id;
      console.log("id", id);

      try {

        // Check if a subject with the same name already exists
        const checkQuery =
          "SELECT * FROM Grades WHERE gradename = $1 AND id != $2 AND deleted = 'No'";
        const checkResult = await pool.query(checkQuery, [gradeName, id]);

        if (checkResult.rows.length > 0) {
          res
            .status(200)
            .json({ error: "GRADE  name already exists" });
        } else {

        const updateQuery =
          "UPDATE Grades SET gradename=$1, MinGrade=$2, MaxGrade=$3 WHERE id=$4";
        await pool.query(updateQuery, [
          gradeName,
          minGradePoint,
          maxGradePoint,
          id,
        ]);

        console.log("Data Updated successfully");
        res.status(200).json({ message: "Grade updated successfully" });
      }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.post("/api/updateSubject/:id", async (req, res) => {
      console.log("REQ BODY", req.body);
      const { subjectName } = req.body;
      const id = req.params.id;
      console.log("id", id);

      try {
        console.log("id2", id);

        // Check if a subject with the same name already exists
        const checkQuery =
          "SELECT COUNT(*) as count FROM Subjects WHERE SubjectName = $1 AND deleted = $2";
        const checkResult = await pool.query(checkQuery, [subjectName, "No"]);

        if (checkResult.rows[0].count > 0) {
          console.log("id3", id, checkResult.rows[0].count);
          console.log("Subject with the same name already exists");

          return res
            .status(400)
            .json({ error: "Subject with the same name already exists" });
          // console.log("id8", id);
        }

        console.log("id4", id);

        const updateQuery = "UPDATE Subjects SET SubjectName=$1 WHERE id=$2";
        await pool.query(updateQuery, [subjectName, id]);

        console.log("Data Updated successfully");
        return res
          .status(200)
          .json({ message: "subject updated successfully" });
      } catch (error) {
        console.error(error);
        console.log("id5", "Internal Server Error");
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.post("/api/makePayment", async (req, res) => {
      const {
        studentId,
        studentName,
        studentClass,
        amountOwed,
        amountReceived,
        feesType,
        receivedFrom,
        comment,
        newBalance,
        receivedBy,
      } = req.body;

      try {
        // Insert payment data
        const insertPaymentQuery = `
          INSERT INTO Payments
          (StudentId, AmountPaid, InitialAccountBalance, CurrentBalance, FeesName, ReceivedFrom, Comment, StudentName, ReceivedBy)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id`;
        const paymentResult = await pool.query(insertPaymentQuery, [
          studentId,
          amountReceived,
          amountOwed,
          newBalance,
          feesType,
          receivedFrom,
          comment,
          studentName,
          receivedBy,
        ]);

        const paymentId = paymentResult.rows[0].id;

        // Update studentDetails table
        const updateStudentQuery = `
          UPDATE studentDetails
          SET AmountOwed = $1
          WHERE id = $2`;
        await pool.query(updateStudentQuery, [newBalance, studentId]);

        // Send the payment ID to the front end
        res.status(200).json({
          paymentId,
          message: "Payment completed successfully",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/searchStaff", async (req, res) => {
      try {
        const query = req.query.query;
        console.log("query:", query);
        const sanitizedQuery = `%${query}%`; // No need for db.escape() in parameterized queries

        const sqlGet = `
          SELECT *
          FROM StaffDetails
          WHERE StaffName ILIKE $1 AND Deleted = 'No'
          LIMIT 1000`;

        const results = await pool.query(sqlGet, [sanitizedQuery]);
        res.send(results.rows);
      } catch (error) {
        console.error("Database error: " + error.message);
        res.status(500).json({ error: "Server error" });
      }
    }); // postgres

    app.get("/api/search", async (req, res) => {
      try {
        const query = req.query.query;
        const sanitizedQuery = `%${query}%`; // No need for db.escape() in parameterized queries

        const sqlGet = `
          SELECT *
          FROM studentDetails
          WHERE (StudentName ILIKE $1 OR ClassName ILIKE $1)
          AND Deleted = 'No'
          ORDER BY ClassName, StudentName
          LIMIT 10000`;

        const results = await pool.query(sqlGet, [sanitizedQuery]);
        res.send(results.rows);
      } catch (error) {
        console.error("Database error: " + error.message);
        res.status(500).json({ error: "Server error" });
      }
    }); // postgres

    app.get("/api/getStudent/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const sqlGet =
          "SELECT * FROM studentDetails WHERE id = $1 AND Deleted='No'";
        const result = await pool.query(sqlGet, [id]);
        res.send(result.rows);
      } catch (error) {
        console.error("Database error: " + error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getClassAccessment", async (req, res) => {
      try {
        const classId = req.query.classId;
        const subjectId = req.query.subjectId;
        const year = req.query.year;
        const semester = req.query.semester;

        const sqlGet = `
          SELECT *, 
                 RANK() OVER (ORDER BY TotalScore DESC) AS position
          FROM StudentGrades 
          WHERE ClassID = $1 AND Semester = $2 AND AcademicYear = $3 AND SubjectID = $4;
        `;

        const result = await pool.query(sqlGet, [
          classId,
          semester,
          year,
          subjectId,
        ]);
        res.send(result.rows);
      } catch (error) {
        console.error("Database error: " + error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get(
      "/api/getOneStudentAccessment/:studentId/:classId/:semester/:academicYear",
      async (req, res) => {
        try {
          console.log("running getOneStudentAccessment");
          const studentId = req.params.studentId;
          const classId = req.params.classId;
          const semester = req.params.semester;
          const academicYear = req.params.academicYear;
          console.log("params", academicYear);

          const sqlGetStudentResult = `
            SELECT SubjectID, SubjectName, ClassScore, ExamScore, TotalScore, gradename, Semester,
              (
                SELECT COUNT(DISTINCT sg2.TotalScore) + 1
                FROM StudentGrades sg2
                WHERE sg2.SubjectID = sg.SubjectID AND sg2.Semester = $1 AND sg2.AcademicYear = $2
                AND sg2.TotalScore > sg.TotalScore
              ) AS StudentPosition
            FROM StudentGrades sg
            WHERE sg.StudentID = $3 AND sg.Semester = $1 AND sg.AcademicYear = $2
            ORDER BY sg.SubjectID, sg.TotalScore DESC;
          `;

          const result = await pool.query(sqlGetStudentResult, [
            semester,
            academicYear,
            studentId,
          ]);
          res.send(result.rows);
        } catch (error) {
          console.error("Database error: " + error.message);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    ); // postgres

    app.get("/api/getAllClassAssessment", (req, res) => {
      const classId = parseInt(req.query.classId);
      const semester = parseInt(req.query.semester);
      const academicYear = parseInt(req.query.year);

      // Step 1: Query the database to get distinct subject names
      pool.query(
        "SELECT DISTINCT subjectname FROM StudentGrades WHERE ClassID = $1 AND Semester = $2 AND AcademicYear = $3 AND Deleted='No'",
        [classId, semester, academicYear],
        (subjectError, subjectResults) => {
          if (subjectError) {
            console.error(subjectError);
            return res.status(200).json({ error: "Internal Server Error" });
          }
          console.log('subjectResults 0', subjectResults.rows)
          const subjects = subjectResults.rows.map(
            (subject) => subject.subjectname
          );

          // Step 2: Construct the dynamic SQL query to pivot scores
          const subjectColumns = subjects
            .map(
              (subject, index) =>
                `MAX(CASE WHEN subjectname = $${
                  index + 4
                } THEN TotalScore ELSE NULL END) AS ${subject}`
            )
            .join(", ");
          const dynamicSQL = `
            SELECT 
              StudentID, StudentName, ${subjectColumns},
              SUM(TotalScore) AS total,
              RANK() OVER (ORDER BY SUM(TotalScore) DESC) AS position
            FROM StudentGrades
            WHERE ClassID = $1 AND Semester = $2 AND AcademicYear = $3 AND Deleted='No'
            GROUP BY StudentID, studentname
            ORDER BY total DESC;
          `;

          // Prepare an array of parameters for the dynamic SQL query
          const queryParams = [classId, semester, academicYear, ...subjects];
          
          // Now you can execute the dynamic SQL query with parameterized values
          pool.query(dynamicSQL, queryParams, (error, results) => {
            if (error) {
              console.error(error);
              return res.status(200).json({ error: "Internal Server Error" });
            }
            console.log('subjectResults 1', results.rows)

            // Limit the information returned based on what is necessary
            // const sanitizedResults = results.rows.map((result) => ({
            //   StudentID: result.studentid,
            //   StudentName: result.studentname,
            //   total: result.total,
            //   position: result.position,
            // }));

            res.send(results.rows);
          });
        }
      );
    }); // postgres

    app.get("/api/getClassStudent/:classId", (req, res) => {
      const { classId } = req.params;
      console.log("classId", classId);

      const sqlGet = `
        SELECT 
          studentDetails.*, 
          ParentGuardianDetails.ContactNumber AS Contact
        FROM 
          studentDetails
        LEFT JOIN 
          ParentGuardianDetails 
        ON 
          studentDetails.ParentID = ParentGuardianDetails.id
        WHERE 
          studentDetails.ClassID = $1 
          AND studentDetails.Deleted = 'No';
      `;

      pool.query(sqlGet, [classId], (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Students retrieved successfully");
          res.send(result.rows);
        }
      });
    }); // postgres

    app.post("/api/updateStudent/:id", (req, res) => {
      try {
        console.log("REQ BODY", req.body);
        const { id } = req.params;
        console.log("id", id);

        // Extract student details from the request body
        var {
          // image,
          stuId,
          studentName,
          studentClass,
          amountOwed,
          parentNameM,
          parentNameS,
          dateOfBirth,
          gender,
          address,
          customParentNameM,
          customParentNameMTel,
          customParentNameMMail,
          parentNameMAddress,
          custompPrentNameS,
          parentNameSAddress,
          customParentNameSMail,
          customParentNameSTel,
          parentMId,
          parentSId,
          customParentNameMRelation,
          customParentNameSRelation,
        } = req.body;

        // const image = req.file ? req.file.filename : null;

        const updateParent = (
          parentName,
          parentTel,
          parentMail,
          parentAddress,
          parentid
        ) => {
          const sqlUpdateParent =
            "UPDATE ParentGuardianDetails SET ParentName=$1, ContactNumber=$2, Email=$3, ResidenceAddress=$4 WHERE id=$5";
          pool.query(
            sqlUpdateParent,
            [parentName, parentTel, parentMail, parentAddress, parentid],
            (error, result) => {
              if (error) {
                console.log(error);
              } else {
                console.log("First parent details inserted successfully");
              }
            }
          );
        };

        const updateStudent = (paID) => {
          const sqlUpdate =
            "UPDATE studentDetails SET StudentName=$1, ClassName=$2, AmountOwed=$3, DateOfBirth=$4, Gender=$5, ParentID=$6, Address=$7 WHERE id=$8";
          pool.query(
            sqlUpdate,
            [
              studentName,
              studentClass,
              amountOwed,
              dateOfBirth,
              gender,
              paID,
              // image,
              address,
              id,
            ],
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                console.log("Student data updated successfully");
              }
            }
          );
        };

        const updateParentStudentMapping = (parentid, studentid, relation) => {
          const sqlUpdateMapping =
            "UPDATE ParentStudentMapping SET ParentId=$1, StudentId=$2, RelationToWard=$3 WHERE StudentId=$4";
          pool.query(
            sqlUpdateMapping,
            [parentid, studentid, relation, studentid],
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                console.log("ParentStudentMapping updated successfully 2");
              }
            }
          );
        };

        console.log("reached if statement", parentSId, parentMId);

        updateParent(
          customParentNameM,
          customParentNameMTel,
          customParentNameMMail,
          parentNameMAddress,
          parentMId
        );

        console.log("done updating parents1");

        updateParent(
          custompPrentNameS,
          customParentNameSTel,
          customParentNameSMail,
          parentNameSAddress,
          +parentSId
        );

        console.log("done updating parents2");

        updateStudent(parentMId);

        console.log("done updating student");

        updateParentStudentMapping(parentMId, stuId, customParentNameMRelation);

        console.log("done updating updateParentStudentMapping 1");

        updateParentStudentMapping(parentSId, stuId, customParentNameSRelation);

        console.log("done updating updateParentStudentMapping 2");

        console.log("finished if statement", parentSId, parentMId);

        res.status(200).json({ message: "Student updated successfully" });
      } catch (error) {
        console.error(error);

        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getGrades", (req, res) => {
      const sqlGet = "SELECT * FROM Grades WHERE Deleted=$1 ORDER BY maxgrade DESC";
      pool.query(sqlGet, ["No"], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("results");
          res.send(result.rows);
        }
      });
    }); // postgres

    app.get("/api/getSubjects", (req, res) => {
      const sqlGet = "SELECT * FROM Subjects WHERE Deleted=$1 ORDER BY subjectname";
      pool.query(sqlGet, ["No"], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.send(result.rows);
          // console.log('result.rows:', result);
        }
      });
    }); // postgres

    app.get("/api/getSubject/:id", (req, res) => {
      const { id } = req.params;
      const sqlGet = "SELECT * FROM Subjects WHERE id = $1 AND Deleted=$2";
      pool.query(sqlGet, [id, "No"], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.send(result.rows);
          console.log("result.rows:", result.rows);
        }
      });
    }); // postgres

    app.get("/api/getGrade/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const sqlGet = "SELECT * FROM Grades WHERE id = $1 AND Deleted=$2";
        const result = await pool.query(sqlGet, [id, "No"]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getParents/", async (req, res) => {
      try {
        const sqlGet = "SELECT * FROM ParentGuardianDetails";
        const result = await pool.query(sqlGet);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getParents/:id", async (req, res) => {
      try {
        const { id } = req.params;
        console.log("getParents id", id);
        const sqlGet = "SELECT * FROM ParentGuardianDetails WHERE id = $1";
        const result = await pool.query(sqlGet, [id]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getStudentParentsMapping/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const sqlGet =
          "SELECT * FROM ParentStudentMapping WHERE StudentId = $1";
        const result = await pool.query(sqlGet, [id]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getStudents", async (req, res) => {
      try {
        const sqlGet =
          "SELECT * FROM studentDetails WHERE Deleted = 'No' ORDER BY ClassName, StudentName";
        const result = await pool.query(sqlGet);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getExpenses", async (reg, res) => {
      try {
        const sqlGet =
          "SELECT * FROM Expenses WHERE Deleted = 'No' ORDER BY id DESC ";
        const result = await pool.query(sqlGet);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getPayments", async (req, res) => {
      try {
        const sqlGet =
          "SELECT * FROM Payments WHERE Deleted = 'No' ORDER BY id DESC ";
        const result = await pool.query(sqlGet);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getExpensesForDay", async (req, res) => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month}-${day}`;
        // console.log("formattedDate", formattedDate);
        const sqlGet =
          "SELECT * FROM Expenses WHERE DateAdded::date = $1 AND Deleted = 'No' ORDER BY id DESC ";
        const result = await pool.query(sqlGet, [formattedDate]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getExpensesForWeek", async (req, res) => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month}-${day}`;

        // Calculate the start date of the current week (assuming the week starts on Sunday)
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Go back to the beginning of the week

        // Calculate the end date of the current week (assuming the week ends on Saturday)
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // Go to the end of the week

        const sqlGet =
          "SELECT * FROM Expenses WHERE DateAdded::date BETWEEN $1 AND $2 AND Deleted = 'No' ORDER BY id DESC";
        const result = await pool.query(sqlGet, [startDate, endDate]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getExpensesForDate", async (req, res) => {
      try {
        const endDate = req.query.endDate;
        const startDate = req.query.startDate;
        console.log("endDate", endDate, startDate);

        const sqlGet =
          "SELECT * FROM Expenses WHERE DateAdded::date BETWEEN $1 AND $2 AND Deleted = 'No' ORDER BY id DESC";
        const result = await pool.query(sqlGet, [startDate, endDate]);

        if (result) {
          console.log("result.rows 555", result.rows);
          res.send(result.rows);
        } else {
          res
            .status(200)
            .json({ error, message: "password updated successfully" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getPaymentsForDay", async (req, res) => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month}-${day}`;
        const sqlGet =
          "SELECT * FROM Payments WHERE PaymentDate::date = $1 AND Deleted = 'No' ORDER BY id DESC ";
        const result = await pool.query(sqlGet, [formattedDate]);

        // console.log("formattedDate", formattedDate, result.rows);

        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); //postgres

    app.get("/api/getPaymentsForWeek", async (req, res) => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month}-${day}`;

        // Calculate the start date of the current week (assuming the week starts on Sunday)
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Go back to the beginning of the week

        // Calculate the end date of the current week (assuming the week ends on Saturday)
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // Go to the end of the week

        const sqlGet =
          "SELECT * FROM Payments WHERE PaymentDate::date BETWEEN $1 AND $2 AND Deleted = 'No' ORDER BY id DESC";
        const result = await pool.query(sqlGet, [startDate, endDate]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getPaymentsForDate", async (req, res) => {
      try {
        let endDate = req.query.endDate;
        let startDate = req.query.startDate;
        console.log("endDate", endDate, startDate);

        const sqlGet =
          "SELECT * FROM Payments WHERE PaymentDate::date BETWEEN $1 AND $2 AND Deleted = 'No' ORDER BY id DESC";
        const result = await pool.query(sqlGet, [startDate, endDate]);

        if (result) {
          res.send(result.rows);
        } else {
          res
            .status(200)
            .json({ error, message: "password updated successfully" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); //postgres

    app.get("/api/getStudentsOwing", async (req, res) => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month}-${day}`;

        // Calculate the start date of the current week (assuming the week starts on Sunday)
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Go back to the beginning of the week

        // Calculate the end date of the current week (assuming the week ends on Saturday)
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // Go to the end of the week

        const sqlGet =
          "SELECT * FROM studentDetails WHERE AmountOwed>0 AND Deleted = 'No' ORDER BY AmountOwed DESC";
        const result = await pool.query(sqlGet);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); //postgres

    app.get("/api/searchStudentOwing", async (req, res) => {
      try {
        const query = req.query.query;
        console.log("query:", query);
        const sanitizedQuery = db.escape("%" + query + "%"); // Sanitize user input
        console.log("sanitizedQuery:", sanitizedQuery);

        const sqlGet = `SELECT * FROM studentDetails WHERE AmountOwed>0 AND StudentName LIKE ${sanitizedQuery} AND Deleted = 'No' ORDER BY AmountOwed DESC LIMIT 1000`;
        const results = await pool.query(sqlGet);
        res.send(results.rows);
      } catch (error) {
        console.error("Database error: " + error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getNewStudentsForDay", async (req, res) => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month}-${day}`;
        // console.log("formattedDate", formattedDate);
        const sqlGet =
          "SELECT * FROM studentDetails WHERE DATE(DateAdded) = DATE($1) AND Deleted = 'No' ORDER BY id DESC ";
        const result = await pool.query(sqlGet, [formattedDate]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getPayments/:id", async (req, res) => {
      try {
        const { id } = req.params;
        console.log("req.params:", id);
        const sqlGet = "SELECT * FROM Payments WHERE id=$1 AND Deleted = 'No'";
        const result = await pool.query(sqlGet, [id]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/getStudentPayments/:studentId", async (req, res) => {
      try {
        const { studentId } = req.params;
        const sqlGet =
          "SELECT * FROM Payments WHERE StudentId=$1 AND Deleted = 'No' ORDER by id DESC";
        const result = await pool.query(sqlGet, [studentId]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/searchPayments", async (req, res) => {
      try {
        const query = req.query.query;
        console.log("query:", query);

        const sqlGet = `
          SELECT * FROM Payments
          WHERE (StudentName ILIKE $1 OR Comment ILIKE $1 OR ReceivedFrom ILIKE $1 OR FeesName ILIKE $1)
          AND Deleted = 'No' ORDER BY id DESC
        `;

        const result = await pool.query(sqlGet, ["%" + query + "%"]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/searchClasses", async (req, res) => {
      try {
        const query = req.query.query;
        console.log("query: running serchclasses query", query);

        const sqlGet = `
          SELECT
            CT.id AS id,
            CT.ClassName AS ClassName,
            CT.ClassTeacher,
            COUNT(ST.id) AS ClassSize
          FROM ClassesTable CT
          LEFT JOIN studentDetails ST ON CT.id = ST.ClassID
          WHERE (CT.ClassName ILIKE $1 OR CT.ClassTeacher ILIKE $1)
          AND CT.Deleted = 'No'
          GROUP BY CT.id, CT.ClassName
          ORDER BY CT.ClassName;
        `;

        const result = await pool.query(sqlGet, ["%" + query + "%"]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/searchExpenses", async (req, res) => {
      try {
        const query = req.query.query;
        console.log("query:", query);
        const sanitizedQuery = "%" + query + "%"; // No need for db.escape() in parameterized queries

        const sqlGet = `
          SELECT * FROM Expenses
          WHERE (Purpose ILIKE $1 OR Receipient ILIKE $1 )
          AND Deleted = 'No' ORDER BY id DESC
        `;
        const result = await pool.query(sqlGet, [sanitizedQuery]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/searchSubject", async (req, res) => {
      try {
        const query = req.query.query;
        console.log("query:", query);
        const sanitizedQuery = `%${query}%`; // Sanitize user input

        const sqlGet = `
          SELECT * FROM Subjects
          WHERE subjectname ILIKE $1 AND Deleted = 'No'
        `;
        const result = await pool.query(sqlGet, [sanitizedQuery]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/deleteStudents/:id", async (req, res) => {
      try {
        const studentId = parseInt(req.params.id);
        const sqlDelete = "UPDATE studentDetails SET Deleted='Yes' WHERE id=$1";
        const result = await pool.query(sqlDelete, [studentId]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/deleteSubject/:id", async (req, res) => {
      try {
        const subjectId = parseInt(req.params.id);
        const sqlDelete = "UPDATE Subjects SET Deleted='Yes' WHERE id=$1";
        const result = await pool.query(sqlDelete, [subjectId]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/deleteGrade/:id", async (req, res) => {
      try {
        const gradeId = parseInt(req.params.id);
        const sqlDelete = "UPDATE Grades SET Deleted='Yes' WHERE id=$1";
        const result = await pool.query(sqlDelete, [gradeId]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/deleteClass/:id", async (req, res) => {
      try {
        const classId = parseInt(req.params.id);
        const sqlDelete = "UPDATE ClassesTable SET Deleted='Yes' WHERE id=$1";
        const result = await pool.query(sqlDelete, [classId]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    app.get("/api/deleteStaff/:id", async (req, res) => {
      try {
        const staffId = parseInt(req.params.id);
        const sqlDelete = "UPDATE StaffDetails SET Deleted='Yes' WHERE id=$1";
        const result = await pool.query(sqlDelete, [staffId]);
        res.send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); // postgres

    const fetchData = (table) => {
      app.get("/api/get/", (req, res) => {
        const sqlGet = `SELECT * FROM ${table}`;
        db.query(sqlGet, (error, result) => {
          res.send(result);
        });
      });
    };

    // connection.release();
  }
});

app.use("/uploads", express.static("uploads"));
app.listen(PORT, () => {
  console.log(`server running on port nelson ${PORT}`);
});
