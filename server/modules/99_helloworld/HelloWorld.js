/**
 * Demo model.
 * Look at Objection ORM for how to create models.
 */
class HelloWorld {

  /**
   * Do some nasty stuff
   */
  static async talkTo(name) {
    return new Promise(resolve => {
      resolve(`Hello ${name}!`);
    });
  }
}

module.exports = HelloWorld;
