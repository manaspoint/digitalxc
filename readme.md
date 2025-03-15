# Secret Santa Assignment

## Overview

This project is a Secret Santa Assignment System designed using the MVC pattern in Node.js. It automates the process of assigning Secret Santa pairs while ensuring fairness and avoiding repeated assignments from the previous year.

## Features

Uses MVC (Model-View-Controller) architecture for modularity and scalability.

Supports input via a single employee CSV file or previous year's assignment CSV file.

Ensures each employee has one unique Secret Child.

Prevents employees from getting assigned to themselves.

Avoids assigning the same Secret Child as the previous year.

Can run with one CSV file, but will not work if the file contains only two employees (as pairing is not possible).

Runs using npm start.

## Installation

Clone the repository:

git clone https://github.com/manaspoint/digitalxc.git
cd digitalxc

Install dependencies:

npm install

Start the application:

npm start

Usage

Input Files

The application accepts CSV files with the following formats:

## Employee CSV File (Single-year assignments)

Employee_Name,Employee_EmailID
John Doe,john@example.com
Jane Smith,jane@example.com

## Previous Year Assignment CSV File (To avoid repetition)

Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
John Doe,john@example.com,Jane Smith,jane@example.com
Jane Smith,jane@example.com,John Doe,john@example.com

## Running the Application

If you upload a single employee CSV file, it will generate Secret Santa pairs.

If you provide a previous year’s assignment file, it will ensure that pairs are not repeated.

If the file contains only two employees, it will not work.

# Folder Structure (MVC Pattern)

## Error Handling

Invalid CSV format: The program checks for correct file structure.

Duplicate entries: Ensures no duplicates are assigned.

Missing files: Graceful handling for missing input files.

Two-employee limitation: Prevents execution with only two employees.

## License

This project is open-source and free to use under the MIT license.
