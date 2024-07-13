import React, { useEffect, useState } from "react";
import { Block } from "./types/types";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>('');
  const [block, setBlock] = useState<Block>();
  const [validatedMessage, setValidatedMessage] = useState<string>();

  useEffect(() => {
    getData();
  },[]);

  const getData = async () => {
    const response = await fetch(API_URL);
    const block = await response.json(); 
    setBlock(block);
    setData(block.data);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
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

    if(response.message === 'Invalid Data') {
      setValidatedMessage('Invalid Data');
      return;
    }

    setValidatedMessage(response.message);

    await getData();
  };

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
    </div>
  );
}

export default App;
