import React, { useEffect, useState } from "react";
import { Block } from "./types/types";

const API_URL = "http://localhost:8080";

//user has a backup key for any case
const BACKUP_KEY = "123456";

function App() {
  const [data, setData] = useState<string>("");
  const [block, setBlock] = useState<Block>();
  const [validatedMessage, setValidatedMessage] = useState<string>();
  const [isValidChain, setIsValidChain] = useState<boolean>(true);
  const [backupKey, setBackupKey] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const request = await fetch(API_URL);
    const response = await request.json();
    
    if (response.status === 500) {
      setData("Technical problems please try again later");
      setValidatedMessage(response.message);
      return;
    }

    setBlock(response.block);
    setData(response.block.data);
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

    if (response.status === 406) {
      setIsValidChain(false);
      setData("Invalid Data");
      setValidatedMessage(response.message);
      return;
    }

    if (response.status === 500) {
      setData("Technical problems please try again later");
      setValidatedMessage(response.message);
      return;
    }

    setValidatedMessage(response.message);
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

    if (response.status === 406) {
      setIsValidChain(false);
      setData("Invalid Data");
      setValidatedMessage(response.message);
      return;
    }

    setValidatedMessage(response.message);

    await getData();
  };

  const restoreData = async () => {
    if (backupKey !== BACKUP_KEY || !backupKey) {
      setValidatedMessage("Invalid key");
      return;
    }

    const request = await fetch(`${API_URL}/restore`, {
      method: "POST",
      body: JSON.stringify({ backupKey }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();

    if (response.status === 500) {
      setData("Technical problems please try again later");
      setValidatedMessage(response.message);
      return;
    }

    if (response.status === 401) {
      setValidatedMessage("Key not valid");
      return;
    }

    if (request.status === 200) {
      setValidatedMessage(response.message);
      setIsValidChain(true);
    }

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
      {validatedMessage && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <h3
            style={{
              color: isValidChain ? "green" : "red",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            {validatedMessage}
          </h3>
          <small
            style={{
              fontSize: "19px",
              cursor: "pointer",
              color: "blue",
              marginTop: "10px",
            }}
            onClick={(e) => setValidatedMessage("")}
          >
            clear
          </small>
        </div>
      )}
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

      {!isValidChain && (
        <div>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={{ margin: "0 auto" }}>
              <button
                type="button"
                style={{ fontSize: "20px" }}
                onClick={restoreData}
              >
                Click here to restore your data
              </button>
            </div>
            <div>
              <label>Backup Key</label>
              <input
                style={{ fontSize: "30px" }}
                type="password"
                value={backupKey}
                onChange={(e) => setBackupKey(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
