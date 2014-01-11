// if the database is empty on server start, create some sample data.
Meteor.startup(function () {

  // if (Meteor.users.find({}).count() === 0) {
  //   var data = [
  //     {
  //       _id: 1,
  //       createdAt: (new Date()),
  //       profile: {
  //         name: 'Joe'
  //       }
  //     },
  //     {
  //       _id: 2,
  //       createdAt: (new Date()),
  //       profile: {
  //         name: 'Nicole'
  //       }
  //     },
  //     {
  //       _id: 3,
  //       createdAt: (new Date()),
  //       profile: {
  //         name: 'Josh'
  //       }
  //     }
  //   ];

  //   for (var i=0; i<data.length; ++i) {
  //     Meteor.loginWithUWaterlooId(data[i]._id);
  //   };
  // }

  if (Groups.find({}).count() === 0) {
    var data = [
      {
        creator: '1',
        createdAt: (new Date()),
        groupName: 'Math239',
        members: ['1','2','3']
      },
      {
        creator: '1',
        createdAt: (new Date()),
        groupName: 'CS245',
        members: ['1','3']
      },
      {
        creator: '2',
        createdAt: (new Date()),
        groupName: 'ECE101',
        members: ['2','3']
      }
    ];

    for (var i=0; i<data.length; ++i) {
      Groups.insert(data[i]);
    };
  }

});
