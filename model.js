////////// Shared code (client and server) //////////

Groups = new Meteor.Collection('groups');
// groups have and id, admin(creator), list of members

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

    // !!! what happens if already in group?

    if (!group) {
      return; // not a group
    }

    Groups.update(group, {$push: {members: this.userId}});
  }

});