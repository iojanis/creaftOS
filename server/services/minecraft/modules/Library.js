module.exports = function Library() {
  const server = this

  server.io.on('connection', (client) => {
    // todo: more socket events
  })

  server.library = {
    // buy() {
    //   Fiber(function(){
    //     check(this.userId, String);
    //     check(postId, String);
    //
    //     var xp = Meteor.user().experience;
    //
    //     if (xp > 11) {
    //       var affected = Posts.update({
    //         _id: postId,
    //         upvoters: {$ne: this.userId}
    //       }, {
    //         $addToSet: {upvoters: this.userId},
    //         $inc: {votes: 1}
    //       });
    //
    //       if (affected) {
    //         Meteor.users.update({_id:this.userId}, {$inc:{"experience": -11}});
    //       } else {
    //
    //       }
    //     } else {
    //       return false
    //     }
    //   }).run()
    // }
  }
}
