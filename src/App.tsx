import React, { ChangeEvent, DragEvent, useEffect, useState } from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";
import { IProfile } from "./interfaces";

function App() {
  const [alertLevel, setAlertLevel] = useState<string>("secondary");
  const [loadedStatus, setLoadedStatus] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Drag a file into the box below to begin");
  const [hasHeaders, setHasHeaders] = useState<boolean>(true);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedHeaders, _setSelectedHeaders] = useState<string[]>([]);
  const [profileName, setProfileName] = useState<string>("");

  const [rows, setRows] = useState<string[]>([]);
  const [filterColumn, setFilterColumn] = useState<string>("");
  const [filterColumnValues, setFilterColumnValues] = useState<string[]>([]);
  const [selectedFilterColumnValues, _setSelectedFilterColumnValues] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [profiles, _setProfiles] = useState<IProfile[]>([
    // {
    //   name: "profile1",
    //   hasHeaders: true,
    //   filterColumn: "department",
    //   selectedFilterColumnValues: ["Defence", "Management"],
    //   selectedHeaders: ["firstName", "lastName", "department"],
    // },
  ]);

  const setProfiles = (profiles: IProfile[]) => {
    localStorage.setItem("csv-filter-profiles", JSON.stringify(profiles));
    _setProfiles(profiles);
  };

  const setSelectedHeaders = (e: ChangeEvent<HTMLSelectElement>) => {
    const options: HTMLCollectionOf<HTMLOptionElement> = e.target.selectedOptions;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    _setSelectedHeaders(selected);
  };

  const setHeadersFromRows = () => {
    if (rows.length === 0) return;
    if (!hasHeaders) {
      const headers: string[] = [];
      for (let i: number = 0; i < rows[0].split(",").length; i++) {
        headers.push(`Column ${i + 1}`);
      }
      setHeaders(headers);
      return;
    }
    const headers: string[] = rows[0].split(",");
    //trimmed headers
    for (let i = 0; i < headers.length; i++) {
      headers[i] = headers[i].trim();
    }
    setHeaders(headers);
  };

  const setFilterColumnValuesFromRows = (filter: string | undefined) => {
    filter = filter ?? filterColumn;
    if (rows.length === 0) return;
    const filterColumnValues: string[] = [];
    const filterColumnIndex: number = headers.indexOf(filter);
    for (let i: number = 1; i < rows.length; i++) {
      const rowSplit: string[] = rows[i].split(",");
      const value: string = rowSplit[filterColumnIndex]?.trim();
      if (!filterColumnValues.includes(value)) {
        filterColumnValues.push(value);
      }
    }
    setFilterColumnValues(filterColumnValues);
  };

  const setSelectedFilterColumnValues = (e: ChangeEvent<HTMLSelectElement>) => {
    const options: HTMLCollectionOf<HTMLOptionElement> = e.target.selectedOptions;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    _setSelectedFilterColumnValues(selected);
  };

  const loadProfile = () => {
    const profile: IProfile = profiles[0];
    setHasHeaders(profile.hasHeaders);
    setFilterColumn(profile.filterColumn);
    _setSelectedHeaders(profile.selectedHeaders);
  };

  const saveProfile = (profName: string | undefined) => {
    profName = profName ?? profileName;
    if (profName === "") return;
    const profile: IProfile = {
      name: profileName,
      hasHeaders: hasHeaders,
      filterColumn: filterColumn,
      selectedFilterColumnValues: selectedFilterColumnValues,
      selectedHeaders: selectedHeaders,
    };
    if (profiles.findIndex((p) => p.name === profName) !== -1) {
      const newProfiles: IProfile[] = [...profiles];
      newProfiles[profiles.findIndex((p) => p.name === profName)] = profile;
      setProfiles(newProfiles);
      return;
    } else {
      const newProfiles: IProfile[] = [...profiles];
      newProfiles.push(profile);
      setProfiles(newProfiles);
    }
    setSelectedProfile(profileName);
  };

  const deleteProfile = (profName: string | undefined) => {
    profName = profName ?? profileName;
    if (profName === "") return;
    const newProfiles: IProfile[] = [...profiles];
    newProfiles.splice(
      profiles.findIndex((p) => p.name === profName),
      1
    );
    setProfiles(newProfiles);
  };

  const readFile = (file: File) => {
    var reader: FileReader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      var contents = e.target?.result;
      if (typeof contents !== "string") return;
      setStatus(`Parsing data from ${file.name}`);
      setAlertLevel("info");
      setLoadedStatus(true);
      //get headers from first row
      contents = contents.replace(/\r/g, "");
      const rows = contents.split("\n");
      setRows(rows);
    };
    reader.readAsText(file);
  };

  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    var files: FileList = e.dataTransfer.files;
    readFile(files[0]);
    setLoadedStatus(true);
    setStatus(`Parsing data from ${files[0]?.name}`);
    setAlertLevel("info");
  };

  const handleOnDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const saveData = (blob: Blob, filename: string) => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display:none");
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportFile = () => {
    const newRows: string[] = [];
    const headerIndices: number[] = [];
    //get indices of selected headers

    for (let i: number = 0; i < selectedHeaders.length; i++) {
      headerIndices.push(headers.indexOf(selectedHeaders[i]));
    }
    const filterColumnIndex = headers.indexOf(filterColumn);

    newRows.splice(0, 1);

    if (!hasHeaders) {
      const newHeaderRow: string[] = [];
      for (let i: number = 0; i < headerIndices.length; i++) {
        newHeaderRow.push(headers[headerIndices[i]]);
      }
      newRows.push(newHeaderRow.join(","));
    }

    for (let i: number = 0; i < rows.length; i++) {
      const rowSplit: string[] = rows[i].split(",");
      const newRow: string[] = [];
      var keepRow: boolean = true;

      for (let j: number = 0; j < headerIndices.length; j++) {
        const val = rowSplit[headerIndices[j]].trim();
        if (i > 0 && headerIndices[j] === filterColumnIndex && !selectedFilterColumnValues.includes(val)) {
          keepRow = false;
          break;
        }
        newRow.push(val);
      }
      if (keepRow) {
        newRows.push(newRow.join(","));
      }
    }
    const blob = new Blob([newRows.join("\n")], { type: "text/csv" });
    saveData(blob, "filtered.csv");
  };

  useEffect(() => {
    setHeadersFromRows();
  }, [hasHeaders, rows]);

  useEffect(() => {
    setFilterColumnValuesFromRows(undefined);
  }, [headers, filterColumn]);

  useEffect(() => {
    _setSelectedFilterColumnValues(profiles[profiles.findIndex((p) => p.name === selectedProfile)]?.selectedFilterColumnValues);
  }, [filterColumnValues]);

  useEffect(() => {
    if (selectedProfile === "") return;
    loadProfile();
  }, [selectedProfile]);

  useEffect(() => {
    setProfiles(JSON.parse(localStorage.getItem("csv-filter-profiles") || "[]"));
  }, []);

  return (
    <div className="App mb-4">
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <h1 className="display-1">CSV Filter</h1>
          </div>
        </div>
      </div>
      <div className="container text-center">
        <hr />
      </div>
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <h5>Data Privacy Statement</h5>
            <p>
              This app works client-side (processed by your browser) and no data is collected, stored or managed by this application. When the Save
              File(s) button is clicked a file is generated locally in your browser and will automatically download to your machine as a compressed
              archive.
            </p>
          </div>
          <hr />
        </div>
      </div>
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <p className={`alert alert-${alertLevel}`} id="file_name">
              <strong>{loadedStatus ? "" : "No "}File Loaded</strong> {status}
            </p>
            {loadedStatus ? (
              <></>
            ) : (
              <div id="drop_zone" onDragOver={(e) => handleOnDragOver(e)} onDrop={(e) => handleOnDrop(e)}>
                <p>DROP CSV FILE&nbsp;HERE</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row mt-4">
          <div className="col">
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <h3>Profiles</h3>
            <p className="text-muted">Select a profile to load</p>
            <div className="row">
              <div className="col-5">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => setSelectedProfile(e.target.value)}
                  value={selectedProfile}
                >
                  <option value="">Select a profile</option>
                  {profiles.map((profile, index) => {
                    return (
                      <option key={index} value={profile.name}>
                        {profile.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <h3>Options</h3>
            <h5>Headers</h5>
            <div className="form-check">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`flexSwitchCheckDefault`}
                  checked={hasHeaders}
                  onChange={() => {
                    setHasHeaders(!hasHeaders);
                  }}
                />
                <label className="form-check-label" htmlFor={`flexSwitchCheckDefault`}>
                  Has Headers?
                </label>
              </div>
            </div>

            <h5 className="mt-4">Select Columns</h5>
            <p className="text-muted">Select the columns to you wish to keep (CTRL/SHIFT for multi-select)</p>
            <select
              className="form-select"
              aria-label="Desired Values"
              multiple
              size={10}
              onChange={(e) => setSelectedHeaders(e)}
              value={selectedHeaders}
            >
              {headers.map((header, i) => (
                <option key={`header_${i}`} value={header}>
                  {header}
                </option>
              ))}
            </select>

            <h5 className="mt-4">Select Filter Column</h5>
            <p className="text-muted">Select the columns you wish to filter the list on</p>
            <select className="form-select" aria-label="Desired Values" onChange={(e) => setFilterColumn(e.target.value)} value={filterColumn}>
              <option value="">Select a column</option>
              {headers.map((header, i) => (
                <option key={`header_${i}`} value={header}>
                  {header}
                </option>
              ))}
            </select>

            <h5 className="mt-4">Select Desired Values</h5>
            <p className="text-muted">Select the values from the filter column you wish to keep</p>
            <select
              className="form-select"
              aria-label="Desired Values"
              multiple
              size={10}
              onChange={(e) => setSelectedFilterColumnValues(e)}
              value={selectedFilterColumnValues}
            >
              {filterColumnValues.map((filterColumnValue, i) => (
                <option key={`filterColumnValue_${i}`} value={filterColumnValue}>
                  {filterColumnValue}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <h4>Profile Management</h4>
            <div className="input-group mb-3">
              <span className="input-group-text">Profile Name</span>
              <input
                type="text"
                className="form-control"
                placeholder="Profile Name"
                aria-label="profile name"
                onChange={(e) => setProfileName(e.target.value)}
                value={profileName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveProfile(undefined);
                    setProfileName("");
                  }
                }}
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  saveProfile(undefined);
                  setProfileName("");
                }}
              >
                Save Profile
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setSelectedProfile("");
                  deleteProfile(profileName);
                }}
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <button className="btn btn-primary" onClick={() => exportFile()}>
              Export CSV File
            </button>
            <button className="btn btn-secondary mx-4" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
