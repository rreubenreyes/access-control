"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
function isMovieGoer(person) {
    if (typeof person !== 'object')
        return false;
    if (typeof person.age !== 'number')
        return false;
    if (typeof person.money !== 'number')
        return false;
    return true;
}
const movies = {
    twentyOneJumpStreet: {
        title: '21 Jump Street',
        rating: 'R',
    },
    frozen: {
        title: 'Frozen',
        rating: 'G',
    }
};
const movieRules = {
    preflight: (movieGoer) => {
        return isMovieGoer(movieGoer) && movieGoer.money >= 10;
    },
    requirements: (movieGoer, movie) => {
        switch (movie.rating) {
            case 'G': return true;
            case 'R': return movieGoer.age >= 18;
            default: return false;
        }
    }
};
function watchMovie(movieGoer, movie) {
    return __awaiter(this, void 0, void 0, function* () {
        new lib_1.Transaction(resolve => resolve(movie))
            .actor(movieGoer)
            .restriction(movieRules)
            .mediate()
            .then(movie => {
            console.log(Object.assign({}, movieGoer), `Wow, ${movie.title} was a great movie!`);
        })
            .catch(() => {
            console.log(Object.assign({}, movieGoer), `Aww man, they didn't let me in...`);
        });
    });
}
const movieGoers = [
    {
        age: 25,
        money: 10,
    },
    {
        age: 16,
        money: 10,
    },
    {
        age: 30,
        money: 5,
    }
];
movieGoers.forEach((movieGoer) => __awaiter(void 0, void 0, void 0, function* () {
    yield watchMovie(movieGoer, movies.twentyOneJumpStreet);
    yield watchMovie(movieGoer, movies.frozen);
}));
