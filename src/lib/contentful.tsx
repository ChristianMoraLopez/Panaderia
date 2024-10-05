import { createClient } from 'contentful';
import { Entry } from 'contentful';

const client = createClient({
  space: 'tq4ckeil24qo',
  environment: 'master', // defaults to 'master' if not set
  accessToken: '1YhT6yLqrnyqL597WxZ6rEkc1griTNdrJuc1KhoQgDk'
});

client.getEntry('6quQLXK8Se7CxKz9JLJde5')
  .then((entry: Entry) => console.log(entry))
  .catch(console.error);