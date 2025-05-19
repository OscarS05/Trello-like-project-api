const { cardService } = require('../../application/services/index');

const getAllCardInformation = async (req, res, next) => {
  try {
    const { listId, cardId } = req.params;

    const card = await cardService.getAllCardInformation(listId, cardId);

    res.status(200).json({ card });
  } catch (error) {
    next(error);
  }
};

const getCards = async (req, res, next) => {
  try {
    const { listId } = req.params;

    const cards = await cardService.findAll(listId);

    res.status(200).json({ cards });
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { listId } = req.params;
    const { name, description } = req.body;

    const newCard = await cardService.create({ listId, name, description });

    res.status(201).json({ newCard });
  } catch (error) {
    next(error);
  }
};

const updateCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { newName, description } = req.body;

    const updatedCard = await cardService.update(cardId, {
      newName,
      description,
    });

    res.status(200).json({ updatedCard });
  } catch (error) {
    next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const deletedCard = await cardService.delete(cardId);

    res
      .status(200)
      .json({ message: 'The card was successfully deleted', deletedCard });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCardInformation,
  getCards,
  createCard,
  updateCard,
  deleteCard,
};
