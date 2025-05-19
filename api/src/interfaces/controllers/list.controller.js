const { listService } = require('../../application/services/index');

const getLists = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const lists = await listService.findAll(projectId);

    res.status(200).json({ lists });
  } catch (error) {
    next(error);
  }
};

const createList = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const listName = req.body;

    const newList = await listService.create({ projectId, ...listName });

    res.status(201).json({ newList });
  } catch (error) {
    next(error);
  }
};

const updateList = async (req, res, next) => {
  try {
    const { projectId, listId } = req.params;
    const { newName } = req.body;

    const updatedList = await listService.update(projectId, listId, newName);

    res.status(200).json({ updatedList });
  } catch (error) {
    next(error);
  }
};

const deleteList = async (req, res, next) => {
  try {
    const { projectId, listId } = req.params;

    const deletedList = await listService.delete(projectId, listId);

    res
      .status(200)
      .json({ message: 'The list was deleted successfully', deletedList });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLists,
  createList,
  updateList,
  deleteList,
};
