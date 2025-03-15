const csv = require("csvtojson");

const assignSecretSanta = async (files) => {
  try {
    const empDataBuffer = files.empData?.[0]?.buffer;
    const prevEmpDataBuffer = files.prevEmpData?.[0]?.buffer;

    let empDataJson = [];
    let prevEmpDataJson = [];

    if (empDataBuffer) {
      empDataJson = await csv().fromString(empDataBuffer.toString());
    }

    if (prevEmpDataBuffer) {
      prevEmpDataJson = await csv().fromString(prevEmpDataBuffer.toString());
    }

    let empData = empDataJson.map(({ Employee_Name, Employee_EmailID }) => ({
      Employee_Name,
      Employee_EmailID,
    }));

    if (empData.length === 0 && prevEmpDataJson.length > 0) {
      empData = prevEmpDataJson.map(({ Employee_Name, Employee_EmailID }) => ({
        Employee_Name,
        Employee_EmailID,
      }));
    }

    const prevEmpData = prevEmpDataJson.map(({ Employee_Name, Employee_EmailID, Secret_Child_Name, Secret_Child_EmailID }) => ({
      Employee_Name,
      Employee_EmailID,
      Secret_Child_Name,
      Secret_Child_EmailID,
    }));

    const assignChild = await assignSecretChild(empData, prevEmpData);
    return assignChild;
  } catch (error) {
    throw error;
  }
};

const assignSecretChild = async (empData, prevEmpData) => {
  try {
    if (empData.length === 2) {
      throw new Error("You have only 2 employees. Please add more people for Secret Santa.");
    }

    const assignedChildren = new Set();
    const prevAssignments = new Map(prevEmpData.map((emp) => [emp.Employee_EmailID, emp.Secret_Child_EmailID]));
    const prevPairs = new Set(prevEmpData.map((emp) => `${emp.Employee_EmailID}-${emp.Secret_Child_EmailID}`));

    let shuffledEmployees = [...empData];
    let isValidAssignment = false;
    let result = [];

    while (!isValidAssignment) {
      shuffledEmployees.sort(() => Math.random() - 0.5);
      assignedChildren.clear();
      result = [];
      isValidAssignment = true;

      for (let emp of empData) {
        let possibleChildren = shuffledEmployees.filter(
          (child) =>
            child.Employee_EmailID !== emp.Employee_EmailID &&
            !assignedChildren.has(child.Employee_EmailID) &&
            prevAssignments.get(emp.Employee_EmailID) !== child.Employee_EmailID &&
            !prevPairs.has(`${child.Employee_EmailID}-${emp.Employee_EmailID}`)
        );

        if (possibleChildren.length > 0) {
          let selectedChild = possibleChildren[0];
          assignedChildren.add(selectedChild.Employee_EmailID);
          result.push({
            Employee_Name: emp.Employee_Name,
            Employee_EmailID: emp.Employee_EmailID,
            Secret_Child_Name: selectedChild.Employee_Name,
            Secret_Child_EmailID: selectedChild.Employee_EmailID,
          });
        } else {
          isValidAssignment = false;
          break;
        }
      }
    }

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { assignSecretSanta };
