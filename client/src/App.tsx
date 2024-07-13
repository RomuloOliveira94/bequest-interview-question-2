import React, { useEffect, useState } from "react";
import { Block } from "./types/types";

const API_URL = "http://localhost:8080";

//user has a backup key for any case
const BACKUP_KEY = "password";

function App() {
  const [data, setData] = useState<string>('');
  const [block, setBlock] = useState<Block>();
  const [validatedMessage, setValidatedMessage] = useState<string>();
  const [isValidChain, setIsValidChain] = useState<boolean>(true);

  useEffect(() => {
    getData();
  },[]);

  const getData = async () => {
    const request = await fetch(API_URL);
    const response = await request.json(); 

    if(response.status === 404) {
      setIsValidChain(false); 
      setData('Invalid Data');
      setValidatedMessage(response.message);
      return;
    }

    if(response.status === 500) {
      setData('Technical problems please try again later');
      setValidatedMessage(response.message);
      return;
    }

    setData(response.data);
  };

  const updateData = async () => {
    const request = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const response = await request.json();

    if(response.status === 404) {
      setIsValidChain(false); 
      setData('Invalid Data');
      setValidatedMessage(response.message);
      return;
    }

    if(response.status === 500) {
      setData('Technical problems please try again later');
      setValidatedMessage(response.message);
      return;
    }


    await getData();
  };

  const verifyData = async () => {
   const request = await fetch(`${API_URL}/verify`, {
      method: "POST",
      body: JSON.stringify({ block }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();

    if(response.status === 404) {
      setIsValidChain(false); 
      setData('Invalid Data');
      setValidatedMessage(response.message);
      return;
    }

    setValidatedMessage(response.message);

    await getData();
  };

  const restoreData = async () => {
    const request = await fetch(`${API_URL}/restore`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();

    if(response.status === 500) {
      setData('Technical problems please try again later');
      setValidatedMessage(response.message);
      return;
    }

    if(request.status === 200) {
      setValidatedMessage(response.message);
      setIsValidChain(true);
    }

    await getData();
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>

      {validatedMessage && <div>{validatedMessage}</div>}

      {!isValidChain && (
        <div>
          <div style={{ display: "grid" }}>
            <p style={{ textAlign: "center" }}>Calm down!</p>
            <button type="button" style={{ fontSize: "20px" }} onClick={restoreData}>
              Click here to restore your data
            </button>
          </div>  
        </div>
      )}

    </div>
  );
}

export default App;
