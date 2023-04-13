import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";

//https://jojdwgktxkbdsdtltmgx.supabase.co/storage/v1/object/public/images/7c492b00-beaf-4fb8-9982-6c7277f391b5/627d5dd3-d61c-40fc-9c10-120cd2bd6122

const CDNURL =
  "https://jojdwgktxkbdsdtltmgx.supabase.co/storage/v1/object/public/images/";

function App() {
  const [email, setemail] = useState("");
  const [images, setimages] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("images")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    if (data !== null) {
      setimages(data);
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  async function magicLinkLogin() {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });
    if (error) {
      alert("Communicating wit supabase error");
    } else {
      alert("check your email");
    }
  }
  async function signout() {
   await supabase.auth.signOut();
  }

  //uploadImage

  async function uploadImage(e) {
    let file = e.target.files[0];

    const { data, error } = await supabase.storage
      .from("images")
      .upload(user.id + "/" + uuidv4(), file);
    if (data) {
      getImages();
    } else {
      console.log(error);
    }
  }

  //delete
  async function deleteImage(imageName) {
    const { error } = await supabase.storage
      .from("images")
      .remove([user.id + "/" + imageName]);
    if (error) {
      alert("error");
    } else {
      getImages();
    }
  }

  return (
    <Container align="center" className="container-sm mt-4">
      {user === null ? (
        <>
          <h1>Welcome</h1>
          <Form>
            <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
              <Form.Label>
                Enter an email to sign in with a supabase Magic Link
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => {
                  setemail(e.target.value);
                }}
              />
            </Form.Group>
            <Button onClick={() => magicLinkLogin()}>Get Magic Link</Button>
          </Form>
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
            Use the Choose File button below to upload an image to your gallery
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
                    style={{height:'250px'}}
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
  );
}

export default App;
