const csv = require("csv-parser");
const { Readable } = require("stream");
const response = require("../../commons/response/response");
const statusCode = require("../../commons/utils/statusCode");

const validateFile = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return response.handleErrorResponse(
      {
        errorCode: statusCode.BAD_REQUEST,
        message: "No files uploaded.",
        displayMessage: { error: "Please upload at least one CSV file." },
      },
      res
    );
  }

  const requiredHeaders = {
    empData: ["Employee_Name", "Employee_EmailID"],
    prevEmpData: ["Employee_Name", "Employee_EmailID", "Secret_Child_Name", "Secret_Child_EmailID"],
  };

  try {
    let missingFiles = [];

    for (const key of Object.keys(requiredHeaders)) {
      const file = req.files[key]?.[0];

      if (!file) {
        missingFiles.push(key);
        continue;
      }

      if (!file.mimetype.includes("csv")) {
        return response.handleErrorResponse(
          {
            errorCode: statusCode.BAD_REQUEST,
            message: `Invalid file type for ${file.originalname}.`,
            displayMessage: { error: `File ${file.originalname} is not a valid CSV file.` },
          },
          res
        );
      }

      const headers = await getCSVHeaders(file.buffer);

      if (key === "empData") {
        if (headers.length !== 2 || !requiredHeaders.empData.every((h) => headers.includes(h))) {
          return response.handleErrorResponse(
            {
              errorCode: statusCode.BAD_REQUEST,
              message: `Invalid format for ${file.originalname}.`,
              displayMessage: {
                error: `Invalid format for ${file.originalname}. It should have exactly two headers: Employee_Name, Employee_EmailID.`,
              },
            },
            res
          );
        }
      } else if (key === "prevEmpData") {
        const missingHeaders = requiredHeaders[key].filter((header) => !headers.includes(header));

        if (missingHeaders.length > 0) {
          return response.handleErrorResponse(
            {
              errorCode: statusCode.BAD_REQUEST,
              message: `Invalid format for ${file.originalname}.`,
              displayMessage: { error: `Invalid format for ${file.originalname}. Missing headers: ${missingHeaders.join(", ")}` },
            },
            res
          );
        }
      }
    }

    if (missingFiles.length === Object.keys(requiredHeaders).length) {
      return response.handleErrorResponse(
        {
          errorCode: statusCode.BAD_REQUEST,
          message: "Both empData and prevEmpData files are missing.",
          displayMessage: { error: "Please upload at least one valid CSV file." },
        },
        res
      );
    }

    next();
  } catch (error) {
    console.error("CSV Validation Error:", error);
    return response.handleErrorResponse(
      {
        errorCode: statusCode.INTERNAL_SERVER_ERROR,
        message: "Error processing CSV files.",
        displayMessage: { error: "An error occurred while reading the CSV file. Please check the format and try again." },
      },
      res
    );
  }
};

const getCSVHeaders = (buffer) => {
  return new Promise((resolve, reject) => {
    Readable.from(buffer)
      .pipe(csv())
      .on("headers", (headerList) => resolve(headerList.map((header) => header.trim())))
      .on("error", (error) => reject(error));
  });
};

module.exports = { validateFile };
