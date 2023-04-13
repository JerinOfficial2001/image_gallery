import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import Loader from "./components/Loader";
import { Stack, Typography } from "@mui/material";

//https://jojdwgktxkbdsdtltmgx.supabase.co/storage/v1/object/public/images/7c492b00-beaf-4fb8-9982-6c7277f391b5/627d5dd3-d61c-40fc-9c10-120cd2bd6122

const CDNURL =
  "https://jojdwgktxkbdsdtltmgx.supabase.co/storage/v1/object/public/images/";

function App() {
  const [loader, setloader] = useState(false);
  const [validator, setvalidator] = useState(false);
  const [validator2, setvalidator2] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [changePage, setchangePage] = useState(false);
  const [images, setimages] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();

  async function getImages() {
    setloader(true);
    const { data, error } = await supabase.storage
      .from("images")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    if (data !== null) {
      setloader(false);
      setimages(data);
    } else {
      console.log(error);
      setloader(false);
    }
  }

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  async function magicLinkLogin() {
    if (email !== "" && password !== "") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        setvalidator(false);
        setvalidator2(true);
      } else {
        setloader(true);
        setvalidator(false);
        setvalidator2(false);
      }
    } else {
      setvalidator(true);
      setvalidator2(false);
    }
    setemail("");
    setpassword("");
  }
  async function signout() {
    await supabase.auth.signOut();
  }

  async function signupHandler() {
    if (email !== "" && password !== "") {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        setvalidator2(true);
        setvalidator(false)
      } else {
        setloader(true);
        alert("check your email");
        setvalidator2(false);
        setvalidator(false)
      }
      setloader(false);
    } else {
      setvalidator(true);
      setvalidator2(false)
    }
    setemail("");
    setpassword("");
   
  }

  //uploadImage

  async function uploadImage(e) {
    setloader(true);
    let file = e.target.files[0];

    const { data, error } = await supabase.storage
      .from("images")
      .upload(user.id + "/" + uuidv4(), file);
    if (data) {
      setloader(false);
      getImages();
    } else {
      console.log(error);
    }
  }

  //delete
  async function deleteImage(imageName) {
    setloader(true);
    const { error } = await supabase.storage
      .from("images")
      .remove([user.id + "/" + imageName]);
    if (error) {
      alert("error");
    } else {
      getImages();
      setloader(false);
    }
  }

  return (
    <>
      {loader && <Loader open={loader} />}
      <Container align="center" className="container-sm mt-4">
        {user === null ? (
          <>
            {!changePage ? (
              <>
                <h1>Welcome</h1>
                <Form
                  style={{
                    maxWidth: "500px",
                    display: "flex",
                    gap: "5px",
                    flexDirection: "column",
                  }}
                >
                  <Form.Group
                    className="mb-3"
                    style={{
                      maxWidth: "500px",
                      display: "flex",
                      gap: "5px",
                      flexDirection: "column",
                    }}
                  >
                    <Form.Label>Sign In</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      onChange={(e) => {
                        setemail(e.target.value);
                      }}
                    />
                    <Form.Control
                      type="password"
                      placeholder="password"
                      onChange={(e) => {
                        setpassword(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Button onClick={() => magicLinkLogin()}>Login</Button>
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <h6>Don't have an account</h6>
                    <div
                      onClick={() => {
                        setchangePage(true);
                        setvalidator(false);
                        setvalidator2(false);
                      }}
                    >
                      <h6
                        style={{
                          color: "#0d6efd",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        sign up
                      </h6>
                    </div>
                  </div>
                  <Stack>
                    {validator && (
                      <Typography color="red">
                        *All fields are mandatory
                      </Typography>
                    )}
                    {validator2 && (
                      <Typography color="red">
                        Email or password incorrect
                      </Typography>
                    )}
                  </Stack>
                </Form>
              </>
            ) : (
              <>
                <h1>Welcome</h1>
                <Form
                  style={{
                    maxWidth: "500px",
                    display: "flex",
                    gap: "5px",
                    flexDirection: "column",
                  }}
                >
                  <Form.Group
                    className="mb-3"
                    style={{
                      maxWidth: "500px",
                      display: "flex",
                      gap: "5px",
                      flexDirection: "column",
                    }}
                  >
                    <Form.Label>Sign up</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      onChange={(e) => {
                        setemail(e.target.value);
                      }}
                    />
                    <Form.Control
                      type="password"
                      placeholder="password"
                      onChange={(e) => {
                        setpassword(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Button onClick={() => signupHandler()}>
                    Create Account
                  </Button>
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <h6>Already have an account</h6>
                    <div
                      onClick={() => {
                        setchangePage(false);
                        setvalidator(false);
                        setvalidator2(false);
                      }}
                    >
                      <h6
                        style={{
                          color: "#0d6efd",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        log in
                      </h6>
                    </div>
                  </div>
                  <Stack>
                    {validator && (
                      <Typography color="red">
                        *All fields are mandatory
                      </Typography>
                    )}
                    {validator2 && (
                      <Typography color="red">try again!</Typography>
                    )}
                  </Stack>
                </Form>
              </>
            )}
          </>
        ) : (
          <>
            <h1>Your ImageWall</h1>
            <Button
              onClick={() => {
                signout();
              }}
            >
              Sign out
            </Button>
            <p>Current user:{user.email}</p>
            <p>
              Use the Choose File button below to upload an image to your
              gallery
            </p>
            <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
              <Form.Control
                type="file"
                onChange={(e) => {
                  uploadImage(e);
                }}
              />
            </Form.Group>
            <hr />
            <h1>Your Images</h1>
            {/* CDNURL + user.id + '/' + image.name  */}
            <Row xs={1} md={3} className="g-4">
              {images?.map((image) => {
                return (
                  <Col key={CDNURL + user.id + "/" + image.name}>
                    <Card>
                      <Card.Img
                        style={{ height: "250px" }}
                        variant="top"
                        src={CDNURL + user.id + "/" + image.name}
                      />
                      <Card.Body>
                        <Button
                          variant="danger"
                          onClick={() => {
                            deleteImage(image.name);
                          }}
                        >
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
