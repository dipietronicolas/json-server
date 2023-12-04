const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/users', (req, res, next) => {
  const { email, username } = req.body;
  const db = router.db; // Get access to the lowdb instance
  const validateEmail = db.get('users').find({ email }).value();
  const validateUsername = db.get('users').find({ username }).value();

  setTimeout(() => {
    if (validateEmail || validateUsername) 
      return res.status(400).json({ error: 'Username or email are already in use.' });

    next();
  }, 1500);
});

server.post('/signin', (req, res) => {

  const { username, password } = req.body;
  const db = router.db;

  const user = db.get('users').find({ username }).value();

  setTimeout(() => {
    if (!user || user?.password !== password)
      return res.status(401).json({ error: 'Username or password are wrong.' });

    const { id, name, username, email } = user;
    return res.json({ id, name, username, email })
  }, 1500);

});

server.get('/tweets', (req, res) => {
  const db = router.db;
  const tweets = db.get('tweets').value();
  const users = db.get('users').value();
  
  const page = parseInt(req.query.page) || 1; // Get page number from query parameter or default to 1
  const pageSize = 6; // Number of items per page
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const paginatedTweets = tweets.slice(startIndex, endIndex).map(tweet => {
    const user = users.find(u => u.id === tweet.userId);
    if (user) {
      const { password, ...rest } = user;
      return {
        ...tweet,
        user: rest,
      };
    }
    return tweet;
  });

  setTimeout(() => {
    res.json({
      tweets: paginatedTweets,
      currentPage: page,
      totalPages: Math.ceil(tweets.length / pageSize),
    });
  }, 1500);
});


server.get('/forYouTweets', (req, res) => {
  const db = router.db;
  const tweets = db.get('forYouTweets').value();
  const users = db.get('users').value();
  
  const page = parseInt(req.query.page) || 1; // Get page number from query parameter or default to 1
  const pageSize = 6; // Number of items per page
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const paginatedTweets = tweets.slice(startIndex, endIndex).map(tweet => {
    const user = users.find(u => u.id === tweet.userId);
    if (user) {
      const { password, ...rest } = user;
      return {
        ...tweet,
        user: rest,
      };
    }
    return tweet;
  });

  setTimeout(() => {
    res.json({
      tweets: paginatedTweets,
      currentPage: page,
      totalPages: Math.ceil(tweets.length / pageSize),
    });
  }, 1500);
});

server.post('/retweet', (req, res) => {
  setTimeout(() => {
    res.sendStatus(201)
  }, 1500)
})

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
