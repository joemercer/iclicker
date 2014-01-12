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
    var groupName = tmpl.find('#groupName').value;
    Meteor.call('createGroup', groupName);
  },
  'click .joinGroup': function(e, tmpl) {
    var groupName = e.target.text;
    Meteor.call('joinGroup', groupName);
  },
  'click .enterGroup': function(e, tmpl) {
    var groupName = e.target.text;
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
  }
});

Template.activeGroup.activeGroup = function() {
  var group = Session.get('activeGroup');
  if (group) {
    return group.groupName;
  }
};

Template.activeGroup.questions = function() {
  var activeGroup = Session.get('activeGroup');
  return Questions.find({groupId: activeGroup._id});
};




