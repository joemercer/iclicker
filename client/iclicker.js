////////// Main client application logic //////////

// # Accounts
// __________

Meteor.loginWithUWaterlooId = function(uWaterlooId, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
  var loginRequest = {uWaterlooId: uWaterlooId};

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};

Template.loggedOut.events({
  'click #login': function (e, tmpl) {
    var uWaterlooId = tmpl.find('#uWaterlooId').value;

    Meteor.loginWithUWaterlooId(uWaterlooId);
  }
});

Template.loggedIn.events({
  'click #logout': function (e, tmpl) {
    Meteor.logout(function (err) {
      if (err) {
        // show err message
      }
      else {
        // successfully logged out
      }
    });
  }
});

// # Profiles
// __________

Template.profile.events({
  'click #addProfileName': function(e, tmpl) {
    var name = tmpl.find('#profileName').value;
    Meteor.users.update({_id: Meteor.user()._id}, {$set: {profile: {name: name}}});
  }
});

// # Groups
// ________

Session.set('activeGroup', null);

Template.groups.events({
  'click #createGroup': function(e, tmpl) {
    // grab new groupName from input#groupName field
    var groupName = tmpl.find('#groupName').value;
    Meteor.call('createGroup', groupName);
  },
  // currently groups have a unique groupName
  // !!! this is stupid, they should have a unique id
  // we would have to refactor this code
  'click .joinGroup': function(e, tmpl) {
    var groupName = $(e.target).data().groupname;
    Meteor.call('joinGroup', groupName);
  },
  'click .enterGroup': function(e, tmpl) {
    var groupName = $(e.target).data().groupname;
    var group = Groups.findOne({groupName: groupName});
    Session.set('activeGroup', group);
  }
});

Template.groups.all = function() {
  return Groups.find({members: {$not: Meteor.user()._id}});
};

Template.groups.mine = function() {
  return Groups.find({members: Meteor.user()._id});
};

// # Active Group
// ______________

Template.activeGroup.events({
  'click #addQuestion': function(e, tmpl) {
    var activeGroup = Session.get('activeGroup');
    // get new question data from inputs
    var question = tmpl.find('#questionText').value;
    var timeLimit = parseInt(tmpl.find('#questionTimeLimit').value);
    var answers = [
      tmpl.find('#answerA').value,
      tmpl.find('#answerB').value,
      tmpl.find('#answerC').value,
      tmpl.find('#answerD').value,
      tmpl.find('#answerE').value
    ];

    Meteor.call('createQuestionAndAnswers', activeGroup._id, question, timeLimit, answers);
  },

  'click .activateQuestion': function(e, tmpl) {
    var activeGroup = Session.get('activeGroup');
    var questionId = $(e.target).data().questionid;
    Meteor.call('activateQuestion', activeGroup._id, questionId);
  }

});

Template.activeGroup.activeGroup = function() {
  var group = Session.get('activeGroup');
  if (group) {
    return group.groupName;
  }
};

Template.activeGroup.canAddQuestion = function() {
  var group = Session.get('activeGroup');
  var user = Meteor.user();
  return group.creator === user._id;
};

Template.activeGroup.questions = function() {
  var activeGroup = Session.get('activeGroup');
  return Questions.find({groupId: activeGroup._id});
};




// # Active Question
// _________________

Template.activeQuestion.events({
  // right now an answer has a unique answer text within a group
  // !!! this is stupid, we should just use the ids
  // we would have to refactor this
  'click .answerQuestion': function(e, tmpl) {
    var answerText = e.target.text;

    var activeGroup = Session.get('activeGroup');
    if (activeGroup) {
      var question = Questions.findOne({groupId: activeGroup._id, active: true});
      if (question) {
        Meteor.call('answerQuestion', question._id, answerText);
      }
    }
  }
});

Template.activeQuestion.activeQuestion = function() {
  var activeGroup = Session.get('activeGroup');
  if (activeGroup) {
    var question = Questions.findOne({groupId: activeGroup._id, active: true});
    if (question) {
      return question.text;
    }
  }
};

Template.activeQuestion.answers = function() {
  var activeGroup = Session.get('activeGroup');
  if (activeGroup) {
    var question = Questions.findOne({groupId: activeGroup._id, active: true});
    if (question) {
      return Answers.find({questionId: question._id});
    }
  }
};

Template.activeQuestion.yourAnswers = function() {
  var activeGroup = Session.get('activeGroup');
  if (activeGroup) {
    var question = Questions.findOne({groupId: activeGroup._id, active: true});
    if (question) {
      return Answers.find({questionId: question._id, endorsers: Meteor.user()._id});
    }
  }
};











