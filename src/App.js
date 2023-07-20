import { useEffect, useState } from 'react'
import Loader from './components/Loader'
import ErrorMessage from './components/ErrorMessage'
import NavBar from './components/NavBar'
import NumResults from './components/NumResults'
import Search from './components/Search'
import Main from './components/Main'
import MovieList from './components/MovieList'
import Box from './components/Box'
import MovieDetails from './components/MovieDetails'
import WatchedSummary from './components/WatchedSummary'
import WatchedMoviesList from './components/WatchedMoviesList'

const KEY = 'd4ff0e05'

export default function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [watched, setWatched] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedID] = useState(null)

  function handleSelectMovie(id) {
    setSelectedID((selectedId) => (id === selectedId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedID(null)
  }

  function handleAddWatch(movie) {
    setWatched((watched) => [...watched, movie])
  }

  function handelDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  useEffect(
    function () {
      const controller = new AbortController()

      async function fetchMovies() {
        try {
          setIsLoading(true)
          setError('')
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          )

          if (!res.ok)
            throw new Error('Something went wrong with fetching movies')

          const data = await res.json()

          if (data.Response === 'False') throw new Error('Movie not found')

          setMovies(data.Search)
          setError('')
        } catch (err) {
          console.error(err.message)
          if (err.name !== 'AbortError') {
            setError(err.message)
          }
        } finally {
          setIsLoading(false)
        }
      }

      if (query.length < 3) {
        setMovies([])
        setError('')
        return
      }
      handleCloseMovie()
      fetchMovies()

      return function () {
        controller.abort()
      }
    },
    [query]
  )

  return (
    <>
      <NavBar movies={movies}>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* <Box>{isLoading ? <Loader /> : <MovieList movies={movies} />}</Box> */}
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handelDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}
