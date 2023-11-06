app.post("/api/addStudent", upload.single('image'), (req, res) => {
    console.log('req file', req.file)
    console.log('REQ BODY', req.body)

// Extract student details from the request body
var {
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

} = req.body;

const image = req.file ? req.file.filename : null;
var useParentNameS = '';

parentNameS==='others'? useParentNameS = custompPrentNameS: useParentNameS = parentNameS;


// Define a function to insert the first parent
const insertFirstParent = () => {
    return new Promise((resolve, reject) => {
    if (parentSId === 'others') {
        console.log("ParentGuardianDetails (First Parent)")
        const sqlInsertParent = "INSERT INTO ParentGuardianDetails (ParentName, ContactNumber, Email, ResidenceAddress) VALUES (?, ?, ?, ?) ";
        db.query(sqlInsertParent, [custompPrentNameS, customParentNameSTel, customParentNameSMail, parentNameSAddress], (error, result) => {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log("First parent details inserted successfully");
            resolve(result.insertId); // Resolve with the ID of the inserted first parent
        }
        });
    } else {
        resolve(''); // No first parent details were inserted, resolve with null
    }
    });
};

// Define a function to insert the second parent
const insertSecondParent = (firstParentId) => {

    var useParentSId = ''
    firstParentId==!'' ? useParentSId = firstParentId : useParentSId = parentSId
    console.log('firstParentId', firstParentId, parentSId, useParentSId)
    
    return new Promise((resolve, reject) => {
    if (parentMId === 'others') {
        console.log("ParentGuardianDetails (Second Parent)")
        const sqlInsertParent = "INSERT INTO ParentGuardianDetails (ParentName, ContactNumber, Email, ResidenceAddress, SecondParentID) VALUES (?, ?, ?, ?, ?) ";
        db.query(sqlInsertParent, [customParentNameM, customParentNameMTel, customParentNameMMail, parentNameMAddress, useParentSId], (error, result) => {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log("Second parent details inserted successfully");
            resolve(firstParentId, result.insertId);
            parentMId = result.insertId; 
            console.log('resultInsertid',result.insertId)
        }
        });
    } else {
        console.log("running not M others", parentMId, useParentSId);

        
        const sqlUpdate = "UPDATE ParentGuardianDetails SET SecondParentID = ? WHERE id = ?";
        db.query(
            sqlUpdate,
            [useParentSId, parentMId],
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                const sqlInsert = "INSERT INTO studentDetails (Image, StudentName, Class, AmountOwed, DateOfBirth, Gender, Address, ParentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ";

                console.log("Student updated inserted successfully 2");
              }
            }
            );
            resolve(firstParentId, null); // No second parent details were inserted, resolve with the ID of the first parent
    }
    });
};

// Insert the first parent, then the second parent, and finally student details
insertFirstParent()
    .then((firstParentId) => {
    return insertSecondParent(firstParentId);
    })
    .then((firstParentId, secondParentId) => {
        var useParentMId = ''
        secondParentId==!'' || parentMId==!'others'? useParentMId = secondParentId : useParentMId = parentMId
        console.log('secondParentId', secondParentId, parentMId, useParentMId)
        
    // Use the parent IDs to insert student details
    const sqlInsert = "INSERT INTO studentDetails (Image, StudentName, Class, AmountOwed, DateOfBirth, Gender, Address, ParentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ";
    db.query(
    sqlInsert,
    [image, studentName, studentClass, amountOwed, dateOfBirth, gender, address, useParentMId],
    (error, result) => {
        if (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
        } else {
        console.log("Student data inserted successfully");
        res.status(200).json({ message: "Data inserted successfully" });
        }
    }
    );
})
.catch((error) => {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
});
});