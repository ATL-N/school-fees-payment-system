//0210019016
const session = require("express-session");
const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "12345678",
  database: "SchoolFeesSystem",
});


app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

db.getConnection((err, connection) => {
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

    app.get("/", (req, res) => {
      res.send("server running on port 5050");
    });

    app.get("/home", (req, res) => {
      if (req.session.userDetails) {
        return res.json({ userDetails: req.session.userDetails });
      } else {
        return res.json({ error: "Please sign in to access the page " });
      }
    });

    app.post("/api/addStudent", upload.single("image"), (req, res) => {
      // console.log('req file', req.file)
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
      } = req.body;

      const image = req.file ? req.file.filename : null;
      let useParentNameS;
      let [useParentSId, useParentMId, useStudentId] = "";

      const insertParent = (
        parentName,
        parentTel,
        parentMail,
        parentAddress
      ) => {
        return new Promise((resolve, reject) => {
          const sqlInsertParent =
            "INSERT INTO ParentGuardianDetails (ParentName, ContactNumber, Email, ResidenceAddress ) VALUES (?, ?, ?, ?) ";
          db.query(
            sqlInsertParent,
            [parentName, parentTel, parentMail, parentAddress],
            (error, result) => {
              if (error) {
                console.log(error);
                reject(error);
              } else {
                console.log("First parent details inserted successfully");
                resolve(result.insertId);
              }
            }
          );
        });
      };

      const insertStudent = (paID) => {
        return new Promise((resolve, reject) => {
          const sqlInsert =
            "INSERT INTO studentDetails (Image, StudentName, ClassName, AmountOwed, DateOfBirth, Gender, Address, ParentID, ClassID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ";
          db.query(
            sqlInsert,
            [
              image,
              studentName,
              studentClass,
              amountOwed,
              dateOfBirth,
              gender,
              address,
              paID,
              classid,
            ],
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                console.log("Student data inserted successfully");
                resolve(result.insertId);
                useStudentId = result.insertId;
              }
            }
          );
        });
      };

      const insertParentStudentMapping = (parentid, studentid, relation) => {
        const sqlInsertMapping =
          "INSERT INTO ParentStudentMapping (ParentId, StudentId, RelationToWard) VALUES(?, ?, ?)";
        db.query(
          sqlInsertMapping,
          [parentid, studentid, relation],
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              console.log("ParentStudentMapping inserted successfully 2");
            }
          }
        );
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

              const parentIdS = await insertParent("n/a", "n/a", "n/a", "n/a");
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

      console.log("finished if statement", parentSId, parentMId);
    });

    app.post("/api/addStaff", upload.single("image"), async (req, res) => {
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
      } = req.body;
      const image = req.file ? req.file.filename : null;

      // Check if a staff member with the same name already exists
      const checkQuery =
        "SELECT * FROM StaffDetails WHERE (StaffName = ? OR Email=?) AND Deleted='No'";
      try {
        db.query(checkQuery, [staffName, email], (error, result) => {
          if (error) {
            console.log("result", result);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("result333", result);

            if (result.length > 0) {
              console.log("result666", result);

              res.status(200).json({
                error:
                  "Staff member with the same email or staffName already exists",
              });
            } else {
              bcrypt.hash(password, saltRounds, (err, hash) => {
                const sqlInsert =
                  "INSERT INTO StaffDetails (Image, StaffName, DateOfBirth, Address, ContactNumber, Email, Gender, Qualification, Role, Salary, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                db.query(
                  sqlInsert,
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
                    hash,
                  ],
                  (error, result) => {
                    if (error) {
                      console.log(error);
                      res.status(500).json({ error: "Internal Server Error" });
                    } else {
                      console.log("Data inserted successfully");
                      res
                        .status(200)
                        .json({ message: "staff added successfully" });
                    }
                  }
                );
              });
            }
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post("/api/login", (req, res) => {
      console.log("REQ BODY", req.body);
      const { username, password } = req.body;
      const sqlInsert =
        "SELECT * FROM StaffDetails WHERE Email=? AND Deleted='No'";
      db.query(sqlInsert, [username], (error, result) => {
        if (error) {
          //   console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          if (result.length > 0) {
            console.log("password", result[0].Password);
            bcrypt.compare(
              password,
              result[0].Password,
              (passError, passResult) => {
                if (passResult) {
                  req.session.userDetails = result[0];
                  // console.log(req.session.userDetails);
                  res.status(200).json({
                    result,
                    userDetails: req.session.userDetails,
                    message: "Login successful",
                  }); // Send a success response
                } else {
                  res
                    .status(200)
                    .json({ error: `Incorrect password for ${username}` }); // Send a success response
                }
              }
            );
          } else {
            res.status(200).json({ error: "User does not exist" }); // Send a success response
          }
        }
      });
    });

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
            // res.clearCookie('connect.sid');
            res.status(200).json({ message: "Logged out successfully" });
          }
        });
      } else {
        res.status(401).json({ error: "Not logged in" });
      }
    });

    app.post(
      "/api/updateStaffPassword/:id",
      upload.single("image"),
      (req, res) => {
        console.log("req file", req.file);
        console.log("REQ BODY", req.body);
        const id = req.params.id;
        const { oldPassword, newPassword, userName, email } = req.body;

        const sqlInsert =
          "SELECT * FROM StaffDetails WHERE Email=? AND Deleted='No'";
        db.query(sqlInsert, [email], (error, result) => {
          if (error) {
            //   console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (result.length > 0) {
              console.log("password", result[0].Password);
              bcrypt.compare(
                oldPassword,
                result[0].Password,
                (passError, passResult) => {
                  if (passResult) {
                    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
                      const sqlupdatepass =
                        "UPDATE StaffDetails SET Password =? WHERE id=? AND Deleted='No' ";
                      db.query(sqlupdatepass, [hash, id], (error, result) => {
                        if (error) {
                          console.log(error);
                          res
                            .status(500)
                            .json({ error: "Internal Server Error" });
                        } else {
                          console.log("password updated successfully");
                          res
                            .status(200)
                            .json({ message: "password updated successfully" }); // Send a success response
                        }
                      });
                    }); // console.log(req.session.userDetails);
                  } else {
                    res.status(200).json({
                      error: `Wrong old password. password update unsuccessful. `,
                    }); // Send a success response
                  }
                }
              );
            } else {
              res.status(200).json({ error: "User does not exist" }); // Send a success response
            }
          }
        });
      }
    );

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
      } = req.body;
      const image = req.file ? req.file.filename : null;
      const sqlInsert =
        "UPDATE StaffDetails SET Image=?, StaffName=?, DateOfBirth=?, Address=?, ContactNumber=?, Email=?, Gender=?, Qualification=?, Role=?, Salary=? WHERE id=?";
      db.query(
        sqlInsert,
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
            console.log("Data inserted successfully");
            res.status(200).json({ message: "Data inserted successfully" }); // Send a success response
          }
        }
      );
    });

    app.post("/api/addGrade", (req, res) => {
      console.log("REQ BODY", req.body);
      const { gradeName, minGradePoint, maxGradePoint } = req.body;
      const sqlInsert =
        "INSERT INTO Grades (GradeName, MinGrade, MaxGrade) VALUES (?, ?, ?) ";
      db.query(
        sqlInsert,
        [gradeName, minGradePoint, maxGradePoint],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("GRADE inserted successfully");
            res.status(200).json({ message: "Data inserted successfully" }); // Send a success response
          }
        }
      );
    });

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
    
      scoreEntries.forEach(([studentId, scoreData], index, array) => {
        const { classCore, totalScore, examsCore, studentName } = scoreData;
    
        // Check if a subject with the same name already exists
        const checkQuery =
          "SELECT COUNT(*) as count FROM StudentGrades WHERE StudentID = ? AND SubjectID = ? AND ClassID = ? AND Semester = ? AND Deleted='No'";
        db.query(
          checkQuery,
          [studentId, subjectId, classId, semester],
          async (checkError, checkResult) => {
            if (checkError) {
              console.log(checkError);
              hasError = true;
            } else {
              if (checkResult[0].count > 0) {
                const sqlgetGrade =
                  "SELECT * FROM Grades WHERE MinGrade <= ? AND MaxGrade >= ? AND Deleted = 'No'";
                db.query(
                  sqlgetGrade,
                  [parseFloat(totalScore), parseFloat(totalScore)],
                  (error, [rows]) => {
                    if (error) {
                      console.log(error);
                      hasError = true;
                    } else {
                      if (rows) {
                        gradeId = rows.id;
                        gradeName = rows.GradeName;
                        console.log("gradeId", gradeId, gradeName);
                        const sqlUpdate = `UPDATE StudentGrades SET StudentID=?, SubjectID=?, StaffID=?, Semester=?, AcademicYear=?, TotalScore=?, ClassScore=?, ExamScore=?, ClassID=?, StudentName=?, SubjectName=?, ClassName=?, GradeName=?, GradeID=?, StaffName=? WHERE StudentID=? AND SubjectID=? AND ClassID=? AND Semester=?`;
                        db.query(
                          sqlUpdate,
                          [
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
                            studentId, // Add these parameters for WHERE clause
                            subjectId,
                            classId,
                            semester,
                          ],
                          (error, result) => {
                            if (error) {
                              console.log(error);
                              hasError = true;
                            } else {
                              console.log(
                                "Data updated successfully",
                                subjectName
                              );
                            }
                            // If it's the last iteration, send the response
                            if (index === array.length - 1) {
                              sendResponse();
                            }
                          }
                        );
                      } else {
                        hasError = true;
                      }
                    }
                  }
                );
              } else {
                const sqlgetGrade =
                  "SELECT * FROM Grades WHERE MinGrade <= ? AND MaxGrade >= ? AND Deleted = 'No'";
                db.query(
                  sqlgetGrade,
                  [parseFloat(totalScore), parseFloat(totalScore)],
                  (error, [rows]) => {
                    if (error) {
                      console.log(error);
                      hasError = true;
                    } else {
                      console.log("running else", rows);
                      if (rows) {
                        gradeId = rows.id;
                        gradeName = rows.GradeName;
                        console.log("gradeId", gradeId, gradeName);
                        const sqlInsert =
                          "INSERT INTO StudentGrades (StudentID, SubjectID, StaffID, Semester, AcademicYear, TotalScore, ClassScore, ExamScore, ClassID, StudentName, SubjectName, ClassName, GradeName, GradeID, StaffName ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        db.query(
                          sqlInsert,
                          [
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
                          ],
                          (error, result) => {
                            if (error) {
                              console.log(error);
                              hasError = true;
                            } else {
                              console.log(
                                "Data inserted successfully",
                                subjectName
                              );
                            }
                            // If it's the last iteration, send the response
                            if (index === array.length - 1) {
                              sendResponse();
                            }
                          }
                        );
                      } else {
                        hasError = true;
                      }
                    }
                  }
                );
              }
            }
          }
        );
      });
    
      // Function to send the response
      const sendResponse = () => {
        if (hasError) {
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(200).json({ message: "Data inserted/updated successfully" });
        }
      };
    });
    

    app.post("/api/takeAttendance", async (req, res) => {
      console.log("REQ BODY", req.body);
      const {
        className,
        classId,
        semester, 
        attendance
      } = req.body;
    
      let gradeId;
      let gradeName;

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const formattedDate = `${year}-${month}-${day}`;
      console.log("formattedDate", formattedDate);
    
      const scoreEntries = Object.entries(attendance);
      console.log("attendance", attendance);
    
      // Use a variable to track whether any errors occurred during processing
      let hasError = false;
    
      attendanceEntries.forEach(([studentId, attendanceData], index, array) => {
        const { status, studentName } = attendanceData;
    
        // Check if a subject with the same name already exists
        const checkQuery =
          "SELECT COUNT(*) as count FROM AttendanceTable WHERE StudentID = ? AND  DATE(AttendanceDate) = DATE(?) ";
        db.query(
          checkQuery,
          [studentId, formattedDate],
          async (checkError, checkResult) => {
            if (checkError) {
              console.log(checkError);
              hasError = true;
            } else {
              if (checkResult[0].count > 0) {

              } else {
                const sqlgetGrade =
                  "SELECT * FROM Grades WHERE MinGrade <= ? AND MaxGrade >= ? AND Deleted = 'No'";
                db.query(
                  sqlgetGrade,
                  [parseFloat(totalScore), parseFloat(totalScore)],
                  (error, [rows]) => {
                    if (error) {
                      console.log(error);
                      hasError = true;
                    } else {
                      console.log("running else", rows);
                      if (rows) {
                        gradeId = rows.id;
                        gradeName = rows.GradeName;
                        console.log("gradeId", gradeId, gradeName);
                        const sqlInsert =
                          "INSERT INTO AttendanceTable (StudentID, SubjectID, StaffID, Semester, AcademicYear, TotalScore, ClassScore, ExamScore, ClassID, StudentName, SubjectName, ClassName, GradeName, GradeID, StaffName ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        db.query(
                          sqlInsert,
                          [
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
                          ],
                          (error, result) => {
                            if (error) {
                              console.log(error);
                              hasError = true;
                            } else {
                              console.log(
                                "Data inserted successfully",
                                subjectName
                              );
                            }
                            // If it's the last iteration, send the response
                            if (index === array.length - 1) {
                              sendResponse();
                            }
                          }
                        );
                      } else {
                        hasError = true;
                      }
                    }
                  }
                );
              }
            }
          }
        );
      });
    
      // Function to send the response
      const sendResponse = () => {
        if (hasError) {
          res.status(500).json({ error: "Internal Server Error or attendance already exist" });
        } else {
          res.status(200).json({ message: "Data inserted/updated successfully" });
        }
      };
    });


    app.post("/api/addSubject", (req, res) => {
      console.log("REQ BODY", req.body);
      const { subjectName } = req.body;

      // Check if a subject with the same name already exists
      const checkQuery =
        "SELECT COUNT(*) as count FROM Subjects WHERE SubjectName = ?";
      db.query(checkQuery, [subjectName], async (checkError, checkResult) => {
        if (checkError) {
          console.log(checkError);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          if (checkResult[0].count > 0) {
            res
              .status(400)
              .json({ error: "Subject with the same name already exists" });
          } else {
            const sqlInsert = "INSERT INTO Subjects (SubjectName) VALUES (?)";
            db.query(sqlInsert, [subjectName], (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                console.log("Data inserted successfully", subjectName);
                res.status(200).json({ message: "Data inserted successfully" }); // Send a success response
              }
            });
          }
        }
      });
    });

    app.post("/api/addClass", (req, res) => {
      console.log("REQ BODY", req.body);
      const { className, classTeacher, classSize } = req.body;
      const sqlInsert =
        "INSERT INTO ClassesTable (ClassName, ClassTeacher) VALUES (?, ?) ";
      db.query(sqlInsert, [className, classTeacher], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Data inserted successfully", className);
          res.status(200).json({ message: "Class added successfully" }); // Send a success response
        }
      });
    });

    app.post("/api/addFees", (req, res) => {
      console.log("REQ BODY", req.body);
      const {
        classId,
        className,
        dateStart,
        semester,
        dateEnd,
        feesForTheTime,
        feesType,
      } = req.body;
      const sqlInsert =
        "INSERT INTO Fees (DateStart, DateEnd, TermName, ClassID, ClassName, FeeName, Amount) VALUES(?, ?, ?, ?, ?, ?, ?);";
      db.query(
        sqlInsert,
        [
          dateStart,
          dateEnd,
          semester,
          classId,
          className,
          feesType,
          feesForTheTime,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res
              .status(500)
              .json({ error: "Internal Server Error. Please try again" });
          } else {
            console.log("Data inserted successfully", className);
            const updateFeesOwed = `UPDATE studentDetails SET AmountOwed= AmountOwed + ${feesForTheTime} WHERE ClassID=${classId} AND Deleted='No';`;
            db.query(updateFeesOwed, (updateError, updateResult) => {
              if (updateError) {
                res.status(500).json({
                  error:
                    "Fees inserted but failed to update fees for all students",
                });
              }
              res.status(200).json({
                message: "Fees inserted successfully",
                updateMessage: `Fees updated successfully for all students in ${className} `,
              }); // Send a success response
            });
          }
        }
      );
    });

    app.post("/api/addExpense", (req, res) => {
      console.log("REQ BODY", req.body);
      const { recipientName, amount, purpose } = req.body;
      const sqlInsert =
        "INSERT INTO Expenses (Receipient, AmountPaid, Purpose) VALUES (?, ?, ?) ";
      db.query(sqlInsert, [recipientName, amount, purpose], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Data inserted successfully");
          res.status(200).json({ message: "Data inserted successfully" }); // Send a success response
        }
      });
    });

    app.post("/api/updateClass/:id", (req, res) => {
      console.log("REQ BODY", req.body);
      const { className, classTeacher, feesForTheTime, classSize } = req.body;
      const id = req.params.id;
      console.log("id", id);
      const sqlUpdate =
        "UPDATE ClassesTable SET ClassName=?, ClassTeacher=?, FeesForTheTime=?, ClassSize=? WHERE id=?";
      db.query(
        sqlUpdate,
        [className, classTeacher, feesForTheTime, classSize, id],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log(
              "Data Updated successfully",
              className,
              classTeacher,
              feesForTheTime,
              classSize
            );
            res.status(200).json({ message: "Data updated successfully" }); // Send a success response
          }
        }
      );
    });

    app.post("/api/updateGrade/:id", (req, res) => {
      console.log("REQ BODY", req.body);
      const { gradeName, minGradePoint, maxGradePoint } = req.body;
      const id = req.params.id;
      console.log("id", id);
      const sqlUpdate =
        "UPDATE Grades SET GradeName=?, MinGrade=?, MaxGrade=? WHERE id=?";
      db.query(
        sqlUpdate,
        [gradeName, minGradePoint, maxGradePoint, id],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Data Updated successfully");
            res.status(200).json({ message: "Data updated successfully" });
          }
        }
      );
    });

    app.post("/api/updateSubject/:id", (req, res) => {
      console.log("REQ BODY", req.body);
      const { subjectName } = req.body;
      const id = req.params.id;
      console.log("id", id);
      const sqlUpdate = "UPDATE Subjects SET SubjectName=? WHERE id=?";
      db.query(sqlUpdate, [subjectName, id], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Data Updated successfully");
          res.status(200).json({ message: "Data updated successfully" }); // Send a success response
        }
      });
    });

    app.post("/api/makePayment", (req, res) => {
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

      const sqlInsert =
        "INSERT INTO Payments (StudentId, AmountPaid, InitialAccountBalance, CurrentBalance, FeesName, ReceivedFrom, Comment, StudentName, ReceivedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        sqlInsert,
        [
          studentId,
          amountReceived,
          amountOwed,
          newBalance,
          feesType,
          receivedFrom,
          comment,
          studentName,
          receivedBy,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            // Get the last inserted ID using LAST_INSERT_ID()
            const lastInsertIdQuery = "SELECT LAST_INSERT_ID() AS paymentId";
            db.query(lastInsertIdQuery, (idError, idResult) => {
              if (idError) {
                console.log(idError);
                res
                  .status(500)
                  .json({ error: "Error getting last inserted ID" });
              } else {
                const paymentId = idResult[0].paymentId;
                // Update the studentDetails table separately
                const sqlUpdate =
                  "UPDATE studentDetails SET AmountOwed = ? WHERE id = ?";
                db.query(
                  sqlUpdate,
                  [newBalance, studentId],
                  (updateError, updateResult) => {
                    if (updateError) {
                      console.log(updateError);
                      res
                        .status(500)
                        .json({ error: "Error updating studentDetails" });
                    } else {
                      // Send the payment ID to the front end
                      res.status(200).json({
                        paymentId,
                        message: "payment completed successfully",
                      });
                    }
                  }
                );
              }
            });
          }
        }
      );
    });

    app.get("/api/searchStaff", (req, res) => {
      const query = req.query.query;
      console.log("query:", query);
      const sanitizedQuery = db.escape("%" + query + "%"); // Sanitize user input
      console.log("sanitizedQuery:", sanitizedQuery);

      const sqlGet = `SELECT * FROM StaffDetails WHERE StaffName LIKE ${sanitizedQuery} AND Deleted = "No" LIMIT 1000`;

      db.query(sqlGet, (err, results) => {
        if (err) {
          console.error("Database error: " + err.message);
          // res.status(500).json({ error: 'Server error' });
          return;
        }

        res.send(results);
      });
    });

    app.get("/api/search", (req, res) => {
      const query = req.query.query;
      const sanitizedQuery = db.escape("%" + query + "%"); // Sanitize user input

      const sqlGet = `SELECT * FROM studentDetails WHERE (StudentName LIKE ${sanitizedQuery} OR ClassName LIKE ${sanitizedQuery}) AND Deleted = "No" ORDER BY ClassName, StudentName LIMIT 10000`;

      db.query(sqlGet, (err, results) => {
        if (err) {
          console.error("Database error: " + err.message);
          res.status(500).json({ error: "Server error" });
          return;
        }

        res.send(results);
      });
    });

    app.get("/api/getStudent/:id", (req, res) => {
      const { id } = req.params;
      const sqlGet =
        "SELECT * FROM studentDetails where id = ? AND Deleted='No' ";
      db.query(sqlGet, id, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Data updated successfully", id);
          // res.status(200).json({ message: "Data updated successfully" });
          res.send(result);
        }
      });
    });

    app.get("/api/getClassAccessment", (req, res) => {
      const classId = req.query.classId;
      const subjectId = req.query.subjectId;
      const year = req.query.year;
      const semester = req.query.semester;

      const sqlGet = `
              SELECT *, 
                     RANK() OVER (ORDER BY TotalScore DESC) AS position
              FROM StudentGrades 
              WHERE ClassID = ? AND Semester = ? AND AcademicYear = ? AND SubjectID = ?;
            `;

      db.query(
        sqlGet,
        [classId, semester, year, subjectId],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Student grades fetched successfully");
            res.send(result);
          }
        }
      );
    });

    app.get(
      "/api/getOneStudentAccessment/:studentId/:classId/:semester/:academicYear",
      (req, res) => {
        console.log("running getOneStudentAccessment");
        const studentId = req.params.studentId;
        const classId = req.params.classId;
        const semester = req.params.semester;
        const academicYear = req.params.academicYear;
        console.log("params", academicYear);

        const sqlGetStudentResult = `SELECT SubjectID, SubjectName, ClassScore, ExamScore, TotalScore, GradeName, Semester,
            (
              SELECT COUNT(DISTINCT sg2.TotalScore) + 1
              FROM StudentGrades sg2
              WHERE sg2.SubjectID = sg.SubjectID AND sg2.Semester = ${semester} AND sg2.AcademicYear = ${academicYear}
              AND sg2.TotalScore > sg.TotalScore
            ) AS StudentPosition
            FROM StudentGrades sg
            WHERE sg.StudentID = ${studentId} AND sg.Semester = ${semester} AND sg.AcademicYear = ${academicYear}
            ORDER BY sg.SubjectID, sg.TotalScore DESC;
          `;

        db.query(sqlGetStudentResult, (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log("results fetched");
            res.send(results);

            // Handle and return the results as needed
          }
        });
      }
    );

    app.get("/api/getAllClassAccessment", (req, res) => {
      const classId = req.query.classId;
      const semester = req.query.semester;
      const academicYear = req.query.year;
    
      // Step 1: Query the database to get distinct subject names
      db.query(
        "SELECT DISTINCT SubjectName FROM StudentGrades WHERE ClassID = ? AND Semester = ? AND AcademicYear = ? AND Deleted='No'",
        [classId, semester, academicYear],
        (subjectError, subjectResults) => {
          if (subjectError) {
            console.log(subjectError);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            const subjects = subjectResults.map((subject) => subject.SubjectName);
    
            // Step 2: Construct the dynamic SQL query to pivot scores
            const subjectColumns = subjects
              .map(
                (subject) =>
                  `MAX(CASE WHEN SubjectName = ? THEN TotalScore ELSE NULL END) AS ${subject}`
              )
              .join(", ");
    
            const dynamicSQL = `
                        SELECT 
                        StudentID, StudentName, ${subjectColumns},
                        SUM(TotalScore) AS total,
                        RANK() OVER (ORDER BY SUM(TotalScore) DESC) AS position
                        FROM StudentGrades
                        WHERE ClassID = ? AND Semester = ? AND AcademicYear = ? AND Deleted='No'
                        GROUP BY StudentID
                        ORDER BY total DESC;
                    `;
    
            // Prepare an array of parameters for the dynamic SQL query
            const queryParams = [...subjects, classId, semester, academicYear];
    
            // Now you can execute the dynamic SQL query with parameterized values
            db.query(dynamicSQL, queryParams, (error, results) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                // console.log(results);
                res.send(results);
    
                // Handle and return the results as needed
              }
            });
          }
        }
      );
    });
    

    app.get("/api/getClassStudent/:classId", (req, res) => {
      const { classId } = req.params;
      console.log("classId", classId);
      const sqlGet = `SELECT studentDetails.*, ParentGuardianDetails.ContactNumber AS Contact
        FROM studentDetails
        LEFT JOIN ParentGuardianDetails ON studentDetails.ParentID = ParentGuardianDetails.id
        WHERE studentDetails.ClassID = ? AND studentDetails.Deleted = 'No';`;
      db.query(sqlGet, [classId], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Student gotten successfully");
          // res.status(200).json({ message: "Data updated successfully" });
          res.send(result);
        }
      });
    });

    app.post("/api/updateStudent/:id", upload.single("image"), (req, res) => {
      // console.log('req file', req.file)
      console.log("REQ BODY", req.body);
      const { id } = req.params;
      console.log("id", id);

      // Extract student details from the request body
      var {
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

      const image = req.file ? req.file.filename : null;
      let useParentNameS;
      let [useParentSId, useParentMId, useStudentId] = "";

      const updateParent = (
        parentName,
        parentTel,
        parentMail,
        parentAddress,
        parentid
      ) => {
        console.log("logging", id);

        const sqlUpdateParent =
          "UPDATE ParentGuardianDetails SET ParentName=?, ContactNumber=?, Email=?, ResidenceAddress=? WHERE id=?";
        db.query(
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
          "UPDATE studentDetails SET StudentName=?, ClassName=?, AmountOwed=?, DateOfBirth=?, Gender=?, ParentID=?, Image=?, Address=? WHERE id=?";
        db.query(
          sqlUpdate,
          [
            studentName,
            studentClass,
            amountOwed,
            dateOfBirth,
            gender,
            paID,
            image,
            address,
            id,
          ],
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              console.log("Student data updated successfully");
              useStudentId = result.insertId;
            }
          }
        );
      };

      const updateParentStudentMapping = (parentid, studentid, relation) => {
        const sqlUpdateMapping =
          "UPDATE ParentStudentMapping SET ParentId=?, StudentId=?, RelationToWard=? WHERE StudentId=?";
        db.query(
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

      console.log("done uplading parents1");

      updateParent(
        custompPrentNameS,
        customParentNameSTel,
        customParentNameSMail,
        parentNameSAddress,
        +parentSId
      );

      console.log("done uplading parents2");

      updateStudent(parentMId);

      console.log("done updading student");

      updateParentStudentMapping(parentMId, stuId, customParentNameMRelation);

      console.log("done uplading updateParentStudentMapping 1");

      updateParentStudentMapping(parentSId, stuId, customParentNameSRelation);

      console.log("done uplading updateParentStudentMapping 2");

      console.log("finished if statement", parentSId, parentMId);
    });

    app.get("/api/getGrades", (reg, res) => {
      const sqlGet = "SELECT * FROM Grades WHERE Deleted='No'";
      db.query(sqlGet, (error, result) => {
        console.log("results");
        res.send(result);
      });
    });

    app.get("/api/getSubjects", (reg, res) => {
      const sqlGet = "SELECT * FROM Subjects WHERE Deleted='No'";
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getClasses/:id", (req, res) => {
      const { id } = req.params;
      const sqlGet = "SELECT * FROM ClassesTable WHERE id = ? AND Deleted='No'";
      db.query(sqlGet, id, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getSubject/:id", (req, res) => {
      const { id } = req.params;
      const sqlGet = "SELECT * FROM Subjects WHERE id = ? AND Deleted='No'";
      db.query(sqlGet, id, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getGrade/:id", (req, res) => {
      const { id } = req.params;
      const sqlGet = "SELECT * FROM Grades WHERE id = ? AND Deleted='No'";
      db.query(sqlGet, id, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getParents/", (req, res) => {
      const { id } = req.params;

      const sqlGet = "SELECT * FROM ParentGuardianDetails";
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getParents/:id", (req, res) => {
      const { id } = req.params;
      const sqlGet = "SELECT * FROM ParentGuardianDetails where id = ?";
      db.query(sqlGet, id, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Data fetched successfully", id);
          // res.status(200).json({ message: "Data updated successfully" });
          res.send(result);
        }
      });
    });

    app.get("/api/getStudentParentsMapping/:id", (req, res) => {
      const { id } = req.params;
      const sqlGet = "SELECT * FROM ParentStudentMapping where StudentId = ?";
      db.query(sqlGet, id, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Data fetched successfully", id);
          // res.status(200).json({ message: "Data updated successfully" });
          res.send(result);
        }
      });
    });

    app.get("/api/getStudents", (reg, res) => {
      const sqlGet =
        "SELECT * FROM studentDetails WHERE Deleted = 'No' ORDER BY ClassName, StudentName ";
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getClasses", (re, res) => {
      const sqlGet = `
            SELECT
                CT.id AS id,
                CT.ClassName AS ClassName,
                CT.ClassTeacher,
                COUNT(ST.id) AS ClassSize
            FROM ClassesTable CT
            LEFT JOIN studentDetails ST ON CT.id = ST.ClassID
            WHERE CT.Deleted = 'No'
            GROUP BY CT.id, CT.ClassName
            ORDER BY CT.ClassName;
            `;
      db.query(sqlGet, (error, result) => {
        res.send(result);
        // console.log(result)
      });
    });

    app.get("/api/getExpenses", (reg, res) => {
      const sqlGet =
        "SELECT * FROM Expenses WHERE Deleted = 'No' ORDER BY id DESC ";
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getStaff", (reg, res) => {
      const sqlGet =
        "SELECT * FROM StaffDetails WHERE Deleted = 'No' ORDER BY id DESC ";
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getStaff/:id", (req, res) => {
      const { id } = req.params;
      console.log("running getstaff id", id);
      const sqlGetStaff =
        "SELECT * FROM StaffDetails WHERE id=? AND Deleted = 'No' ORDER BY id DESC ";
      db.query(sqlGetStaff, [id], (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getPayments", (reg, res) => {
      const sqlGet =
        "SELECT * FROM Payments WHERE Deleted = 'No' ORDER BY id DESC ";
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getExpensesForDay", (req, res) => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const formattedDate = `${year}-${month}-${day}`;
      console.log("formattedDate", formattedDate);
      const sqlGet =
        "SELECT * FROM Expenses WHERE DATE(DateAdded) = DATE(?) AND Deleted = 'No' ORDER BY id DESC ";
      db.query(sqlGet, [formattedDate], (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getExpensesForWeek", (req, res) => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const formattedDate = `${year}-${month}-${day}`;
      // console.log('formattedDate222', formattedDate)

      // Calculate the start date of the current week (assuming the week starts on Sunday)
      const startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Go back to the beginning of the week

      // Calculate the end date of the current week (assuming the week ends on Saturday)
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // Go to the end of the week

      const sqlGet =
        "SELECT * FROM Expenses WHERE DateAdded BETWEEN ? AND ? AND Deleted = 'No' ORDER BY id DESC";
      db.query(sqlGet, [startDate, endDate], (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getExpensesForDate", (req, res) => {
      let endDate = req.query.endDate;
      let startDate = req.query.startDate;
      console.log("endDate", endDate, startDate);

      const sqlGet =
        "SELECT * FROM Expenses WHERE DateAdded BETWEEN ? AND ? AND Deleted = 'No' ORDER BY id DESC";
      db.query(sqlGet, [startDate, endDate], (error, result) => {
        if (result) {
          // res.status(200).json({ result, message: "password updated successfully" }); // Send a success response
          res.send(result);
          // console.log("result", result);
        } else {
          res
            .status(200)
            .json({ error, message: "password updated successfully" }); // Send a success response
        }
      });
    });

    app.get("/api/getPaymentsForDay", (req, res) => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const formattedDate = `${year}-${month}-${day}`;
      console.log("formattedDate", formattedDate);
      const sqlGet =
        "SELECT * FROM Payments WHERE DATE(PaymentDate) = DATE(?) AND Deleted = 'No' ORDER BY id DESC ";
      db.query(sqlGet, [formattedDate], (error, result) => {
        if (result) {
          res.send(result);
        }
      });
    });

    app.get("/api/getPaymentsForWeek", (req, res) => {
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
        "SELECT * FROM Payments WHERE PaymentDate BETWEEN ? AND ? AND Deleted = 'No' ORDER BY id DESC";
      db.query(sqlGet, [startDate, endDate], (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getPaymentsForDate", (req, res) => {
      let endDate = req.query.endDate;
      let startDate = req.query.startDate;
      console.log("endDate", endDate, startDate);

      const sqlGet =
        "SELECT * FROM Payments WHERE PaymentDate BETWEEN ? AND ? AND Deleted = 'No' ORDER BY id DESC";
      db.query(sqlGet, [startDate, endDate], (error, result) => {
        if (error) {
          console.log("error", error);
          res
            .status(200)
            .json({ error, message: "password updated successfully" }); // Send a success response
        } else {
          res.send(result);
          console.log("result", result);
        }
      });
    });

    app.get("/api/getStudentsOwing", (req, res) => {
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
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/searchStudentOwing", (req, res) => {
      const query = req.query.query;
      console.log("query:", query);
      const sanitizedQuery = db.escape("%" + query + "%"); // Sanitize user input
      console.log("sanitizedQuery:", sanitizedQuery);

      const sqlGet = `SELECT * FROM studentDetails WHERE AmountOwed>0 AND StudentName LIKE ${sanitizedQuery} AND Deleted = "No" ORDER BY AmountOwed DESC LIMIT 1000`;

      db.query(sqlGet, (err, results) => {
        if (err) {
          console.error("Database error: " + err.message);
          // res.status(500).json({ error: 'Server error' });
          return;
        }

        res.send(results);
      });
    });

    app.get("/api/getNewStudentsForDay", (req, res) => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const formattedDate = `${year}-${month}-${day}`;
      console.log("formattedDate", formattedDate);
      const sqlGet =
        "SELECT * FROM studentDetails WHERE DATE(DateAdded) = DATE(?) AND Deleted = 'No' ORDER BY id DESC ";
      db.query(sqlGet, [formattedDate], (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/getPayments/:id", (req, res) => {
      const { id } = req.params;
      console.log("req.params:", id);
      const sqlGet = "SELECT * FROM Payments WHERE id=? AND Deleted = 'No'";
      db.query(sqlGet, id, (error, result) => {
        res.send(result);
        // console.log('result', result)
      });
    });

    app.get("/api/getStudentPayments/:studentId", (req, res) => {
      const { studentId } = req.params;
      const sqlGet =
        "SELECT * FROM Payments WHERE StudentId=? AND Deleted = 'No' ORDER by id DESC";
      db.query(sqlGet, studentId, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/searchPayments", (req, res) => {
      const query = req.query.query;
      console.log("query:", query);
      const sanitizedQuery = db.escape("%" + query + "%"); // Sanitize user input

      const sqlGet = `SELECT * FROM Payments WHERE StudentName LIKE ${sanitizedQuery} OR Comment LIKE ${sanitizedQuery} OR ReceivedFrom LIKE ${sanitizedQuery} OR FeesName LIKE ${sanitizedQuery} AND Deleted = 'No' ORDER BY id DESC`;
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/searchClasses", (req, res) => {
      const query = req.query.query;
      console.log("query:", query);
      const sanitizedQuery = db.escape("%" + query + "%"); // Sanitize user input

      // const sqlGet = `SELECT * FROM ClassesTable WHERE (ClassName LIKE ${sanitizedQuery} OR ClassTeacher LIKE ${sanitizedQuery}) AND Deleted = 'No' ORDER BY id DESC`;
      const sqlGet = `
            SELECT
                CT.id AS id,
                CT.ClassName AS ClassName,
                CT.ClassTeacher,
                COUNT(ST.id) AS ClassSize
            FROM ClassesTable CT
            LEFT JOIN studentDetails ST ON CT.id = ST.ClassID
            WHERE (CT.ClassName LIKE ${sanitizedQuery} OR CT.ClassTeacher LIKE ${sanitizedQuery}) AND CT.Deleted = 'No'
            GROUP BY CT.id, CT.ClassName
            ORDER BY CT.ClassName;
            `;
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/searchExpenses", (req, res) => {
      const query = req.query.query;
      console.log("query:", query);
      const sanitizedQuery = db.escape("%" + query + "%"); // Sanitize user input

      const sqlGet = `SELECT * FROM Expenses WHERE (Purpose LIKE ${sanitizedQuery} OR AmountPaid LIKE ${sanitizedQuery} OR Receipient LIKE ${sanitizedQuery}) AND Deleted = 'No' ORDER BY id DESC`;
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/searchSubject", (req, res) => {
      const query = req.query.query;
      console.log("query:", query);
      const sanitizedQuery = db.escape("%" + query + "%"); // Sanitize user input

      const sqlGet = `SELECT * FROM Subjects WHERE SubjectName LIKE ${sanitizedQuery} AND Deleted = 'No'`;
      db.query(sqlGet, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/deleteStudents/:id", (req, res) => {
      const studentId = parseInt(req.params.id);
      const sqlDelete = "UPDATE studentDetails SET Deleted='Yes' WHERE id=?";
      db.query(sqlDelete, studentId, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/deleteSubject/:id", (req, res) => {
      const subjectId = parseInt(req.params.id);
      const sqlDelete = "UPDATE Subjects SET Deleted='Yes' WHERE id=?";
      db.query(sqlDelete, subjectId, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/deleteGrade/:id", (req, res) => {
      const gradeId = parseInt(req.params.id);
      const sqlDelete = "UPDATE Grades SET Deleted='Yes' WHERE id=?";
      db.query(sqlDelete, gradeId, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/deleteClass/:id", (req, res) => {
      const classId = parseInt(req.params.id);
      const sqlDelete = "UPDATE ClassesTable SET Deleted='Yes' WHERE id=?";
      db.query(sqlDelete, classId, (error, result) => {
        res.send(result);
      });
    });

    app.get("/api/deleteStaff/:id", (req, res) => {
      const studentId = parseInt(req.params.id);
      const sqlDelete = "UPDATE StaffDetails SET Deleted='Yes' WHERE id=?";
      db.query(sqlDelete, studentId, (error, result) => {
        res.send(result);
      });
    });

    const fetchData = (table) => {
      app.get("/api/get/", (reg, res) => {
        const sqlGet = `SELECT * FROM ${table}`;
        db.query(sqlGet, (error, result) => {
          res.send(result);
        });
      });
    };

    connection.release();
  }
});

app.use("/uploads", express.static("uploads"));
app.listen(5050, () => {
  console.log("server running on port 5050");
});
