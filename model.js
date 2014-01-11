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

    if (!group) {
      return 'group doesn\'t exist';
    }

    if (_(group.members).contains(this.userId)) {
      return 'already in group';
    }

    return Groups.update(group, {$push: {members: this.userId}});
  }

});