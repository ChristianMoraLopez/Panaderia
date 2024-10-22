import { createClient } from 'contentful';
import { Entry } from 'contentful';

const client = createClient({
  space: 'lv8bddpr230t',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'S5jRiTGrscU4NII3MB37tNlMezYcnPsCGVJCtaiIZp8'
});

client.getEntry('3puAPQaihVxZWHRc9BBki1')
  .then((entry: Entry) => console.log(entry))
  .catch(console.error);