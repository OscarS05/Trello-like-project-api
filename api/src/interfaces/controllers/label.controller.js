const boom = require('@hapi/boom');

const { labelService } = require('../../application/services/index');

const getAllLabels = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const labels = await labelService.getAllLabels(projectId);

    res.status(200).json({ labels });
  } catch (error) {
    next(error);
  }
};

const getLabelsByCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const visibleLabels = await labelService.getLabelsByCard(cardId);

    res.status(200).json({ visibleLabels });
  } catch (error) {
    next(error);
  }
};

const createLabel = async (req, res, next) => {
  try {
    const { projectId, cardId } = req.params;
    const { name, color } = req.body;

    const newLabel = await labelService.createLabel(projectId, cardId, {
      name,
      color,
    });

    res.status(201).json({ newLabel });
  } catch (error) {
    next(error);
  }
};

const updateLabelVisibilityInCard = async (req, res, next) => {
  try {
    const { cardId, labelId } = req.params;
    const { isVisible } = req.body;

    const newLabel = await labelService.updateVisibilityLabel(isVisible, {
      cardId,
      labelId,
    });
    if (newLabel === 0)
      throw boom.badRequest(
        'The update visibility of label returns 0 rows affected',
      );

    res.status(201).json({ newLabel });
  } catch (error) {
    next(error);
  }
};

const updateLabel = async (req, res, next) => {
  try {
    const { labelId } = req.params;
    const labelData = req.body;

    const updatedLabel = await labelService.updateLabel(labelId, labelData);
    if (updatedLabel === 0)
      throw boom.badRequest(
        'The update label operation returns 0 rows affected',
      );

    res.status(200).json({
      message: 'The card member was successfully updated',
      updatedLabel,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLabel = async (req, res, next) => {
  try {
    const { labelId } = req.params;

    const deletedCard = await labelService.deleteLabel(labelId);

    res.status(200).json({
      message: 'The card member was successfully removed',
      deletedCard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLabels,
  createLabel,
  updateLabel,
  deleteLabel,
  getLabelsByCard,
  updateLabelVisibilityInCard,
};
