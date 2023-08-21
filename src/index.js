import { GraphQLServer } from "graphql-yoga";

//type definition (schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

//resolvers

const resolvers = {
  Query: {
    hello() {
      return "This is my first query!";
    },
    name() {
      return "Leah";
    },
    location() {
      return "London";
    },
    bio() {
      return "Junior developer, excited to get started!";
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("the server is up!");
});
