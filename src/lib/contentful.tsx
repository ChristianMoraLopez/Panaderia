import { createClient } from 'contentful';
import { Entry } from 'contentful';

const client = createClient({
  space: 'lv8bddpr230t',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'omAfQfcQbXJgHi0H-i08tELMhwDgZ1uMQwDaPhQK50I'
});

client.getEntry('3puAPQaihVxZWHRc9BBki1')
  .then((entry: Entry) => console.log(entry))
  .catch(console.error);