import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Navbar, Form } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import { gql, useLazyQuery } from "@apollo/client";
import { Review } from "../utils/types";
import "./home-feed.scss";
import ReviewEditorDialog from "./ReviewEditorDialog";
import { isLoggedIn } from "../utils/helpers";
import { useHistory } from "react-router";

export const QUERY_GET_ALL_REVIEWS = () => gql`
    query GetAllReviews {
        getAllReviews {
            id
            username
            gameId {
                id
                title
                description
                genres
                price
                studio
                publishedDate
            }
            reviewText
            rating
            images
            comments {
                username
                commentText
                createdAt
            }
            createdAt
        }
    }
`;

const HomeFeed = () => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [reviewsList, setReviewsList] = useState<Review[]>([]);
    const [getAllReviews, getAllReviewsResult] = useLazyQuery(QUERY_GET_ALL_REVIEWS());
    // const [editingReview, setEditingReview] = useState<Review>();

    // const handleClose = () => setEditingReview(undefined);
    // const handleShow = (review: Review) => () => setEditingReview(review);

    useEffect(() => {
        // fetch all reviews for home feed
        getAllReviews();
    }, [getAllReviews]);

    useEffect(() => {
        if (getAllReviewsResult.data) {
            setReviewsList(getAllReviewsResult.data.getAllReviews);
        }
    }, [getAllReviewsResult.data]);

    return (
        <>
            <Navbar bg="light" variant="light" className="justify-content-between">
                <Navbar.Brand href="/">Game reviews forum</Navbar.Brand>
                <Form inline>
                    {isLoggedIn() ? (
                        <Button variant="primary" onClick={handleShow}>
                            Add review
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={() => history.push("/login")}>
                            Login
                        </Button>
                    )}
                </Form>
            </Navbar>
            <Container fluid className="home-feed py-3">
                <Row className="justify-content-center">
                    <Col xl={6} xs={10}>
                        <div className="reviews-list">
                            {reviewsList.map((review) => {
                                return (
                                    <Card body className="mb-3" key={review.id}>
                                        <Card.Title className="review-card-header">
                                            <span>{review.gameId.title}</span>
                                            {/* <Button variant="light" onClick={handleShow(review)}>
                                                <i className="material-icons">edit</i>
                                            </Button> */}
                                        </Card.Title>
                                        <ReactStars
                                            count={5}
                                            isHalf
                                            size={24}
                                            emptyIcon={<i className="far fa-star"></i>}
                                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                                            filledIcon={<i className="fa fa-star"></i>}
                                            value={review.rating}
                                            edit={false}
                                        />
                                        <span>
                                            - by <b>{review.username}</b>
                                        </span>
                                        <Card.Text>{review.reviewText}</Card.Text>
                                        <Row>
                                            <Col md={6}>
                                                <Button variant="link">{review.comments?.length || "0"} comments</Button>
                                            </Col>
                                            {/* <Col md={6} className="text-right">
                                                <Button variant="primary">More details</Button>
                                            </Col> */}
                                        </Row>
                                    </Card>
                                );
                            })}
                        </div>
                    </Col>
                </Row>
            </Container>
            <ReviewEditorDialog show={show} onHide={handleClose} />
            {/* <ReviewEditorDialog show={!!editingReview} onHide={handleClose} editingReview={editingReview} /> */}
        </>
    );
};

export default HomeFeed;
