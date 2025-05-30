const boom = require('@hapi/boom');
const ChecklistName = require('../../../domain/value-objects/checklistName');
const ChecklistDto = require('../../dtos/checklist.dto');

class UpdateChecklistUseCase {
  constructor({ checklistRepository }) {
    this.checklistRepository = checklistRepository;
  }

  async execute(checklistId, checklistData) {
    if (!checklistId) throw new Error('checklistId was not provided');
    if (!checklistData?.newName) throw new Error('newName was not provided');
    const updateChecklistEntity = new ChecklistName(checklistData.newName)
      .value;

    const [updatedRows, [updatedChecklist]] =
      await this.checklistRepository.update(checklistId, {
        name: updateChecklistEntity,
      });
    if (updatedRows === 0)
      throw boom.badRequest(
        'Something went wrong updating the checklist because 0 rows was affected',
      );

    return new ChecklistDto(updatedChecklist);
  }
}

module.exports = UpdateChecklistUseCase;
