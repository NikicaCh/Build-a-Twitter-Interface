const express = require('express');
const router = express.Router();
const Twit = require('twit');
const keys = require('../config');
const moment = require('moment');



var params = {screen_name: keys.username , count: 5};


const T = new Twit({
  consumer_key:         keys.consumer_key,
  consumer_secret:      keys.consumer_secret,
  access_token:         keys.access_token,
  access_token_secret:  keys.access_token_secret
});

router.post('/', function(req, res) {
  T.post('statuses/update', { status: req.body.tweet }, function(err, data, response) {
  }); 
});



T.get('users/show', params, (err, user, response) => { 
  let profileImage = user.profile_image_url_https;
  let numberOfFollowers = user.followers_count;
  let coverPhoto = user.profile_banner_url;
  let FullName = user.name;
  let screen_name = user.screen_name;


      T.get('statuses/user_timeline', params, (err, tweets, response) => { 
        let tweetsArray = [];
        let tweet;
        for(let i = 0; i < tweets.length; i += 1) {
          tweet = {
            content: tweets[i].text ,
            retweets: tweets[i].retweet_count ,
            likes: tweets[i].favorite_count ,
            date: moment(tweets[i].created_at).fromNow()
          };
        tweetsArray.push(tweet);
        }
            T.get('friends/list', params, (err, friends, response) => { 
              let friendsArray = [];
              let friend;
              for(let i = 0; i < friends.users.length; i += 1) {
                friend = {
                  profileImg: friends.users[i].profile_image_url,
                  realName: friends.users[i].name,
                  screen_name: friends.users[i].screen_name
                };
                friendsArray.push(friend);
              }   

                  T.get('direct_messages', params, (err, messages, response) => { 
                    let messagesArray = [];
                    let message;
                    for(let i = 0; i < messages.length; i += 1) {


                      message = {
                        avatar: messages[i].sender.profile_image_url_https,
                        message: messages[i].text,
                        userName: messages[i].sender.name,
                        timeSent: moment(messages[i].sender.created_at).fromNow()

                      };
                      messagesArray.push(message);
                    } 
                        
                        
                        router.get('/', function(req, res){
                          res.render('layout', {  screen_name, numberOfFollowers, FullName, tweetsArray, profileImage, friendsArray, messagesArray, coverPhoto });
                        });  
                  });
                         
            });
      });
});



module.exports = router;