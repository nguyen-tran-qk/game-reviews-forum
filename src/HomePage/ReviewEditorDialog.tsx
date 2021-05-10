import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { FormEvent, useEffect, useState } from "react";
import Autosuggest from "react-autosuggest";
import { Button, Modal, Form } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import { Game, Review } from "../utils/types";
import { QUERY_FIND_GAMES_BY_TITLE } from "./HomeFeed";

const MUTATION_ADD_REVIEW = () => gql`
    mutation AddReview($gameId: ID!, $reviewText: String!, $rating: Float!) {
        addReviewToGame(gameId: $gameId, reviewText: $reviewText, rating: $rating) {
            id
        }
    }
`;

const MUTATION_ADD_REVIEW_TO_NEW_GAME = () => gql`
    mutation AddReviewToNewGame($gameTitle: String!, $reviewText: String!, $rating: Float!) {
        addReviewToNewGame(gameTitle: $gameTitle, reviewText: $reviewText, rating: $rating) {
            id
        }
    }
`;

const MUTATION_UPDATE_REVIEW = () => gql`
    mutation UpdateReview($id: ID!, $reviewText: String!, $rating: Float!) {
        updateReview(id: $id, reviewText: $reviewText, rating: $rating) {
            id
        }
    }
`;

interface ReviewEditorDialogProps {
    onHide: () => void;
    editingReview?: Review;
}

const ReviewEditorDialog = (props: ReviewEditorDialogProps) => {
    const { onHide, editingReview } = props;
    const [selectedGame, setSelectedGame] = useState<Game | undefined>(editingReview?.gameId || undefined);
    // list of all games
    const [gamesSuggestions, setGamesSuggestions] = useState<Game[]>([]);
    // keyword to search for game by title
    const [searchKeyword, setSearchKeyword] = useState(editingReview?.gameId.title || "");
    const [addReview, addReviewResult] = useMutation(MUTATION_ADD_REVIEW());
    const [addReviewToNewGame, addReviewToNewGameResult] = useMutation(MUTATION_ADD_REVIEW_TO_NEW_GAME());
    const [updateReview, updateReviewResult] = useMutation(MUTATION_UPDATE_REVIEW());
    const [findGame, findGameResult] = useLazyQuery(QUERY_FIND_GAMES_BY_TITLE());
    const [reviewText, setReviewText] = useState(editingReview?.reviewText || "");
    const [rating, setRating] = useState(editingReview?.rating || 0);

    const onSubmitReview = () => {
        if (selectedGame) {
            if (editingReview) {
                updateReview({
                    variables: { id: editingReview.id, reviewText, rating },
                    refetchQueries: ["GetAllReviews"],
                });
            } else {
                if (selectedGame.id === "new_game") {
                    addReviewToNewGame({
                        variables: { gameTitle: selectedGame.title, reviewText, rating },
                        refetchQueries: ["GetAllReviews"],
                    });
                } else {
                    addReview({ variables: { gameId: selectedGame.id, reviewText, rating }, refetchQueries: ["GetAllReviews"] });
                }
            }
        }
    };

    const getSuggestionValue = (suggestion: Game) => (suggestion.id === "new_game" ? searchKeyword : suggestion.title);

    const renderSuggestion = (suggestion: Game) => (
        <div>{suggestion.id === "new_game" ? `Add "${suggestion.title}" as a new game` : suggestion.title}</div>
    );

    const inputProps = {
        placeholder: "Type to search for game",
        value: searchKeyword,
        onChange: (e: FormEvent<HTMLElement>, options: { newValue: string }) => setSearchKeyword(options.newValue),
        disabled: !!editingReview,
    };

    const onSuggestionsFetchRequested = () => {
        if (searchKeyword) {
            findGame({ variables: { title: searchKeyword } });
        }
    };

    const onSuggestionSelected = (e: any, options: { suggestion: Game }) => {
        setSelectedGame(options.suggestion);
    };

    useEffect(() => {
        const newGameSuggestion: Game = {
            id: "new_game",
            title: searchKeyword,
        };
        const gameSuggestions = [newGameSuggestion];
        if (findGameResult.data?.findGameByTitle) {
            gameSuggestions.unshift(findGameResult.data.findGameByTitle);
        }
        setGamesSuggestions(gameSuggestions.flat());
    }, [findGameResult.data, searchKeyword]);

    useEffect(() => {
        const result =
            addReviewResult.data?.addReviewToGame ||
            addReviewToNewGameResult.data?.addReviewToNewGame ||
            updateReviewResult.data?.updateReview;
        if (result) {
            onHide();
        }
    }, [addReviewResult.data, addReviewToNewGameResult.data, updateReviewResult.data, onHide]);

    return (
        <Modal show onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{editingReview ? "Update review" : "Add your review about a game"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="addGameTitle">
                        <Form.Label>Let everyone know what game you're reviewing</Form.Label>
                        <Autosuggest
                            suggestions={gamesSuggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={() => setGamesSuggestions([])}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                            onSuggestionSelected={onSuggestionSelected}
                        />
                        {!!selectedGame && (
                            <>
                                <div>
                                    <label>
                                        <u>Description:</u>
                                    </label>
                                    <small>&nbsp;{selectedGame?.description || "N/A"}</small>
                                </div>
                                <div>
                                    <label>
                                        <u>Genres:</u>
                                    </label>
                                    <small>&nbsp;{selectedGame?.genres?.length ? selectedGame?.genres.join(", ") : "N/A"}</small>
                                </div>
                                <div>
                                    <label>
                                        <u>Price:</u>
                                    </label>
                                    <small>&nbsp;{selectedGame?.price || "N/A"}</small>
                                </div>
                                <div>
                                    <label>
                                        <u>Studio:</u>
                                    </label>
                                    <small>&nbsp;{selectedGame?.studio || "N/A"}</small>
                                </div>
                            </>
                        )}
                        <hr />
                    </Form.Group>
                    <Form.Group controlId="addGameDesc">
                        <Form.Label>Your review</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="What do you think about the game?"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="addGameRating">
                        <Form.Label>Rate the game</Form.Label>
                        <ReactStars
                            count={5}
                            isHalf
                            size={24}
                            emptyIcon={<i className="far fa-star"></i>}
                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                            filledIcon={<i className="fa fa-star"></i>}
                            value={rating}
                            onChange={(newRating: number) => setRating(newRating)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onSubmitReview} disabled={!selectedGame}>
                    {editingReview ? "Update review" : "Share your review"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReviewEditorDialog;
