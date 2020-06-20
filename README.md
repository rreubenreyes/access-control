# access-control 🔒
General-purpose access control layer.

This project is still in the ideation phase.

## Example usage

```ts
import { Transaction, Restriction } from './lib';

interface MovieGoer {
    age: number;
    money: number;
}

interface Movie {
    title: string;
    rating: 'R' | 'G';
}

function isMovieGoer(person: MovieGoer | unknown): person is MovieGoer {
    if (typeof person !== 'object') return false;
    if (typeof (person as MovieGoer).age !== 'number') return false;
    if (typeof (person as MovieGoer).money !== 'number') return false;

    return true;
}

const movies: Record<string, Movie> = {
    twentyOneJumpStreet: {
        title: '21 Jump Street',
        rating: 'R',
    },
    frozen: {
        title: 'Frozen',
        rating: 'G',
    }
}

const movieRules: Restriction<MovieGoer, Movie> = {
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
}

async function watchMovie(movieGoer: MovieGoer, movie: Movie): Promise<void> {
    new Transaction<MovieGoer, Movie>(resolve => resolve(movie))
        .actor(movieGoer)
        .restriction(movieRules)
        .mediate()
        .then(movie => {
            console.log({ ...movieGoer }, `Wow, ${movie.title} was a great movie!`)
        })
        .catch(() => {
            console.log({ ...movieGoer }, `Aww man, they didn't let me in...`)
        })
}

const movieGoers: Array<MovieGoer> = [
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

movieGoers.forEach(async movieGoer => {
    await watchMovie(movieGoer, movies.twentyOneJumpStreet);
    await watchMovie(movieGoer, movies.frozen);
});

/*
    { age: 25, money: 10 } 'Wow, 21 Jump Street was a great movie!'
    { age: 30, money: 5 } 'Aww man, they didn\'t let me in...'
    { age: 25, money: 10 } 'Wow, Frozen was a great movie!'
    { age: 16, money: 10 } 'Wow, Frozen was a great movie!'
    { age: 30, money: 5 } 'Aww man, they didn\'t let me in...'
    { age: 16, money: 10 } 'Aww man, they didn\'t let me in...'
*/
```


