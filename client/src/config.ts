// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'gotis1w2rg'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-yaacine.auth0.com',            // Auth0 domain
  clientId: 'TLt3MpxgqH5FKbOH55h6o362gC6zFigV',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
