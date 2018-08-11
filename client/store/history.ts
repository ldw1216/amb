import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();
history.listen((...a) => console.log(a));

export default history;
