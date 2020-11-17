/**
 * Ping controller for healthchecking.
 */
class PingController {
  /**
   * Simple get request for healthchecking.
   *
   * @param {Request} req the request object
   * @param {Response} res the response object
   */
  async get(req, res) {
    return res.json({
      status: 'ok',
    });
  }
}

export default new PingController();
