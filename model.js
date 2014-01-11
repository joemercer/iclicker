////////// Shared code (client and server) //////////

Groups = new Meteor.Collection('groups');
// groups have and id, admin(creator), list of members



// Games = new Meteor.Collection('games');
// // { board: ['A','I',...], clock: 60,
// //   players: [{player_id, name}], winners: [player_id] }

// Words = new Meteor.Collection('words');
// // {player_id: 10, game_id: 123, word: 'hello', state: 'good', score: 4}

// Players = new Meteor.Collection('players');
// // {name: 'matt', game_id: 123}

// Meteor.methods({
//   score_word: function (word_id) {
//     check(word_id, String);
//     var word = Words.findOne(word_id);
//     var game = Games.findOne(word.game_id);

//     // client and server can both check: must be at least three chars
//     // long, not already used, and possible to make on the board.
//     if (word.length < 3
//         || Words.find({game_id: word.game_id, word: word.word}).count() > 1
//         || paths_for_word(game.board, word.word).length === 0) {
//       Words.update(word._id, {$set: {score: 0, state: 'bad'}});
//       return;
//     }

//     // now only on the server, check against dictionary and score it.
//     if (Meteor.isServer) {
//       if (_.has(DICTIONARY, word.word.toLowerCase())) {
//         var score = Math.pow(2, word.word.length - 3);
//         Words.update(word._id, {$set: {score: score, state: 'good'}});
//       } else {
//         Words.update(word._id, {$set: {score: 0, state: 'bad'}});
//       }
//     }
//   }
// });


if (Meteor.isServer) {

  Meteor.publish('groups', function () {
    return Groups.find({});
  });

  // // publish all the non-idle players.
  // Meteor.publish('players', function () {
  //   return Players.find({idle: false});
  // });

  // // publish all the available groups
  // Meteor.publish('groups', function (id) {
  //   check(id, String);
  //   return Games.find({_id: id});
  // });

  // // publish all my words and opponents' words that the server has
  // // scored as good.
  // Meteor.publish('words', function (game_id, player_id) {
  //   check(game_id, String);
  //   check(player_id, String);
  //   return Words.find({$or: [{game_id: game_id, state: 'good'},
  //                            {player_id: player_id}]});
  // });
}
