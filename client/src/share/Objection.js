
/*
 * Helper class
 */
class Objection {

  /*
   * Format server errors
   */
  static formatErrors(message, t) {
    return message.split(',').map(e => t(e.replace(': ', ' ')));
  }
}

export default Objection;
