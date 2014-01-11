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

Template.groups.events({
  'click #createGroup': function(e, tmpl) {
    var groupName = tmpl.find('#groupName').value;
    Meteor.call('createGroup', groupName);
  },
  'click .joinGroup': function(e, tmpl) {
    var groupName = e.target.text;
    Meteor.call('joinGroup', groupName);
  }
});

Template.groups.all = function() {
  return Groups.find({members: {$not: Meteor.user()._id}});
};

Template.groups.mine = function() {
  return Groups.find({members: Meteor.user()._id});
};





