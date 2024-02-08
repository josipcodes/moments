import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import { Alert, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

function PostCreateForm() {
    useRedirect("loggedOut");
    const [errors, setErrors] = useState({});

    const [postData, setPostData] = useState({
        title: '',
        content: '',
        image: '',
    })

    const { title, content, image } = postData;

    // We use this useRef hook to maintain a reference to the form file upload element. Note it has a ref prop where we give it this hook below.
    const imageInput = useRef(null);

    // We use this useHistory hook to redirect the user.
    const history = useHistory();

    const handleChange = (event) => {
        setPostData(
            {
                ...postData,
                [event.target.name]: event.target.value,
            }
        )
    }

    const handleChangeImage = (event) => {
        // Here we check if there  is a file in the files array held within the event object, and if so set the value of our image prop to the URL of the image.
        // URL.createObjectURL provides a local URL to the file passed in to it. To access the image, we have to access the first item in the files array.
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: URL.createObjectURL(event.target.files[0])
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('title', title);
        formData.append('content', content);
        // We have to retrieve the image file from the files array of the files form component.
        formData.append('image', imageInput.current.files[0]);
        // We have to refresh the user's access token before we make a request to create a post, because we are uploading an image file as well as text.
        try {
            const { data } = await axiosReq.post('/posts/', formData);
            // Note our API returns some data about our newly created post. We can use this to redirect the user to a URL for the specific post, using the post id.
            history.push(`/posts/${data.id}`);
        }
        catch (err) {
            // console.log(err)
            // A 401 error will be handled by our axios interceptor, so only set the error data if its a different error.
            if (err.response?.status !== 401) {
                setErrors(err.response?.data)
            }
        }
    }

    //   Remember this is a controlled form, hence the value props.
    const textFields = (
        <div className="text-center">
            {/* Add your form fields here */}
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.title?.map((message, idx) => (
                <Alert variant="warning" key={idx}>{message}</Alert>
            ))}
            <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control
                    as="textarea"
                    name="content"
                    rows={6}
                    value={content}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors.content?.map((message, idx) => (
                <Alert variant="warning" key={idx}>{message}</Alert>
            ))}

            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => history.goBack()}
            >
                cancel
            </Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
                create
            </Button>
        </div>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container
                        className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                    >
                        <Form.Group className="text-center">
                            {/* Here we use a ternary to display the image if it exists, or the click to upload asset if not. */}
                            {image ? (
                                <>
                                    <figure>
                                        {/* Image is a React Bootstrap component. The rounded prop adds rounded corners. */}
                                        <Image className={appStyles.Image} src={image} rounded />
                                    </figure>
                                    <div>
                                        <Form.Label
                                            className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                                            htmlFor="image-upload"
                                        >
                                            Change the image
                                        </Form.Label>
                                    </div>
                                </>
                            ) : (
                                <Form.Label
                                    className="d-flex justify-content-center"
                                    htmlFor="image-upload"
                                >
                                    <Asset src={Upload} message="Click or tap to upload an image" />
                                </Form.Label>
                            )}

                            {/* The value of the accept prop here ensures that users can only upload images. */}
                            <Form.File
                                id="image-upload"
                                accept="image/*"
                                onChange={handleChangeImage}
                                ref={imageInput}
                            />

                        </Form.Group>
                        {errors?.image?.map((message, idx) => (
                            <Alert variant="warning" key={idx}>{message}</Alert>
                        ))}
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>{textFields}</Container>
                </Col>
            </Row>
        </Form>
    );
}

export default PostCreateForm;