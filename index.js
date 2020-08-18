const Twit = require('twit');
const Wiki = require('./Wiki');
const keys = require('./keys.json');

(async () => {

    let T = new Twit(keys);
    let stream = T.stream(
        'statuses/filter',
        {track: '#ixcresponde'}
    );

    stream.on('tweet', async (tweet) => {

        let wiki = new Wiki(tweet.text.split('#ixcresponde').join(''));
        await wiki.load();

        T.post('statuses/update', {
            status: wiki.getDescricao(),
            in_reply_to_status_id: tweet.id_str,
            auto_populate_reply_metadata: true
        });
    });
})();