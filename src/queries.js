import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query AllBooks($title: String, $genre: [String], $author: String, $published: Int) {
    allBooks(title: $title, genre: $genre, author: $author, published: $published) {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const DELETE_BOOK = gql`
  mutation deleteBook($title: String!) {
    deleteBook(title: $title)
  }
`

export const EDIT_NUMBER = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo)  {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
      favoriteGenre
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
    }
  }
`