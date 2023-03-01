import { useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const chunkSize = 1048576 * 3;

function App() {

  const [showProgress, setShowProgress] = useState(false);
  const [counter, setCounter] = useState(1);
  const [fileToBeUpload, setFileToBeUpload] = useState({});
  const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0);
  const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize);
  const [progress, setProgress] = useState(0);
  const [fileGuid, setFileGuid] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);

  useEffect(() => {
    if (fileSize > 0) {
      setShowProgress(true);
      fileUpload(counter);
    }
  }, [fileToBeUpload, progress]);

  const onChangeHandler = (e) =>{    
      const _file = e.target.files[0];
      setFileSize(_file.size);
      const _totalCount = _file.size % chunkSize == 0
          ? _file.size / chunkSize
          : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
      setChunkCount(_totalCount);
      setFileToBeUpload(_file);
      const _fileID = uuidv4() + "." + _file.name.split(".").pop();
      setFileGuid(_fileID);
  }

  const fileUpload = () => {
    setCounter(counter + 1);
    if (counter <= chunkCount) {
      var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
      uploadChunk(chunk);
    }
  };

  const uploadChunk = async (chunk) => {
    try {
      const response = await axios.post(
        "https://localhost:44356/weatherforecast/" 
        +"UploadChunks/"+counter+"/"+fileGuid,
        chunk,
        {
          headers: { 
            "API-KEY": "application/json" 
          },
        }
      );
      const data = response.data;
      if (data.isSuccess) {
        setBeginingOfTheChunk(endOfTheChunk);
        setEndOfTheChunk(endOfTheChunk + chunkSize);
        if (counter == chunkCount) {
          console.log("Process is complete, counter", counter);
          await uploadCompleted();
        } else {
          var percentage = (counter / chunkCount) * 100;
          setProgress(percentage);
        }
      } else {
        console.log("Error Occurred:", data.errorMessage);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const uploadCompleted = async () => {
     const response = await axios.post(
      "https://localhost:44356/weatherforecast/"+
      "UploadComplete",
      {
        name: fileGuid
      },
      {
        headers:{
          "API-KEY":""
        }
      }
    );

  const data = response.data;
    if (data.isSuccess) {
      setProgress(100);
    }else{
      console.log(data);
    }
  };

  return (
    <div className="App">
     
     <input type="file"  name="file" onChange={onChangeHandler} accept=".zip"/>
     <p>Progress: {progress}</p>
    </div>
  );
}

export default App;
