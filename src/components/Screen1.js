import React, { useState, useEffect } from "react";
import { FileUploader, Button } from "@carbon/react";
import axios from "axios";
import "./Screen1.scss";
import { Link } from 'react-router-dom';
import { CheckmarkFilled } from '@carbon/icons-react';

const Screen1 = () => {
  const [data, setData] = useState(null);
  const [fileSelected, setFileSelected] = useState(false); // Track whether a file is selected
  const [showSheetNames, setShowSheetNames] = useState(true); // Track whether to show sheet names
  const [sheetIndex, setSheetIndex] = useState(0); // Track index of sheet name being displayed

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && sheetIndex < data.sheetNames.length) {
        setSheetIndex(sheetIndex + 1);
      }
    }, 500); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer);
  }, [sheetIndex, data]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setData(response.data);
      setFileSelected(true);
      setShowSheetNames(true);
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  return (
    <div className="screen1">
      <div className="app">
        <div className="cds--file__container">
          <FileUploader
            labelTitle="Upload the data you want to query:"
            labelDescription="Max file size is 500mb. Only .xlsx files are supported."
            buttonLabel="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Upload"
            buttonKind="primary"
            size="md"
            filenameStatus="edit"
            accept={['.xlsx']}
            multiple={false}
            disabled={false}
            iconDescription="Delete file"
            onChange={(event) => {
              if (event.target.files.length > 0) {
                handleFileUpload(event);
                setSheetIndex(0);
              } else {
                setShowSheetNames(false);
              }
            }}
            name=""
            onDelete={() => {
              setShowSheetNames(false);
              setFileSelected(false);
            }}
          />
          <br />
          {!fileSelected && <p style={{ color: 'red' }}>No file selected!</p>}
          <Link to="/">
            <Button kind="tertiary">
              Return Home
            </Button>
          </Link>
          <div className="submit-button">
            <Link to={fileSelected ? "/Screen2" : "#"}>
              <Button kind="primary" disabled={!fileSelected}>
                Submit
              </Button>
            </Link>
          </div>
        </div>
        {data && (
          <div className="sheet-list">
            {data.fileType === 'XLSX' && showSheetNames && (
              <div className="sheet-names">
                <h4>Key Data Points Extracted:</h4>
                <br></br>
                {data.sheetNames.slice(0, sheetIndex).map((sheetName, index) => (
                  <div className="sheet" key={index}>
                    <div className="sheet-name">{sheetName}</div>
                    <div className="tick-mark"><CheckmarkFilled size="16"/></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="bg-gray-100">
        <p className="text-sm">IBM Client Engineering </p>
      </footer>
    </div>
  );
};

export default Screen1;
