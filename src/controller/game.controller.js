const response = require("../../commons/response/response");
const gameService = require("../service/game.service");

const selectchild = async (req, res) => {
  try {
    const result = await gameService.assignSecretSanta(req.files);
    return response.handleSuccessResponse(
      result,
      res,
      "Secret Santa assignments generated successfully.",
      "New Secret Santa pairs have been created."
    );
  } catch (error) {
    return response.handleErrorResponse(error, res);
  }
};

module.exports = { selectchild };
