# CSV Filter

This is application filters a CSV file based on a set of user defined criteria. The application is built using React and Typescript.
The tool gives you options to select columns you want to filter on, the type of filter you want to apply and the value you want to filter on. The tool will then filter the CSV file and return the results in a new CSV file.

Options can be saved and loaded from the browser's local storage. This allows you to quickly load a set of filters you have previously used and apply them to a new CSV file.

## Usage

This application is available for use without installation via GitHub pages. This application can be found here:

https://gcoulby.github.io/csv-filter/

## Instructions

### Loading a CSV file

Drag and drop a CSV file onto the dropzone. The CSV file will be loaded into the application and the columns will be displayed in the column selector.

### Selecting columns

Select the columns you want to filter on by clicking on the column name in the column selector. The column will be highlighted when selected. You can use CTRL and SHIFT to select multiple columns.

### Selecting a filter column

Select the column you want to filter using the filter column dropdown.

### Selecting values to filter on

Select the values you want to filter on using the filter values dropdown. You can use CTRL and SHIFT to select multiple values. The values in the dropdown are populated from the values in the selected filter column.

### Saving a profile

Type a name for the profile in the profile name input box and click the save button. The profile will be saved to the browser's local storage.

### Loading a profile

There is a dropdown at the top of the application that lists all the profiles that have been saved to the browser's local storage. Select a profile from the dropdown to load it.

### Saving a CSV file

Click the Export CSV File button to save the filtered CSV file to your computer.

---

# Installation

To install this application run the following command to clone the repository and change the active directory to the newly cloned repo.

```bash
$ git clone https://github.com/gcoulby/csv-filter.git
$ cd csv-filter
```

Then follow the getting started instructions below.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
