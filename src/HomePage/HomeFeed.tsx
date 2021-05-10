import React, { FormEvent, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Navbar, Form } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Game, Review } from "../utils/types";
import "./home-feed.scss";
import ReviewEditorDialog from "./ReviewEditorDialog";
import { getCurrentUser, isLoggedIn } from "../utils/helpers";
import { useHistory } from "react-router";
import Autosuggest from "react-autosuggest";
import "./autosuggest.css";

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

const MUTATION_DELETE_REVIEW = () => gql`
    mutation DeleteReview($id: ID!) {
        deleteReview(id: $id)
    }
`;

export const QUERY_FIND_GAMES_BY_TITLE = () => gql`
    query FindGame($title: String!) {
        findGameByTitle(title: $title) {
            id
            title
            description
            genres
            price
            studio
        }
    }
`;

const QUERY_FIND_REVIEWS_BY_GAME = () => gql`
    query FindReviewsByGame($gameId: ID!) {
        getReviewsByGame(gameId: $gameId) {
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
            comments {
                username
                commentText
                createdAt
            }
        }
    }
`;

const HomeFeed = () => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [reviewsList, setReviewsList] = useState<Review[]>([]);
    const [getAllReviews, getAllReviewsResult] = useLazyQuery(QUERY_GET_ALL_REVIEWS());
    const [deleteReview] = useMutation(MUTATION_DELETE_REVIEW());
    const user = getCurrentUser();
    const [editingReview, setEditingReview] = useState<Review>();

    // list of all games
    const [gamesSuggestions, setGamesSuggestions] = useState<Game[]>([]);
    // keyword to search for game by title
    const [searchKeyword, setSearchKeyword] = useState("");
    const [findGame, findGameResult] = useLazyQuery(QUERY_FIND_GAMES_BY_TITLE());
    const [findReviewsByGame, findReviewsByGameResult] = useLazyQuery(QUERY_FIND_REVIEWS_BY_GAME());

    const getSuggestionValue = (suggestion: Game) => suggestion.title;

    const renderSuggestion = (suggestion: Game) => <div>{suggestion.title}</div>;

    const inputProps = {
        placeholder: "Search reviews by game",
        value: searchKeyword,
        onChange: (e: FormEvent<HTMLElement>, options: { newValue: string }) => {
            setSearchKeyword(options.newValue);
        },
    };

    const onSuggestionsFetchRequested = () => {
        if (searchKeyword) {
            findGame({ variables: { title: searchKeyword } });
        }
    };

    const onSuggestionSelected = (e: any, options: { suggestion: Game }) => {
        findReviewsByGame({ variables: { gameId: options.suggestion.id } });
    };

    const onClearSearch = () => {
        setSearchKeyword('');
        setGamesSuggestions([]);
        if (getAllReviewsResult.data) {
            setReviewsList(getAllReviewsResult.data.getAllReviews);
        }
    };

    const handleClose = () => {
        setShow(false);
        setEditingReview(undefined);
    };
    const handleShow = (review?: Review) => () => {
        setShow(true);
        if (review) {
            setEditingReview(review);
        }
    };

    useEffect(() => {
        // fetch all reviews for home feed
        getAllReviews();
    }, [getAllReviews]);

    useEffect(() => {
        if (getAllReviewsResult.data) {
            setReviewsList(getAllReviewsResult.data.getAllReviews);
        }
    }, [getAllReviewsResult.data]);

    useEffect(() => {
        if (findGameResult.data?.findGameByTitle) {
            setGamesSuggestions(findGameResult.data.findGameByTitle);
        }
    }, [findGameResult.data, searchKeyword]);

    useEffect(() => {
        if (findReviewsByGameResult.data?.getReviewsByGame) {
            setReviewsList(findReviewsByGameResult.data?.getReviewsByGame);
        }
    }, [findReviewsByGameResult.data]);

    const onDeleteReview = (reviewId: string) => () => {
        deleteReview({ variables: { id: reviewId }, refetchQueries: ["GetAllReviews"] });
    };

    return (
        <>
            <Navbar bg="light" variant="light" className="justify-content-between">
                <Navbar.Brand href="/">Game reviews forum</Navbar.Brand>
                <div>
                    <Autosuggest
                        suggestions={gamesSuggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={() => setGamesSuggestions([])}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                        onSuggestionSelected={onSuggestionSelected}
                    />
                    <Button variant="primary" style={{ display: "inline-block" }} onClick={onClearSearch}>
                        Clear search
                    </Button>
                </div>
                <Form inline>
                    {isLoggedIn() ? (
                        <Button variant="primary" onClick={handleShow()}>
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
                                            <span>
                                                {review.username === user?.username && (
                                                    <>
                                                        <Button variant="light" onClick={handleShow(review)} className="mx-3">
                                                            <i className="material-icons">edit</i>
                                                        </Button>
                                                        <Button variant="light" onClick={onDeleteReview(review.id)}>
                                                            <i className="material-icons">delete</i>
                                                        </Button>
                                                    </>
                                                )}
                                            </span>
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
                                    </Card>
                                );
                            })}
                        </div>
                    </Col>
                </Row>
            </Container>
            {show && <ReviewEditorDialog onHide={handleClose} editingReview={editingReview} />}
        </>
    );
};

export default HomeFeed;
