////////// Shared code (client and server) //////////

Groups = new Meteor.Collection('groups');

Meteor.methods({
  createGroup: function (groupName) {
    var group = Groups.findOne({groupName: groupName});

    if (group) {
      return group._id;
    }
    else {
      return Groups.insert({
        creator: this.userId,
        createdAt: (new Date()),
        groupName: groupName,
        members: [this.userId]
      });
    }
  },

  joinGroup: function (groupName) {
    var group = Groups.findOne({groupName: groupName});

    if (!group) {
      return 'group doesn\'t exist';
    }

    if (_(group.members).contains(this.userId)) {
      return 'already in group';
    }

    return Groups.update(group, {$push: {members: this.userId}});
  }

});

Questions = new Meteor.Collection('questions');
Answers = new Meteor.Collection('answers');

Meteor.methods({
  createQuestion: function(groupId, text, timeLimit) {
    var question = Questions.findOne({groupId: groupId, text: text});

    if (question) {
      return question._id;
    }
    else {
      return Questions.insert({
        creator: this.userId,
        createdAt: (new Date()),
        groupId: groupId,
        text: text,
        timeLimit: timeLimit
      });
    }
  },

  createAnswer: function(questionId, text) {
    var answer = Answers.findOne({questionId: questionId, text: text});

    if (answer) {
      return answer._id;
    }
    else {
      return Answers.insert({
        creator: this.userId,
        createdAt: (new Date()),
        question: questionId,
        text: text,
        endorsers: []
      });
    }
  },

  createQuestionAndAnswers: function (groupId, questionText, timeLimit, answers) {
    Meteor.call('createQuestion', groupId, questionText, timeLimit, function(error, questionId) {
      if (error) {
        return 'couldn\'t create the question';
      }
      else {
        answers.forEach(function(answerText){
          Meteor.call('createAnswer', questionId, answerText);
        });
      }
    });
  },

  answerQuestion: function (questionId, answer) {
    // var question = Questions.findOne({_id: questionId});

    // if (!question) {
    //   return 'question doesn\'t exist';
    // }

    // if (!_(question.answers).contains(answer)) {
    //   return 'answer doesn\'t exist';
    // }

    // return Questions.update(group, {$push: {members: this.userId}});
  }

});