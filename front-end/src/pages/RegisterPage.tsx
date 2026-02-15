import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";

export default function RegisterPage() {
  const [err, setErr] = useState("");

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const firstNameValue = firstNameRef.current?.value;
    const lastNameValue = lastNameRef.current?.value;
    const emailValue = emailRef.current?.value;
    const passwordValue = passwordRef.current?.value;

    // Make the call to API to create the user
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstNameValue,
        lastName: lastNameValue,
        email: emailValue,
        password: passwordValue,
      }),
    });
    // Log the response from the API
    const data = await response.json();
    console.log("API Response:", data);
    
    if (!response.ok) {
      setErr(data);
      return;
    }
  };

  return (
    <Container>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Register New Account</Typography>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "8px",
            mt: 2,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            inputRef={firstNameRef}
            id="firstName"
            label="FirstName"
            variant="outlined"
          />
          <TextField
            inputRef={lastNameRef}
            id="lastName"
            label="LastName"
            variant="outlined"
          />
          <TextField
            inputRef={emailRef}
            id="email"
            label="Email"
            variant="outlined"
          />
          <TextField
            inputRef={passwordRef}
            id="password"
            label="Password"
            type="password"
            variant="outlined"
          />
          <Button onClick={handleSubmit} variant="contained">
            Register
          </Button>
          {err && <Typography sx={{textAlign:"center"}} color="error">{err}</Typography>}
        </Box>
      </Box>
    </Container>
  );
}
