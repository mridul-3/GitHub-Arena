import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export default async (username) => {
  try {
    const userRepoQuery = gql`
      query userInfo($username: String!) {
        user(login: $username) {
          name
          login
          repositories(
            first: 100
            isFork: false
            ownerAffiliations: OWNER
            privacy: PUBLIC
          ) {
            totalCount
            nodes {
              stargazerCount
              forkCount
              description
              name
              url
              codeOfConduct {
                name
              }
              licenseInfo {
                name
              }
              issueTemplates {
                title
              }
              pullRequestTemplates {
                filename
              }
              pullRequests {
                totalCount
              }
              objectMaster: object(expression: "master:README.md") {
                id
              }
              objectMain: object(expression: "main:README.md") {
                id
              }
            }
          }
        }
      }
    `;

    const variables = {
      username: username,
    };

    const client = new ApolloClient({
      uri: "https://api.github.com/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    });

    const response = await client.query({
      query: userRepoQuery,
      variables: variables,
    });

    const data = response.data.user.repositories.nodes;
    return data;
  } catch (err) {
    console.log(err);
    return {
      statusText: "Not Found",
    };
  }
};
