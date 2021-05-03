import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { FormEvent, useEffect, useState } from "react";
import Autosuggest from "react-autosuggest";
import { Button, Modal, Form } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import { Game } from "../utils/types";
import './autosuggest.css';

const MUTATION_ADD_GAME = () => gql`
    mutation AddGame(
        $title: String!
        $description: String
        $images: [String] = []
        $genres: [Genre]
        $price: Float
        $studio: String
        $publishedDate: String
    ) {
        addGame(
            title: $title
            description: $description
            images: $images
            genres: $genres
            price: $price
            studio: $studio
            publishedDate: $publishedDate
        ) {
            id
            title
        }
    }
`;

const QUERY_FIND_GAMES_BY_TITLE = () => gql`
    query FindGame($title: String!) {
        findGameByTitle(title: $title) {
            id
            title
        }
    }
`;

interface AddReviewDialogProps {
    show: boolean;
    onHide: () => void;
}

const AddReviewDialog = (props: AddReviewDialogProps) => {
    const { show, onHide } = props;
    const [selectedGame, setSelectedGame] = useState<Game>();
    // list of all games
    const [gamesSuggestions, setGamesSuggestions] = useState<Game[]>([]);
    // keyword to search for game by title
    const [searchKeyword, setSearchKeyword] = useState("");
    const [addGame, addGameResult] = useMutation(MUTATION_ADD_GAME());
    const [findGame, findGameResult] = useLazyQuery(QUERY_FIND_GAMES_BY_TITLE());

    const onAddGame = () => {
        addGame({ variables: { title: selectedGame?.title } });
    };

    const getSuggestionValue = (suggestion: Game) => suggestion.title;

    const renderSuggestion = (suggestion: Game) => <div>{suggestion.title}</div>;

    const inputProps = {
        placeholder: "Let everyone know what game you're reviewing",
        value: searchKeyword,
        onChange: (e: FormEvent<HTMLElement>, options: { newValue: string }) => setSearchKeyword(options.newValue),
    };

    const onSuggestionsFetchRequested = () => {
        if (searchKeyword) {
            findGame({ variables: { title: searchKeyword } })
        }
    };

    const onSuggestionSelected = (e: any, options: {suggestion: Game}) => {
        setSelectedGame(options.suggestion);
    };

    useEffect(() => {
        if (findGameResult.data?.findGameByTitle) {
            setGamesSuggestions(findGameResult.data.findGameByTitle);
        }
    }, [findGameResult.data]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add your review about a game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="addGameTitle">
                        <Form.Label>Title of the game</Form.Label>
                        <Autosuggest
                            suggestions={gamesSuggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={() => setGamesSuggestions([])}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                            onSuggestionSelected={onSuggestionSelected}
                        />
                        {/* <Form.Control
                            type="text"
                            placeholder="Let everyone know what game you're reviewing"
                            value={gameTitle}
                            onChange={(e) => setGameTitle(e.target.value)}
                        /> */}
                    </Form.Group>
                    <Form.Group controlId="addGameDesc">
                        <Form.Label>Your review</Form.Label>
                        <Form.Control as="textarea" placeholder="What do you think about the game?" />
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
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onAddGame}>
                    Share your review
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddReviewDialog;
