import ReactDOM from "react-dom/client"
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import App from "./App.jsx"

const client = new ApolloClient({
  uri: 'http://localhost:4000', // Asegúrate de que esta es la URL correcta de tu servidor GraphQL
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
)
